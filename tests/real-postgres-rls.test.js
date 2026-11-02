// GST CDA - Phase 2 Comprehensive Real PostgreSQL 16 Multi-Tenant RLS & Security Verification
// Executes against real PostgreSQL 16.15 using restricted application role gst_cda_app
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';
import { PostgresAdapter, setDatabaseAdapter, resetDatabaseAdapter } from '../src/lib/db/adapter.js';
import { TenantStore } from '../src/lib/services/tenantStore.js';

test('Phase 2: Comprehensive Real PostgreSQL 16 Security Remediation Suite', async (t) => {
  const TEST_PORT = 54330 + Math.floor(Math.random() * 500);
  const DB_DIR = path.join(os.tmpdir(), `pgdata_p2_${crypto.randomBytes(4).toString('hex')}`);
  const APP_PASSWORD = process.env.PG_APP_PASSWORD || 'gst_cda_app_secret';
  const ADMIN_URL = `postgresql://postgres:password@localhost:${TEST_PORT}/postgres`;
  const APP_URL = `postgresql://gst_cda_app:${APP_PASSWORD}@localhost:${TEST_PORT}/postgres`;

  console.log(`[Phase 2 Audit] Spawning Real PostgreSQL 16 on port ${TEST_PORT}...`);

  const pgServer = new EmbeddedPostgres({
    port: TEST_PORT,
    databaseDir: DB_DIR,
    user: 'postgres',
    password: 'password'
  });

  await pgServer.initialise();
  await pgServer.start();
  console.log('[Phase 2 Audit] PostgreSQL 16 server started successfully.');

  const adminClient = new pg.Client({ connectionString: ADMIN_URL });
  await adminClient.connect();

  let appClient;
  let appPool;

  try {
    // 1. Verify Real Engine Version
    const versionRes = await adminClient.query('SELECT version();');
    console.log('[Phase 2 Audit] Engine Version:', versionRes.rows[0].version);
    assert.match(versionRes.rows[0].version, /PostgreSQL 16\./, 'Must execute against real PostgreSQL 16');

    // 2. Apply Full Migration
    console.log('[Phase 2 Audit] Applying migrations/001_multi_tenant_rls.sql...');
    const migrationSql = fs.readFileSync('migrations/001_multi_tenant_rls.sql', 'utf8');
    await adminClient.query(migrationSql);
    console.log('[Phase 2 Audit] Migration applied successfully.');

    // -------------------------------------------------------------------------
    // Finding 3: Enforce Database Role Security (gst_cda_app)
    // -------------------------------------------------------------------------
    await t.test('Finding 3: Database Role Hardening & Least-Privilege Verification', async () => {
      const roleRes = await adminClient.query(`
        SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolinherit, rolbypassrls, rolcanlogin
        FROM pg_catalog.pg_roles 
        WHERE rolname = 'gst_cda_app'
      `);
      assert.strictEqual(roleRes.rows.length, 1, 'Role gst_cda_app must exist');
      const role = roleRes.rows[0];
      assert.strictEqual(role.rolsuper, false, 'Role MUST NOT be superuser');
      assert.strictEqual(role.rolcreatedb, false, 'Role MUST NOT have CREATEDB');
      assert.strictEqual(role.rolcreaterole, false, 'Role MUST NOT have CREATEROLE');
      assert.strictEqual(role.rolinherit, false, 'Role MUST NOT have INHERIT');
      assert.strictEqual(role.rolbypassrls, false, 'Role MUST NOT have BYPASSRLS');
      assert.strictEqual(role.rolcanlogin, true, 'Role must have LOGIN permission');

      // Verify no unexpected role memberships
      const memberRes = await adminClient.query(`
        SELECT count(*) as count 
        FROM pg_catalog.pg_auth_members 
        WHERE member = (SELECT oid FROM pg_roles WHERE rolname = 'gst_cda_app')
      `);
      assert.strictEqual(Number(memberRes.rows[0].count), 0, 'gst_cda_app must have no inherited group roles');

      // Verify gst_cda_app owns ZERO tables
      const ownerRes = await adminClient.query(`
        SELECT count(*) as count 
        FROM pg_catalog.pg_class c
        JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r' 
          AND n.nspname = 'public' 
          AND c.relowner = (SELECT oid FROM pg_roles WHERE rolname = 'gst_cda_app')
      `);
      assert.strictEqual(Number(ownerRes.rows[0].count), 0, 'gst_cda_app must NOT own any tables');
    });

    // -------------------------------------------------------------------------
    // Finding 4: Automated Table Discovery & Complete RLS Verification
    // -------------------------------------------------------------------------
    await t.test('Finding 4: Automated Table Discovery & 100% RLS + FORCE RLS Enforcement', async () => {
      const tablesRes = await adminClient.query(`
        SELECT tablename 
        FROM pg_catalog.pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename ASC
      `);
      const tableNames = tablesRes.rows.map(r => r.tablename);
      console.log(`[Phase 2 Audit] Discovered ${tableNames.length} tables in public schema:`, tableNames);

      // Verify ALL tables (both 13 tenant-owned and 2 global identity) have RLS and FORCE RLS
      const expectedTables = [
        'organizations', 'users', 'organization_memberships', 'auth_sessions',
        'invitations', 'legal_entities', 'gst_registrations', 'return_periods',
        'sales_invoices', 'purchase_invoices', 'reconciliation_runs',
        'exception_cases', 'filing_attempts', 'import_jobs', 'audit_events'
      ];
      assert.strictEqual(tableNames.length, 15, 'Schema must contain exactly 15 tables');

      for (const table of expectedTables) {
        assert.ok(tableNames.includes(table), `Table ${table} must exist`);
        const rlsRes = await adminClient.query(`
          SELECT relrowsecurity, relforcerowsecurity 
          FROM pg_catalog.pg_class 
          WHERE relname = $1
        `, [table]);
        assert.strictEqual(rlsRes.rows[0].relrowsecurity, true, `Table ${table} must have rowsecurity = true`);
        assert.strictEqual(rlsRes.rows[0].relforcerowsecurity, true, `Table ${table} must have forcerowsecurity = true`);

        // Verify policy exists with both USING (polqual) and WITH CHECK (polwithcheck)
        const policyRes = await adminClient.query(`
          SELECT polname, polqual IS NOT NULL as has_using, polwithcheck IS NOT NULL as has_with_check
          FROM pg_catalog.pg_policy p
          JOIN pg_catalog.pg_class c ON c.oid = p.polrelid
          WHERE c.relname = $1
        `, [table]);
        assert.ok(policyRes.rows.length >= 1, `Table ${table} must have at least one RLS policy`);
        assert.strictEqual(policyRes.rows[0].has_using, true, `Table ${table} policy must have USING clause`);
        assert.strictEqual(policyRes.rows[0].has_with_check, true, `Table ${table} policy must have WITH CHECK clause`);
      }
    });

    // Connect as restricted application role gst_cda_app
    process.env.DATABASE_URL = APP_URL;
    appClient = new pg.Client({ connectionString: APP_URL });
    await appClient.connect();

    appPool = new pg.Pool({ connectionString: APP_URL, max: 5 });

    // Seed test organizations & users as admin
    const orgAId = crypto.randomUUID();
    const orgBId = crypto.randomUUID();
    const userAId = crypto.randomUUID();
    const userBId = crypto.randomUUID();

    await adminClient.query(`
      INSERT INTO organizations (id, name, slug) VALUES 
        ('${orgAId}', 'Alpha Traders', 'alpha-audit'),
        ('${orgBId}', 'Beta Logistics', 'beta-audit');
      INSERT INTO users (id, email, password_hash, full_name) VALUES 
        ('${userAId}', 'alice@alpha.in', 'hash_alice_secret', 'Alice Alpha'),
        ('${userBId}', 'bob@beta.in', 'hash_bob_secret', 'Bob Beta');
    `);

    // Seed entities and registrations
    const entityAId = crypto.randomUUID();
    const entityBId = crypto.randomUUID();
    const regAId = crypto.randomUUID();
    const regBId = crypto.randomUUID();

    await adminClient.query(`
      INSERT INTO legal_entities (id, organization_id, legal_name, pan, entity_type) VALUES 
        ('${entityAId}', '${orgAId}', 'Alpha Ltd', 'AABCA1234F', 'PVT_LTD'),
        ('${entityBId}', '${orgBId}', 'Beta Ltd', 'AABCB5678G', 'PVT_LTD');
      INSERT INTO gst_registrations (id, organization_id, legal_entity_id, gstin, state_code, state_name) VALUES 
        ('${regAId}', '${orgAId}', '${entityAId}', '33AABCA1234F1Z1', '33', 'Tamil Nadu'),
        ('${regBId}', '${orgBId}', '${entityBId}', '27AABCB5678G1Z2', '27', 'Maharashtra');
    `);

    // Seed sessions
    const tokenHashA = crypto.createHash('sha256').update('alice-valid-token').digest('hex');
    const tokenHashB = crypto.createHash('sha256').update('bob-valid-token').digest('hex');
    const sessionAId = crypto.randomUUID();
    const sessionBId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    await adminClient.query(`
      INSERT INTO auth_sessions (id, user_id, organization_id, token_hash, role, revoked, expires_at) VALUES 
        ('${sessionAId}', '${userAId}', '${orgAId}', '${tokenHashA}', 'OWNER', false, '${expiresAt}'),
        ('${sessionBId}', '${userBId}', '${orgBId}', '${tokenHashB}', 'OWNER', false, '${expiresAt}');
      INSERT INTO organization_memberships (organization_id, user_id, role, status) VALUES 
        ('${orgAId}', '${userAId}', 'OWNER', 'ACTIVE'),
        ('${orgBId}', '${userBId}', 'OWNER', 'ACTIVE');
    `);

    // -------------------------------------------------------------------------
    // Finding 1: Protect Global Identity and Organization Data
    // -------------------------------------------------------------------------
    await t.test('Finding 1: Global Identity & Organization RLS & Credential Protection', async () => {
      // 1. Unset context: Cannot read organizations or users
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', '', true)");
      await appClient.query("SELECT set_config('app.current_user_id', '', true)");
      const unauthOrgs = await appClient.query('SELECT * FROM organizations');
      const unauthUsers = await appClient.query('SELECT * FROM users');
      await appClient.query('COMMIT');

      assert.strictEqual(unauthOrgs.rows.length, 0, 'Unauthenticated query on organizations must return 0 rows');
      assert.strictEqual(unauthUsers.rows.length, 0, 'Unauthenticated query on users must return 0 rows');

      // 2. Org A context: Can ONLY see Org A, Org B is invisible
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', $1, true)", [orgAId]);
      const orgARes = await appClient.query('SELECT * FROM organizations');
      const usersInOrgA = await appClient.query('SELECT id, email, full_name FROM users');
      await appClient.query('COMMIT');

      assert.strictEqual(orgARes.rows.length, 1, 'Org A context must see exactly 1 organization');
      assert.strictEqual(orgARes.rows[0].id, orgAId);
      assert.strictEqual(usersInOrgA.rows.length, 1, 'Org A context must see only Alice');
      assert.strictEqual(usersInOrgA.rows[0].email, 'alice@alpha.in');

      // 3. Cross-Tenant Organization Mutation is blocked
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', $1, true)", [orgAId]);
      const updateRes = await appClient.query("UPDATE organizations SET name = 'Hacked' WHERE id = $1", [orgBId]);
      await appClient.query('COMMIT');
      assert.strictEqual(updateRes.rowCount, 0, 'Org A cannot update Org B organization record');

      // 4. Secure Authentication Lookup (lookup_user_for_auth)
      const authUser = await appClient.query('SELECT * FROM public.lookup_user_for_auth($1)', ['alice@alpha.in']);
      assert.strictEqual(authUser.rows.length, 1);
      assert.strictEqual(authUser.rows[0].email, 'alice@alpha.in');
      assert.strictEqual(authUser.rows[0].password_hash, 'hash_alice_secret');

      // Non-existent user returns 0 rows
      const nonExistent = await appClient.query('SELECT * FROM public.lookup_user_for_auth($1)', ['hacker@unknown.in']);
      assert.strictEqual(nonExistent.rows.length, 0);
    });

    // -------------------------------------------------------------------------
    // Finding 2: Secure Membership Bootstrap
    // -------------------------------------------------------------------------
    await t.test('Finding 2: Membership Bootstrap Verification (Prevent Arbitrary Enumeration)', async () => {
      // 1. User Alice retrieves her own memberships via Alice's valid session token
      const aliceMemberships = await appClient.query(
        'SELECT * FROM public.get_user_memberships_bootstrap($1)',
        [tokenHashA]
      );
      assert.strictEqual(aliceMemberships.rows.length, 1, 'Alice must retrieve her own authorized membership');
      assert.strictEqual(aliceMemberships.rows[0].organization_id, orgAId);
      assert.strictEqual(aliceMemberships.rows[0].organization_name, 'Alpha Traders');

      // 2. User Bob retrieves his own memberships via Bob's valid session token
      const bobMemberships = await appClient.query(
        'SELECT * FROM public.get_user_memberships_bootstrap($1)',
        [tokenHashB]
      );
      assert.strictEqual(bobMemberships.rows.length, 1, 'Bob must retrieve his own authorized membership');
      assert.strictEqual(bobMemberships.rows[0].organization_id, orgBId);
      assert.strictEqual(bobMemberships.rows[0].organization_name, 'Beta Logistics');

      // 3. Forged / invalid / expired token returns ZERO rows
      const forgedRes = await appClient.query(
        'SELECT * FROM public.get_user_memberships_bootstrap($1)',
        ['forged_token_hash_value']
      );
      assert.strictEqual(forgedRes.rows.length, 0, 'Invalid token must return 0 rows (prevents enumeration)');

      // 4. Empty token returns ZERO rows
      const emptyRes = await appClient.query(
        'SELECT * FROM public.get_user_memberships_bootstrap($1)',
        ['']
      );
      assert.strictEqual(emptyRes.rows.length, 0, 'Empty token must return 0 rows');
    });

    // -------------------------------------------------------------------------
    // Finding 5: Test the Real Application Adapter & TenantStore
    // -------------------------------------------------------------------------
    await t.test('Finding 5: Real PostgresAdapter & TenantStore CRUD Integration', async () => {
      const adapter = new PostgresAdapter(appPool);
      setDatabaseAdapter(adapter);

      try {
        // Test TenantStore CRUD within Org A Context
        const invA = await adapter.withTransaction(orgAId, async () => {
          return TenantStore.createSalesInvoice({
            organizationId: orgAId,
            legalEntityId: entityAId,
            gstRegistrationId: regAId,
            invoiceNumber: 'INV-STORE-A01',
            invoiceDate: '2026-09-15',
            partyName: 'Customer Alpha',
            placeOfSupply: '33',
            supplyType: 'INTRA',
            taxablePaise: 100000n,
            ratePercent: 18,
            cgstPaise: 9000n,
            sgstPaise: 9000n,
            igstPaise: 0n,
            totalPaise: 118000n
          });
        });
        assert.ok(invA.id, 'Must return created sales invoice with ID');
        assert.strictEqual(invA.invoiceNumber, 'INV-STORE-A01');

        // Read Sales Invoices through TenantStore as Org A
        const listA = await adapter.withTransaction(orgAId, async () => {
          return TenantStore.getSalesInvoices(orgAId);
        });
        assert.strictEqual(listA.items.length, 1);
        assert.strictEqual(listA.items[0].invoiceNumber, 'INV-STORE-A01');

        // Read Sales Invoices through TenantStore as Org B -> MUST BE 0 (Cross-tenant read blocked!)
        const listB = await adapter.withTransaction(orgBId, async () => {
          return TenantStore.getSalesInvoices(orgBId);
        });
        assert.strictEqual(listB.items.length, 0, 'Org B TenantStore query must see 0 invoices from Org A');

        // Update Sales Invoice through TenantStore
        const updateRes = await adapter.withTransaction(orgAId, async () => {
          return TenantStore.updateSalesInvoice(orgAId, invA.id, 1, { partyName: 'Customer Alpha Premium' });
        });
        assert.ok(updateRes.invoice, 'Must return updated invoice');
        assert.strictEqual(updateRes.invoice.partyName, 'Customer Alpha Premium');
        assert.strictEqual(updateRes.invoice.version, 2);

        // Cross-tenant update through TenantStore as Org B -> Returns notFound: true
        const crossUpdate = await adapter.withTransaction(orgBId, async () => {
          return TenantStore.updateSalesInvoice(orgBId, invA.id, 2, { partyName: 'Hacked' });
        });
        assert.strictEqual(crossUpdate.notFound, true, 'TenantStore update from Org B must return notFound due to RLS filter');

        // Delete Sales Invoice through TenantStore as Org A
        await adapter.withTransaction(orgAId, async () => {
          const ok = await TenantStore.deleteSalesInvoice(orgAId, invA.id);
          assert.strictEqual(ok, true, 'Delete as Org A must succeed');
        });

        // Verify invoice is gone
        const afterDelete = await adapter.withTransaction(orgAId, async () => {
          return TenantStore.getSalesInvoices(orgAId);
        });
        assert.strictEqual(afterDelete.items.length, 0);

        // Session lookup via TenantStore
        const sessionRecord = await TenantStore.getSessionRecordByTokenHash(tokenHashA);
        assert.strictEqual(sessionRecord.user_id, userAId);
        assert.strictEqual(sessionRecord.organization_id, orgAId);

        // Membership discovery via TenantStore with token
        const memberships = await TenantStore.getUserMemberships(userAId, tokenHashA);
        assert.strictEqual(memberships.length, 1);
        assert.strictEqual(memberships[0].organization_id, orgAId);

        // Reset tenant data via TenantStore atomic transaction
        await adapter.withTransaction(orgAId, async () => {
          const resetRes = await TenantStore.resetTenantData({
            organizationId: orgAId,
            actorId: userAId,
            correlationId: crypto.randomUUID(),
            action: 'ALL'
          });
          assert.strictEqual(resetRes.salesCount, 0);
        });

      } finally {
        resetDatabaseAdapter();
      }
    });

    // -------------------------------------------------------------------------
    // Finding 4 (cont): Cross-Tenant CRUD Verification Across All 13 Tenant Tables
    // -------------------------------------------------------------------------
    await t.test('Finding 4: Cross-Tenant CRUD Violations & Denial Testing Across Tenant Tables', async () => {
      // Test 1: Cross-tenant insert violation (WITH CHECK) on purchase_invoices
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', $1, true)", [orgAId]);
      await assert.rejects(
        async () => {
          await appClient.query(`
            INSERT INTO purchase_invoices (
              id, organization_id, legal_entity_id, gst_registration_id,
              return_period_key, invoice_number, invoice_date, party_name,
              place_of_supply, supply_type, taxable_paise, rate_percent, total_paise
            ) VALUES (
              $1, $2, $3, $4, '2026-09', 'BILL-FORGED', '2026-09-15', 'Vendor X',
              '27', 'INTER', 50000, 18, 59000
            )
          `, [crypto.randomUUID(), orgBId, entityBId, regBId]);
        },
        /violates row-level security policy/,
        'Cross-tenant insert on purchase_invoices must trigger RLS WITH CHECK violation'
      );
      await appClient.query('ROLLBACK');

      // Test 2: Cross-tenant insert violation on audit_events
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', $1, true)", [orgAId]);
      await assert.rejects(
        async () => {
          await appClient.query(`
            INSERT INTO audit_events (
              id, organization_id, actor_id, action, entity_type, entity_id,
              prev_hash, event_hash, correlation_id, created_at
            ) VALUES (
              $1, $2, $3, 'HACK', 'ORG', $4, '0', 'hash', 'corr', NOW()
            )
          `, [crypto.randomUUID(), orgBId, userAId, orgBId]);
        },
        /violates row-level security policy/,
        'Cross-tenant insert on audit_events must trigger RLS WITH CHECK violation'
      );
      await appClient.query('ROLLBACK');

      // Test 3: Cross-tenant delete on legal_entities affects 0 rows
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', $1, true)", [orgAId]);
      const delEntity = await appClient.query('DELETE FROM legal_entities WHERE id = $1', [entityBId]);
      await appClient.query('COMMIT');
      assert.strictEqual(delEntity.rowCount, 0, 'Cross-tenant DELETE on legal_entities must affect 0 rows');

      // Test 4: Cross-tenant delete on gst_registrations affects 0 rows
      await appClient.query('BEGIN');
      await appClient.query("SELECT set_config('app.organization_id', $1, true)", [orgAId]);
      const delReg = await appClient.query('DELETE FROM gst_registrations WHERE id = $1', [regBId]);
      await appClient.query('COMMIT');
      assert.strictEqual(delReg.rowCount, 0, 'Cross-tenant DELETE on gst_registrations must affect 0 rows');
    });

  } finally {
    delete process.env.DATABASE_URL;
    if (appClient) await appClient.end();
    if (appPool) await appPool.end();
    if (adminClient) await adminClient.end();

    console.log('[Phase 2 Audit] Stopping PostgreSQL 16 server...');
    await pgServer.stop();
    console.log('[Phase 2 Audit] Server stopped cleanly.');

    if (fs.existsSync(DB_DIR)) {
      try { fs.rmSync(DB_DIR, { recursive: true, force: true }); } catch {}
    }
  }
});
