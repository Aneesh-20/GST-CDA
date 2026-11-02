// GST CDA - Pluggable Database Adapter Architecture
// Provides a unified interface for PostgreSQL (Production / Test) and SQLite WAL (Dev / Local Fallback)
import { AsyncLocalStorage } from 'node:async_hooks';
import { getPool, withTenantTransaction, query as pgQuery } from './postgres.js';
import { getTenantDb } from '../services/tenantStore.js';

export const tenantContextStorage = new AsyncLocalStorage();

/**
 * Propagate tenant context across asynchronous call chains safely
 */
export function withTenantContext(organizationId, callback) {
  if (!organizationId) {
    throw new Error('Tenant context requires an organizationId');
  }
  return tenantContextStorage.run({ organizationId }, callback);
}

export function getActiveOrganizationId() {
  const store = tenantContextStorage.getStore();
  return store?.organizationId || null;
}

/**
 * Base Database Adapter Interface
 */
export class DatabaseAdapter {
  get dialect() {
    throw new Error('dialect must be implemented');
  }

  async queryOne(sql, params = []) {
    throw new Error('queryOne must be implemented');
  }

  async queryAll(sql, params = []) {
    throw new Error('queryAll must be implemented');
  }

  async execute(sql, params = []) {
    throw new Error('execute must be implemented');
  }

  async withTransaction(organizationId, callback) {
    throw new Error('withTransaction must be implemented');
  }
}

/**
 * PostgreSQL Adapter implementation using connection pool and RLS
 */
export class PostgresAdapter extends DatabaseAdapter {
  constructor(pool = null) {
    super();
    this._pool = pool;
  }

  get dialect() {
    return 'postgres';
  }

  getPool() {
    return this._pool || getPool();
  }

  async queryOne(sql, params = []) {
    const res = await this.queryAll(sql, params);
    return res[0] || null;
  }

  async queryAll(sql, params = []) {
    const store = tenantContextStorage.getStore();
    if (store?.client) {
      const res = await store.client.query(sql, params);
      return res.rows;
    }
    const orgId = store?.organizationId || getActiveOrganizationId();
    if (orgId) {
      return withTenantTransaction(orgId, async (client) => {
        const res = await client.query(sql, params);
        return res.rows;
      });
    }
    const res = await this.getPool().query(sql, params);
    return res.rows;
  }

  async execute(sql, params = []) {
    const store = tenantContextStorage.getStore();
    if (store?.client) {
      const res = await store.client.query(sql, params);
      return { rowCount: res.rowCount, rows: res.rows };
    }
    const orgId = store?.organizationId || getActiveOrganizationId();
    if (orgId) {
      return withTenantTransaction(orgId, async (client) => {
        const res = await client.query(sql, params);
        return { rowCount: res.rowCount, rows: res.rows };
      });
    }
    const res = await this.getPool().query(sql, params);
    return { rowCount: res.rowCount, rows: res.rows };
  }

  async withTransaction(organizationId, callback) {
    const store = tenantContextStorage.getStore();
    if (store?.client) {
      const txAdapter = new PostgresTransactionAdapter(store.client);
      return await callback(txAdapter);
    }
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      if (organizationId) {
        await client.query("SELECT set_config('app.organization_id', $1, true)", [organizationId]);
      } else {
        await client.query("SELECT set_config('app.organization_id', '', true)");
      }
      const txAdapter = new PostgresTransactionAdapter(client);
      const result = await tenantContextStorage.run({ organizationId, client }, () => callback(txAdapter));
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      try {
        await client.query("SELECT set_config('app.organization_id', '', false)");
      } catch {}
      client.release();
    }
  }
}

class PostgresTransactionAdapter extends DatabaseAdapter {
  constructor(client) {
    super();
    this.client = client;
  }

  get dialect() {
    return 'postgres';
  }

  async queryOne(sql, params = []) {
    const res = await this.client.query(sql, params);
    return res.rows[0] || null;
  }

  async queryAll(sql, params = []) {
    const res = await this.client.query(sql, params);
    return res.rows;
  }

  async execute(sql, params = []) {
    const res = await this.client.query(sql, params);
    return { rowCount: res.rowCount, rows: res.rows };
  }

  async withTransaction(orgId, callback) {
    // Already in transaction
    return callback(this);
  }
}

/**
 * SQLite Adapter implementation using node:sqlite in WAL mode
 */
export class SqliteAdapter extends DatabaseAdapter {
  constructor(dbInstance = null) {
    super();
    this._db = dbInstance;
  }

  get dialect() {
    return 'sqlite';
  }

  getDb() {
    return this._db || getTenantDb();
  }

  _normalizeSql(sql) {
    // Converts $1, $2, ... placeholders to ? for node:sqlite compatibility
    return sql.replace(/\$\d+/g, '?');
  }

  async queryOne(sql, params = []) {
    const db = this.getDb();
    const normalized = this._normalizeSql(sql);
    return db.prepare(normalized).get(...params) || null;
  }

  async queryAll(sql, params = []) {
    const db = this.getDb();
    const normalized = this._normalizeSql(sql);
    return db.prepare(normalized).all(...params);
  }

  async execute(sql, params = []) {
    const db = this.getDb();
    const normalized = this._normalizeSql(sql);
    const result = db.prepare(normalized).run(...params);
    return { rowCount: result.changes, lastInsertRowid: result.lastInsertRowid };
  }

  async withTransaction(organizationId, callback) {
    const db = this.getDb();
    db.exec('BEGIN IMMEDIATE');
    try {
      const result = await withTenantContext(organizationId, async () => {
        return callback(this);
      });
      db.exec('COMMIT');
      return result;
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  }
}

let activeAdapterInstance = null;

/**
 * Resolves the appropriate database adapter:
 * - In production: Must fail closed if DATABASE_URL is missing or non-PostgreSQL.
 * - In dev/test: Uses PostgreSQL if DATABASE_URL is set, otherwise falls back to SQLite WAL.
 */
export function getDatabaseAdapter() {
  if (activeAdapterInstance) {
    return activeAdapterInstance;
  }

  const dbUrl = process.env.DATABASE_URL;

  // Strict Fail-Closed Check in Production
  if (process.env.NODE_ENV === 'production') {
    if (!dbUrl || (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://'))) {
      throw new Error(
        'FATAL CONFIGURATION ERROR: PostgreSQL DATABASE_URL is mandatory in production environment. SQLite fallback is strictly prohibited.'
      );
    }
    activeAdapterInstance = new PostgresAdapter();
    return activeAdapterInstance;
  }

  // Development / Test Environments
  if (dbUrl && !dbUrl.includes('sqlite') && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
    activeAdapterInstance = new PostgresAdapter();
    return activeAdapterInstance;
  }

  // Safe Local SQLite fallback for dev/test
  activeAdapterInstance = new SqliteAdapter();
  return activeAdapterInstance;
}

export function setDatabaseAdapter(adapter) {
  activeAdapterInstance = adapter;
}

export function resetDatabaseAdapter() {
  activeAdapterInstance = null;
}

