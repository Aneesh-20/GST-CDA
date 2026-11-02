// GST CDA - PostgreSQL Connection Pool & Parameterized RLS Executor
import pg from 'pg';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const esmRequire = createRequire(import.meta.url);

let poolInstance = null;
let pgMemDb = null;

export function getPool() {
  if (poolInstance) return poolInstance;

  const dbUrl = process.env.DATABASE_URL;

  // Enforce fail-closed policy in production environment
  if (process.env.NODE_ENV === 'production') {
    if (!dbUrl || (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://'))) {
      throw new Error(
        'FATAL CONFIGURATION ERROR: PostgreSQL DATABASE_URL is mandatory in production environment. SQLite fallback is strictly prohibited.'
      );
    }
  }

  // If live DATABASE_URL is provided, connect to live PostgreSQL
  if (dbUrl && !dbUrl.includes('sqlite') && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
    poolInstance = new pg.Pool({
      connectionString: dbUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    return poolInstance;
  }

  // In test / development without external postgres, initialize pg-mem emulator
  if (process.env.NODE_ENV !== 'production') {
    return getPgMemPool();
  }

  throw new Error('FATAL CONFIGURATION ERROR: PostgreSQL DATABASE_URL is required.');
}

export function getPgMemPool() {
  if (poolInstance) return poolInstance;

  try {
    const { newDb } = esmRequire('pg-mem');
    pgMemDb = newDb();

    // Register PostgreSQL extensions
    pgMemDb.public.registerFunction({
      name: 'gen_random_uuid',
      returns: pgMemDb.public.getType('uuid'),
      implementation: () => crypto.randomUUID()
    });

    const sessionSettings = new Map();
    const pgCatalog = pgMemDb.getSchema('pg_catalog');

    pgCatalog.registerFunction({
      name: 'set_config',
      args: [pgMemDb.public.getType('text'), pgMemDb.public.getType('text'), pgMemDb.public.getType('bool')],
      returns: pgMemDb.public.getType('text'),
      impure: true,
      implementation: (name, val, _isLocal) => {
        sessionSettings.set(name, val);
        return val;
      }
    });

    pgCatalog.registerFunction({
      name: 'current_setting',
      args: [pgMemDb.public.getType('text'), pgMemDb.public.getType('bool')],
      returns: pgMemDb.public.getType('text'),
      impure: true,
      implementation: (name, missingOk) => {
        const val = sessionSettings.get(name);
        if (val !== undefined && val !== null && val !== '') return val;
        if (missingOk) return null;
        throw new Error(`unrecognized configuration parameter "${name}"`);
      }
    });

    pgCatalog.registerFunction({
      name: 'current_setting',
      args: [pgMemDb.public.getType('text')],
      returns: pgMemDb.public.getType('text'),
      impure: true,
      implementation: (name) => {
        const val = sessionSettings.get(name);
        if (val !== undefined && val !== null && val !== '') return val;
        throw new Error(`unrecognized configuration parameter "${name}"`);
      }
    });

    const pgAdapter = pgMemDb.adapters.createPg();
    poolInstance = new pgAdapter.Pool();
    return poolInstance;
  } catch (err) {
    // If pg-mem cannot be loaded, fallback to standard pg Pool
    poolInstance = new pg.Pool();
    return poolInstance;
  }
}

/**
 * Executes a callback within a transactional client with tenant RLS scope
 * Securely sets app.organization_id via PostgreSQL set_config
 */
export async function withTenantTransaction(organizationId, callback) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (organizationId) {
      // Securely parameterize tenant scope to prevent SQL injection (transaction-local)
      await client.query("SELECT set_config('app.organization_id', $1, true)", [organizationId]);
    } else {
      // Unset scope - causes RLS NULLIF to evaluate to NULL and deny access
      await client.query("SELECT set_config('app.organization_id', '', true)");
    }
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    // Clean session setting before releasing back to the pool to prevent leakage
    try {
      await client.query("SELECT set_config('app.organization_id', '', false)");
    } catch {
      // Connection severed or closed, ignore
    }
    client.release();
  }
}

export async function query(text, params = []) {
  const pool = getPool();
  return pool.query(text, params);
}

export async function closePool() {
  if (poolInstance) {
    await poolInstance.end();
    poolInstance = null;
    pgMemDb = null;
  }
}
