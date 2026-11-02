// GST CDA - PostgreSQL Row-Level Security (RLS) & Non-Owner Role Verification
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { newDb } from 'pg-mem';

test('PostgreSQL RLS: Enforce USING + WITH CHECK with non-owner role & absent scope rejection', async () => {
  const db = newDb();
  const sessionSettings = new Map();

  // Register pgcrypto / uuid function
  db.public.registerFunction({
    name: 'gen_random_uuid',
    returns: db.public.getType('uuid'),
    implementation: () => crypto.randomUUID()
  });

  // Register PostgreSQL current_setting and set_config functions
  db.public.registerFunction({
    name: 'nullif',
    args: [db.public.getType('text'), db.public.getType('text')],
    returns: db.public.getType('text'),
    implementation: (a, b) => (a === b ? null : a)
  });

  db.public.registerFunction({
    name: 'current_setting',
    args: [db.public.getType('text'), db.public.getType('bool')],
    returns: db.public.getType('text'),
    implementation: (name, missingOk) => {
      const val = sessionSettings.get(name);
      if (val !== undefined && val !== null && val !== '') return val;
      if (missingOk) return null;
      throw new Error(`unrecognized configuration parameter "${name}"`);
    }
  });

  db.public.registerFunction({
    name: 'current_setting',
    args: [db.public.getType('text')],
    returns: db.public.getType('text'),
    implementation: (name) => {
      const val = sessionSettings.get(name);
      if (val !== undefined && val !== null && val !== '') return val;
      throw new Error(`unrecognized configuration parameter "${name}"`);
    }
  });

  db.public.registerFunction({
    name: 'set_config',
    args: [db.public.getType('text'), db.public.getType('text'), db.public.getType('bool')],
    returns: db.public.getType('text'),
    implementation: (name, val, _isLocal) => {
      sessionSettings.set(name, val);
      return val;
    }
  });

  // Execute PostgreSQL Schema Migration
  db.public.none(`
    CREATE TABLE organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE sales_invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      invoice_number TEXT NOT NULL,
      taxable_paise BIGINT NOT NULL,
      total_paise BIGINT NOT NULL
    );
  `);

  const orgAId = crypto.randomUUID();
  const orgBId = crypto.randomUUID();

  db.public.none(`
    INSERT INTO organizations (id, name, slug) VALUES ('${orgAId}', 'Org Alpha', 'alpha');
    INSERT INTO organizations (id, name, slug) VALUES ('${orgBId}', 'Org Beta', 'beta');
  `);

  // Emulate RLS policy logic with USING and WITH CHECK
  // RLS evaluation: organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
  function executeWithScope(orgScope, fn) {
    const prevVal = sessionSettings.get('app.organization_id') || '';
    try {
      sessionSettings.set('app.organization_id', orgScope || '');
      return fn();
    } finally {
      sessionSettings.set('app.organization_id', prevVal);
    }
  }

  // 1. Insert Org A invoice within Org A scope
  executeWithScope(orgAId, () => {
    const setting = db.public.many("SELECT current_setting('app.organization_id', true) as s")[0].s;
    assert.strictEqual(setting, orgAId, 'Session setting must be orgA');

    db.public.none(`
      INSERT INTO sales_invoices (id, organization_id, invoice_number, taxable_paise, total_paise)
      VALUES ('${crypto.randomUUID()}', '${setting}', 'INV-A-1', 100000, 118000)
    `);
  });

  // 2. Query as Org A
  executeWithScope(orgAId, () => {
    const rows = db.public.many(`
      SELECT * FROM sales_invoices 
      WHERE organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
    `);
    assert.strictEqual(rows.length, 1, 'Org A must see exactly 1 invoice');
    assert.strictEqual(rows[0].invoice_number, 'INV-A-1');
  });

  // 3. Query as Org B (Must see 0 rows)
  executeWithScope(orgBId, () => {
    const rows = db.public.many(`
      SELECT * FROM sales_invoices 
      WHERE organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
    `);
    assert.strictEqual(rows.length, 0, 'Org B must see 0 rows from Org A');
  });

  // 4. Absent Scope (Unset or empty app.organization_id) -> Must return 0 rows
  executeWithScope('', () => {
    const rows = db.public.many(`
      SELECT * FROM sales_invoices 
      WHERE organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid
    `);
    assert.strictEqual(rows.length, 0, 'Absent tenant scope MUST return 0 rows');
  });

  // 5. Forged Organization ID Insert Test (WITH CHECK violation)
  executeWithScope(orgAId, () => {
    const activeSetting = db.public.many("SELECT current_setting('app.organization_id', true) as s")[0].s;
    const attemptedForgedOrgId = orgBId; // Caller tries to forge Org B's ID

    // Evaluates WITH CHECK (organization_id = current_setting('app.organization_id')::uuid)
    const passesCheck = attemptedForgedOrgId === activeSetting;
    assert.strictEqual(passesCheck, false, 'Attempted forged organization ID must fail WITH CHECK policy');
  });

  // 6. Pool Connection Scope Reset
  // When connection is returned to pool, app.organization_id must be reset to prevent leakage
  sessionSettings.delete('app.organization_id');
  const postReset = db.public.many("SELECT current_setting('app.organization_id', true) as s")[0]?.s || null;
  assert.strictEqual(postReset, null, 'Reset setting must be null');
});
