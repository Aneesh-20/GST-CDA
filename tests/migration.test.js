// GST CDA - Legacy Migration Verification & Reconciliation Test
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { runMigration } from '../scripts/migrate-legacy-data.js';

test('Migration: Verify Legacy SQLite to Multi-Tenant Repository Reconciliation', async () => {
  const legacyPath = path.join(process.cwd(), 'data', 'gst_cda.sqlite');
  
  // Seed sample legacy data if not already present
  if (!fs.existsSync(legacyPath)) {
    const db = new DatabaseSync(legacyPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'OWNER',
        business_name TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS businesses (
        id TEXT PRIMARY KEY,
        user_email TEXT UNIQUE NOT NULL,
        legal_name TEXT NOT NULL,
        trade_name TEXT NOT NULL,
        gstin TEXT NOT NULL,
        pan TEXT NOT NULL,
        state_code TEXT NOT NULL,
        state_name TEXT NOT NULL,
        business_type TEXT NOT NULL,
        return_period TEXT NOT NULL,
        is_demo INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sales_invoices (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        invoice_number TEXT NOT NULL,
        date TEXT NOT NULL,
        party_name TEXT NOT NULL,
        party_gstin TEXT,
        place_of_supply TEXT NOT NULL,
        supply_type TEXT NOT NULL,
        taxable_paise TEXT NOT NULL,
        rate_percent INTEGER NOT NULL,
        cgst_paise TEXT NOT NULL,
        sgst_paise TEXT NOT NULL,
        igst_paise TEXT NOT NULL,
        total_paise TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'CONFIRMED',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS purchase_invoices (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        invoice_number TEXT NOT NULL,
        date TEXT NOT NULL,
        party_name TEXT NOT NULL,
        party_gstin TEXT,
        place_of_supply TEXT NOT NULL,
        supply_type TEXT NOT NULL,
        taxable_paise TEXT NOT NULL,
        rate_percent INTEGER NOT NULL,
        cgst_paise TEXT NOT NULL,
        sgst_paise TEXT NOT NULL,
        igst_paise TEXT NOT NULL,
        total_paise TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'CONFIRMED',
        itc_eligibility TEXT NOT NULL DEFAULT 'ELIGIBLE',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS audit_records (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        business_name TEXT NOT NULL,
        gstin TEXT NOT NULL,
        return_period TEXT NOT NULL,
        return_type TEXT NOT NULL DEFAULT 'GSTR-3B',
        taxable_sales_paise TEXT NOT NULL,
        tax_liability_paise TEXT NOT NULL,
        itc_claimed_paise TEXT NOT NULL,
        net_payable_paise TEXT NOT NULL,
        sha256_hash TEXT NOT NULL,
        authorized_by TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'AUTHORIZED',
        created_at TEXT NOT NULL
      );
    `);

    const nonce = crypto.randomUUID().substring(0, 6);
    const legacyEmail = `legacy_${nonce}@traders.in`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, email, name, role, business_name, created_at)
      VALUES (?, ?, ?, 'OWNER', 'Legacy Enterprise', ?)
    `).run(`USR-${nonce}`, legacyEmail, 'Legacy User', now);

    db.prepare(`
      INSERT INTO businesses (id, user_email, legal_name, trade_name, gstin, pan, state_code, state_name, business_type, return_period, is_demo, created_at)
      VALUES (?, ?, 'Legacy Enterprise LLP', 'Legacy Enterprise', ?, ?, '33', 'Tamil Nadu', 'LLP', '2026-09', 1, ?)
    `).run(`BIZ-${nonce}`, legacyEmail, `33AABCL${Math.floor(1000 + Math.random() * 9000)}F1Z1`, `AABCL${Math.floor(1000 + Math.random() * 9000)}F`, now);

    db.prepare(`
      INSERT INTO sales_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, created_at)
      VALUES (?, ?, ?, '2026-09-01', 'Retail Client', NULL, '33', 'INTRA', '100000', 18, '9000', '9000', '0', '118000', 'CONFIRMED', ?)
    `).run(`INV-S-${nonce}`, legacyEmail, `INV-LEG-${nonce}`, now);

    db.prepare(`
      INSERT INTO purchase_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, itc_eligibility, created_at)
      VALUES (?, ?, ?, '2026-09-01', 'Wholesale Mill', '33AABCL5555F1Z2', '33', 'INTRA', '50000', 18, '4500', '4500', '0', '59000', 'CONFIRMED', 'ELIGIBLE', ?)
    `).run(`INV-P-${nonce}`, legacyEmail, `BILL-LEG-${nonce}`, now);
  }

  const report = await runMigration();
  assert.strictEqual(report.status, 'COMPLETED');
  assert.ok(report.migratedOrganizationsCount >= 1, 'At least 1 organization must be migrated');
  assert.strictEqual(report.salesPaiseMatch, true, 'Sales paise in legacy must match migrated total');
  assert.strictEqual(report.purchasesPaiseMatch, true, 'Purchases paise in legacy must match migrated total');
});

