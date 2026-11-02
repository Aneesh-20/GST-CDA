// GST CDA - PostgreSQL Connection Pool & Parameterized RLS Executor
import pg from 'pg';

let poolInstance = null;
let pgMemDb = null;

export function getPool() {
  if (poolInstance) return poolInstance;

  // If live DATABASE_URL is provided, connect to live PostgreSQL
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sqlite')) {
    poolInstance = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    return poolInstance;
  }

  // In test / development without external postgres, initialize pg-mem emulator
  return getPgMemPool();
}

export function getPgMemPool() {
  if (poolInstance) return poolInstance;

  try {
    const { newDb } = requirePgMem();
    pgMemDb = newDb();

    // Register PostgreSQL extensions
    pgMemDb.public.registerFunction({
      name: 'gen_random_uuid',
      returns: pgMemDb.public.getType('uuid'),
      implementation: () => crypto.randomUUID()
    });

    const pgAdapter = pgMemDb.adapters.createPg();
    poolInstance = new pgAdapter.Pool();
    return poolInstance;
  } catch (err) {
    // If pg-mem cannot be loaded, fallback to default standard pg Pool
    poolInstance = new pg.Pool();
    return poolInstance;
  }
}

function requirePgMem() {
  // Dynamic import/require for test harness
  const { createRequire } = require('node:module');
  const customRequire = createRequire(import.meta.url);
  return customRequire('pg-mem');
}

/**
 * Executes a callback within a transactional client with tenant RLS scope
 * Parameterized SET LOCAL app.organization_id = $1
 */
export async function withTenantTransaction(organizationId, callback) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (organizationId) {
      // Securely parameterize tenant scope to prevent SQL injection
      await client.query('SET LOCAL app.organization_id = $1', [organizationId]);
    } else {
      // Unset scope - causes RLS NULLIF to evaluate to NULL and deny access
      await client.query("SET LOCAL app.organization_id = ''");
    }
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function query(text, params = []) {
  const pool = getPool();
  return pool.query(text, params);
}
