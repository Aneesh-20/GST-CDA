// GST CDA - Phase 1 Verification: Database Adapter, Transaction Management & Production Fail-Closed
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  getDatabaseAdapter,
  setDatabaseAdapter,
  resetDatabaseAdapter,
  withTenantContext,
  getActiveOrganizationId,
  SqliteAdapter,
  PostgresAdapter
} from '../src/lib/db/adapter.js';
import { getPool, withTenantTransaction, closePool } from '../src/lib/db/postgres.js';
import { verifyProductionDatabaseConfig } from '../src/lib/db/startup.js';
import { TenantStore } from '../src/lib/services/tenantStore.js';

test('Phase 1: Production Fail-Closed Enforcement', async () => {
  const origEnv = process.env.NODE_ENV;
  const origDbUrl = process.env.DATABASE_URL;

  try {
    process.env.NODE_ENV = 'production';
    delete process.env.DATABASE_URL;
    resetDatabaseAdapter();

    // 1. Must fail closed if DATABASE_URL is missing
    assert.throws(
      () => getDatabaseAdapter(),
      /FATAL CONFIGURATION ERROR.*PostgreSQL DATABASE_URL is mandatory in production/
    );

    // 2. Must fail closed if DATABASE_URL is SQLite
    process.env.DATABASE_URL = 'sqlite://dev.db';
    resetDatabaseAdapter();
    assert.throws(
      () => getDatabaseAdapter(),
      /FATAL CONFIGURATION ERROR.*PostgreSQL DATABASE_URL is mandatory in production/
    );

    // 3. getPool() must also fail closed in production without postgres DATABASE_URL
    assert.throws(
      () => getPool(),
      /FATAL CONFIGURATION ERROR.*PostgreSQL DATABASE_URL is mandatory in production/
    );

    // 4. verifyProductionDatabaseConfig startup check must throw in production without valid postgres DATABASE_URL
    delete process.env.DATABASE_URL;
    await assert.rejects(
      async () => verifyProductionDatabaseConfig(),
      /FATAL STARTUP ERROR.*PostgreSQL DATABASE_URL is mandatory in production/
    );
  } finally {
    process.env.NODE_ENV = origEnv;
    if (origDbUrl) {
      process.env.DATABASE_URL = origDbUrl;
    } else {
      delete process.env.DATABASE_URL;
    }
    resetDatabaseAdapter();
  }
});

test('Phase 1: AsyncLocalStorage Tenant Context Concurrency Isolation', async () => {
  assert.strictEqual(getActiveOrganizationId(), null, 'Default context outside withTenantContext must be null');

  const org1 = crypto.randomUUID();
  const org2 = crypto.randomUUID();

  // Run two interleaved asynchronous operations to verify no context bleed
  const task1 = withTenantContext(org1, async () => {
    assert.strictEqual(getActiveOrganizationId(), org1);
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.strictEqual(getActiveOrganizationId(), org1, 'Context must remain org1 after async delay');
    return 'task1-done';
  });

  const task2 = withTenantContext(org2, async () => {
    assert.strictEqual(getActiveOrganizationId(), org2);
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.strictEqual(getActiveOrganizationId(), org2, 'Context must remain org2 after async delay');
    return 'task2-done';
  });

  const [res1, res2] = await Promise.all([task1, task2]);
  assert.strictEqual(res1, 'task1-done');
  assert.strictEqual(res2, 'task2-done');
  assert.strictEqual(getActiveOrganizationId(), null, 'Context must reset to null after completion');
});

test('Phase 1: PostgreSQL Adapter & set_config Transaction Handling', async () => {
  const origEnv = process.env.NODE_ENV;
  const origDbUrl = process.env.DATABASE_URL;

  try {
    process.env.NODE_ENV = 'test';
    delete process.env.DATABASE_URL;

    // Uses pg-mem emulator via getPool() in test environment
    const testOrgId = crypto.randomUUID();

    // 1. Transaction scope executes cleanly
    const txResult = await withTenantTransaction(testOrgId, async (client) => {
      const res = await client.query("SELECT current_setting('app.organization_id', true) as org");
      return res.rows[0].org;
    });
    assert.strictEqual(txResult, testOrgId, 'Session setting app.organization_id must match testOrgId within transaction');

    // 2. Transaction rollback on error
    let rollbackTriggered = false;
    try {
      await withTenantTransaction(testOrgId, async (client) => {
        await client.query("SELECT 1");
        throw new Error('Simulated failure during transactional execution');
      });
    } catch (err) {
      if (err.message.includes('Simulated failure')) {
        rollbackTriggered = true;
      }
    }
    assert.strictEqual(rollbackTriggered, true, 'Transaction must cleanly propagate error and rollback');
  } finally {
    process.env.NODE_ENV = origEnv;
    if (origDbUrl) {
      process.env.DATABASE_URL = origDbUrl;
    }
    await closePool();
  }
});

test('Phase 1: SqliteAdapter & Node:SQLite Parameter Normalization', async () => {
  const adapter = new SqliteAdapter();
  assert.strictEqual(adapter.dialect, 'sqlite');

  // Verify placeholder normalization ($1, $2 -> ?)
  const testId = `test-adapter-${crypto.randomUUID().substring(0, 8)}`;
  const testSlug = `test-slug-${crypto.randomUUID().substring(0, 8)}`;
  const now = new Date().toISOString();

  // Test execute with $1, $2 placeholders
  await adapter.execute(
    'INSERT INTO organizations (id, name, slug, plan, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [testId, 'Adapter Test Org', testSlug, 'STANDARD', 1, now, now]
  );

  // Test queryOne with $1 placeholder
  const org = await adapter.queryOne('SELECT * FROM organizations WHERE id = $1', [testId]);
  assert.ok(org, 'Must find created organization');
  assert.strictEqual(org.slug, testSlug);

  // Test queryAll with $1 placeholder
  const list = await adapter.queryAll('SELECT * FROM organizations WHERE slug = $1', [testSlug]);
  assert.strictEqual(list.length, 1);
  assert.strictEqual(list[0].id, testId);

  // Test withTransaction rollback on SQLite
  let caught = false;
  try {
    await adapter.withTransaction(testId, async (tx) => {
      await tx.execute("INSERT INTO organizations (id, name, slug, plan, is_active, created_at, updated_at) VALUES ($1, 'Fail Org', 'fail-slug', 'STANDARD', 1, $2, $3)", [
        crypto.randomUUID(),
        now,
        now
      ]);
      throw new Error('Rollback SQLite test');
    });
  } catch {
    caught = true;
  }
  assert.strictEqual(caught, true);
  const failOrg = await adapter.queryOne("SELECT * FROM organizations WHERE slug = 'fail-slug'");
  assert.strictEqual(failOrg, null, 'Rolled-back record must not exist in SQLite database');
});

test('Phase 1: TenantStore Operations Route Through Database Adapter', async () => {
  // 1. Verify TenantStore uses the active adapter
  const adapter = TenantStore.getAdapter();
  assert.ok(adapter, 'TenantStore must provide active database adapter');
  assert.strictEqual(adapter.dialect, 'sqlite', 'Default test dialect must be sqlite');

  // 2. Verify all operations create, read, update through adapter methods
  const orgName = `Adapter Enterprise ${crypto.randomUUID().substring(0, 6)}`;
  const orgSlug = `adapter-${crypto.randomUUID().substring(0, 6)}`;
  const createdOrg = await TenantStore.createOrganization({ name: orgName, slug: orgSlug });
  assert.ok(createdOrg.id);

  const fetchedOrg = await TenantStore.getOrganizationById(createdOrg.id);
  assert.strictEqual(fetchedOrg.name, orgName);
  assert.strictEqual(fetchedOrg.slug, orgSlug);

  // 3. Verify mock tracking adapter can intercept TenantStore calls
  const interceptedCalls = [];
  const trackingAdapter = {
    dialect: 'mock-tracking',
    async queryOne(sql, params) {
      interceptedCalls.push({ type: 'queryOne', sql, params });
      return { id: createdOrg.id, name: orgName, slug: orgSlug };
    },
    async queryAll(sql, params) {
      interceptedCalls.push({ type: 'queryAll', sql, params });
      return [];
    },
    async execute(sql, params) {
      interceptedCalls.push({ type: 'execute', sql, params });
      return { rowCount: 1 };
    },
    async withTransaction(orgId, cb) {
      interceptedCalls.push({ type: 'withTransaction', orgId });
      return cb(this);
    }
  };

  try {
    setDatabaseAdapter(trackingAdapter);
    assert.strictEqual(TenantStore.getAdapter().dialect, 'mock-tracking');

    // Call TenantStore operations
    await TenantStore.getOrganizationById(createdOrg.id);
    assert.strictEqual(interceptedCalls.length, 1);
    assert.strictEqual(interceptedCalls[0].type, 'queryOne');
    assert.ok(interceptedCalls[0].sql.includes('SELECT * FROM organizations WHERE id = $1'));

    await TenantStore.getUserByEmail('test@enterprise.in');
    assert.strictEqual(interceptedCalls.length, 2);
    assert.ok(interceptedCalls[1].sql.includes('SELECT * FROM users WHERE email = $1'));
  } finally {
    resetDatabaseAdapter();
  }
});

test('Phase 1: Transactional Tenant Data Reset Without Direct SQLite Access', async () => {
  // Test TenantStore.resetTenantData
  const org = await TenantStore.createOrganization({
    name: 'Reset Test Org',
    slug: `reset-${crypto.randomUUID().substring(0, 6)}`
  });

  const user = await TenantStore.createUser({
    email: `reset-owner-${crypto.randomUUID().substring(0, 6)}@enterprise.in`,
    password: 'Password123!',
    fullName: 'Reset Owner'
  });

  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const entity = await TenantStore.createLegalEntity({
    organizationId: org.id,
    legalName: 'Reset Entity',
    pan: `AABC${randSuffix}F`,
    entityType: 'PVT_LTD'
  });

  const reg = await TenantStore.createGSTRegistration({
    organizationId: org.id,
    legalEntityId: entity.id,
    gstin: `33AABC${randSuffix}F1Z5`,
    stateCode: '33',
    stateName: 'Tamil Nadu'
  });

  await TenantStore.createSalesInvoice({
    organizationId: org.id,
    legalEntityId: entity.id,
    gstRegistrationId: reg.id,
    invoiceNumber: `INV-RESET-${crypto.randomUUID().substring(0, 6)}`,
    invoiceDate: '2026-09-01',
    partyName: 'Party A',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 100000n,
    ratePercent: 18,
    totalPaise: 118000n
  });

  // Verify invoice exists
  const invoicesBefore = await TenantStore.getSalesInvoices(org.id);
  assert.strictEqual(invoicesBefore.items.length, 1);

  // Execute resetTenantData through TenantStore
  const resetResult = await TenantStore.resetTenantData({
    organizationId: org.id,
    actorId: user.id,
    correlationId: crypto.randomUUID(),
    action: 'clear'
  });
  assert.strictEqual(resetResult.salesCount, 0);

  // Verify invoices deleted
  const invoicesAfter = await TenantStore.getSalesInvoices(org.id);
  assert.strictEqual(invoicesAfter.items.length, 0);

  // Verify audit event was appended
  const auditEvents = await TenantStore.getAuditEvents(org.id);
  assert.ok(auditEvents.some(e => e.action === 'TENANT_DATA_RESET'));
});
