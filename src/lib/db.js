// Real SQLite database for TaxMate using node:sqlite
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'gst_cda.sqlite');

let dbInstance = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  dbInstance = new DatabaseSync(DB_PATH);
  initSchema(dbInstance);
  return dbInstance;
}

function initSchema(db) {
  // Execute table creation in a single transaction
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

    CREATE INDEX IF NOT EXISTS idx_sales_user ON sales_invoices(user_email);
    CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchase_invoices(user_email);
    CREATE INDEX IF NOT EXISTS idx_biz_user ON businesses(user_email);
    CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_records(user_email);
  `);

  seedDefaultUsers(db);
}

function seedDefaultUsers(db) {
  // 1. Murugan Traders (Demo Business Owner)
  const muruganEmail = 'owner@murugantraders.in';
  const existingMurugan = db.prepare('SELECT email FROM users WHERE email = ?').get(muruganEmail);
  if (!existingMurugan) {
    db.prepare(`
      INSERT INTO users (id, email, name, role, business_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('usr-murugan', muruganEmail, 'Murugan N', 'OWNER', 'Murugan Electricals & Hardware', new Date().toISOString());

    db.prepare(`
      INSERT INTO businesses (id, user_email, legal_name, trade_name, gstin, pan, state_code, state_name, business_type, return_period, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('biz-murugan', muruganEmail, 'Murugan Electricals & Hardware', 'Murugan Traders', '33AAAAA0000A1Z5', 'AAAAA0000A', '33', 'Tamil Nadu', 'Sole Proprietorship', 'October 2026', 1, new Date().toISOString());

    // Seed Murugan's 5 sales invoices
    const muruganSales = [
      { id: 'inv-101', num: 'INV-2026-081', date: '2026-10-04', party: 'Chennai Construction Corp', gstin: '33AABCC1234F1Z1', pos: '33', supply: 'INTRA', taxable: '4500000', rate: 18, cgst: '405000', sgst: '405000', igst: '0', total: '5310000' },
      { id: 'inv-102', num: 'INV-2026-082', date: '2026-10-09', party: 'Bengaluru Lightworks Ltd', gstin: '29AAACL5678K1Z3', pos: '29', supply: 'INTER', taxable: '8200000', rate: 18, cgst: '0', sgst: '0', igst: '1476000', total: '9676000' },
      { id: 'inv-103', num: 'INV-2026-083', date: '2026-10-14', party: 'Counter Cash Sale (Walk-in Customer)', gstin: '', pos: '33', supply: 'INTRA', taxable: '1250000', rate: 18, cgst: '112500', sgst: '112500', igst: '0', total: '1475000' },
      { id: 'inv-104', num: 'INV-2026-084', date: '2026-10-18', party: 'Salem Motors Pvt Ltd', gstin: '33AABCS9876D1Z8', pos: '33', supply: 'INTRA', taxable: '3500000', rate: 12, cgst: '210000', sgst: '210000', igst: '0', total: '3920000' },
      { id: 'inv-105', num: 'INV-2026-085', date: '2026-10-22', party: 'Kovai Engineering Works', gstin: '33AABCK3344P1Z2', pos: '33', supply: 'INTRA', taxable: '2800000', rate: 18, cgst: '252000', sgst: '252000', igst: '0', total: '3304000' },
    ];

    const insertSale = db.prepare(`
      INSERT INTO sales_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
    `);

    for (const s of muruganSales) {
      insertSale.run(s.id, muruganEmail, s.num, s.date, s.party, s.gstin || null, s.pos, s.supply, s.taxable, s.rate, s.cgst, s.sgst, s.igst, s.total, new Date().toISOString());
    }

    // Seed Murugan's 4 purchase invoices
    const muruganPurchases = [
      { id: 'pur-201', num: 'HVL-2026-992', date: '2026-10-02', party: 'Havells India Limited', gstin: '07AAACH0001K1ZV', pos: '33', supply: 'INTER', taxable: '6500000', rate: 18, cgst: '0', sgst: '0', igst: '1170000', total: '7670000', itc: 'ELIGIBLE' },
      { id: 'pur-202', num: 'POL-OCT-112', date: '2026-10-08', party: 'Polycab Wires & Cables Ltd', gstin: '33AAACP4411M1ZQ', pos: '33', supply: 'INTRA', taxable: '4000000', rate: 18, cgst: '360000', sgst: '360000', igst: '0', total: '4720000', itc: 'ELIGIBLE' },
      { id: 'pur-203', num: 'SWT-2026-044', date: '2026-10-15', party: 'Anchor Electrical Switchgears', gstin: '33AAACA9812J1ZR', pos: '33', supply: 'INTRA', taxable: '1800000', rate: 18, cgst: '162000', sgst: '162000', igst: '0', total: '2124000', itc: 'ELIGIBLE' },
      { id: 'pur-204', num: 'OFF-OCT-01', date: '2026-10-19', party: 'Office Tea & Snacks Supply', gstin: '', pos: '33', supply: 'INTRA', taxable: '250000', rate: 5, cgst: '6250', sgst: '6250', igst: '0', total: '262500', itc: 'INELIGIBLE' },
    ];

    const insertPurchase = db.prepare(`
      INSERT INTO purchase_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, itc_eligibility, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)
    `);

    for (const p of muruganPurchases) {
      insertPurchase.run(p.id, muruganEmail, p.num, p.date, p.party, p.gstin || null, p.pos, p.supply, p.taxable, p.rate, p.cgst, p.sgst, p.igst, p.total, p.itc, new Date().toISOString());
    }
  }

  // 2. CA Ramanujam
  const caEmail = 'ca.audit@taxfirm.in';
  if (!db.prepare('SELECT email FROM users WHERE email = ?').get(caEmail)) {
    db.prepare(`
      INSERT INTO users (id, email, name, role, business_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('usr-ca', caEmail, 'Ramanujam CA', 'CA', 'Ramanujam & Associates (CA Audit Firm)', new Date().toISOString());

    db.prepare(`
      INSERT INTO businesses (id, user_email, legal_name, trade_name, gstin, pan, state_code, state_name, business_type, return_period, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('biz-ca', caEmail, 'Ramanujam & Associates (CA Audit Firm)', 'Audit & Compliance Firm', '33AAACB1234K1Z2', 'AAACB1234K', '33', 'Tamil Nadu', 'Chartered Accountancy Firm', 'October 2026', 0, new Date().toISOString());
  }

  // 3. CSC Kiosk Operator
  const kioskEmail = 'kiosk.service@csc.gov.in';
  if (!db.prepare('SELECT email FROM users WHERE email = ?').get(kioskEmail)) {
    db.prepare(`
      INSERT INTO users (id, email, name, role, business_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('usr-kiosk', kioskEmail, 'Kiosk CSC Center', 'KIOSK_OPERATOR', 'CSC e-Governance Digital Kiosk', new Date().toISOString());

    db.prepare(`
      INSERT INTO businesses (id, user_email, legal_name, trade_name, gstin, pan, state_code, state_name, business_type, return_period, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('biz-kiosk', kioskEmail, 'CSC e-Governance Digital Kiosk', 'Village Kiosk Services', '33AAACK5678L1Z9', 'AAACK5678L', '33', 'Tamil Nadu', 'Assisted Service Center', 'October 2026', 0, new Date().toISOString());
  }

  // 4. Jawahar (Explicitly isolated account)
  const jawaharEmail = 'jawahar@gmail.com';
  if (!db.prepare('SELECT email FROM users WHERE email = ?').get(jawaharEmail)) {
    db.prepare(`
      INSERT INTO users (id, email, name, role, business_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('usr-jawahar', jawaharEmail, 'Jawahar', 'OWNER', 'Jawahar Traders & Retail Store', new Date().toISOString());

    db.prepare(`
      INSERT INTO businesses (id, user_email, legal_name, trade_name, gstin, pan, state_code, state_name, business_type, return_period, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('biz-jawahar', jawaharEmail, 'Jawahar Traders & Retail Store', 'Jawahar Stores', '33AABCJ1029K1Z4', 'AABCJ1029K', '33', 'Tamil Nadu', 'Sole Proprietorship', 'October 2026', 0, new Date().toISOString());
  }
}

// User & Business Operations
export function findOrCreateUser(email, name, role = 'OWNER', businessName = '') {
  const db = getDb();
  const normalizedEmail = (email || '').trim().toLowerCase();

  let user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(normalizedEmail);
  
  // If searching by username like 'jawahar'
  if (!user && !normalizedEmail.includes('@')) {
    user = db.prepare('SELECT * FROM users WHERE LOWER(name) = LOWER(?)').get(name || normalizedEmail);
  }

  if (!user) {
    const userId = `usr-${Date.now()}`;
    const finalEmail = normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@user.in`;
    const finalName = name || normalizedEmail.split('@')[0] || 'Business Owner';
    const finalBiz = businessName || `${finalName}'s Enterprise`;

    db.prepare(`
      INSERT INTO users (id, email, name, role, business_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, finalEmail, finalName, role, finalBiz, new Date().toISOString());

    const bizId = `biz-${Date.now()}`;
    const pan = 'AABC' + String(Math.floor(1000 + Math.random() * 9000)) + 'A';
    const gstin = '33' + pan + '1Z' + String(Math.floor(1 + Math.random() * 9));

    db.prepare(`
      INSERT INTO businesses (id, user_email, legal_name, trade_name, gstin, pan, state_code, state_name, business_type, return_period, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(bizId, finalEmail, finalBiz, finalBiz, gstin, pan, '33', 'Tamil Nadu', 'Sole Proprietorship', 'October 2026', 0, new Date().toISOString());

    user = db.prepare('SELECT * FROM users WHERE email = ?').get(finalEmail);
  }

  const business = db.prepare('SELECT * FROM businesses WHERE LOWER(user_email) = LOWER(?)').get(user.email);
  return { user, business: formatBusiness(business) };
}

export function getBusinessForUser(email) {
  const db = getDb();
  const business = db.prepare('SELECT * FROM businesses WHERE LOWER(user_email) = LOWER(?)').get((email || '').trim());
  return business ? formatBusiness(business) : null;
}

export function updateBusinessForUser(email, data) {
  const db = getDb();
  const userEmail = (email || '').trim();
  db.prepare(`
    UPDATE businesses 
    SET legal_name = ?, trade_name = ?, gstin = ?, pan = ?, state_code = ?, state_name = ?, business_type = ?, return_period = ?
    WHERE LOWER(user_email) = LOWER(?)
  `).run(
    data.legalName,
    data.tradeName || data.legalName,
    data.gstin,
    data.pan || data.gstin.slice(2, 12),
    data.stateCode || '33',
    data.stateName || 'Tamil Nadu',
    data.businessType || 'Sole Proprietorship',
    data.returnPeriod || 'October 2026',
    userEmail
  );
  return getBusinessForUser(userEmail);
}

// Sales Invoices Operations
export function getSalesInvoices(email) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM sales_invoices WHERE LOWER(user_email) = LOWER(?) ORDER BY date DESC, created_at DESC').all((email || '').trim());
  return rows.map(formatSalesInvoice);
}

export function createSalesInvoice(email, inv) {
  const db = getDb();
  const userEmail = (email || '').trim();
  const id = inv.id || `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  db.prepare(`
    INSERT INTO sales_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userEmail,
    inv.invoiceNumber,
    inv.date,
    inv.partyName,
    inv.partyGstin || null,
    inv.placeOfSupply || '33',
    inv.supplyType || 'INTRA',
    inv.taxablePaise.toString(),
    Number(inv.ratePercent || 18),
    inv.cgstPaise.toString(),
    inv.sgstPaise.toString(),
    inv.igstPaise.toString(),
    inv.totalPaise.toString(),
    inv.status || 'CONFIRMED',
    new Date().toISOString()
  );

  return getSalesInvoices(userEmail);
}

export function updateSalesInvoice(email, inv) {
  const db = getDb();
  const userEmail = (email || '').trim();

  db.prepare(`
    UPDATE sales_invoices 
    SET invoice_number = ?, date = ?, party_name = ?, party_gstin = ?, place_of_supply = ?, supply_type = ?, taxable_paise = ?, rate_percent = ?, cgst_paise = ?, sgst_paise = ?, igst_paise = ?, total_paise = ?, status = ?
    WHERE id = ? AND LOWER(user_email) = LOWER(?)
  `).run(
    inv.invoiceNumber,
    inv.date,
    inv.partyName,
    inv.partyGstin || null,
    inv.placeOfSupply || '33',
    inv.supplyType || 'INTRA',
    inv.taxablePaise.toString(),
    Number(inv.ratePercent || 18),
    inv.cgstPaise.toString(),
    inv.sgstPaise.toString(),
    inv.igstPaise.toString(),
    inv.totalPaise.toString(),
    inv.status || 'CONFIRMED',
    inv.id,
    userEmail
  );

  return getSalesInvoices(userEmail);
}

export function deleteSalesInvoice(email, invoiceId) {
  const db = getDb();
  const userEmail = (email || '').trim();
  db.prepare('DELETE FROM sales_invoices WHERE id = ? AND LOWER(user_email) = LOWER(?)').run(invoiceId, userEmail);
  return getSalesInvoices(userEmail);
}

export function bulkImportSales(email, invoices) {
  const db = getDb();
  const userEmail = (email || '').trim();
  const stmt = db.prepare(`
    INSERT INTO sales_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const inv of invoices) {
    const id = inv.id || `inv-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    stmt.run(
      id,
      userEmail,
      inv.invoiceNumber,
      inv.date,
      inv.partyName,
      inv.partyGstin || null,
      inv.placeOfSupply || '33',
      inv.supplyType || 'INTRA',
      inv.taxablePaise.toString(),
      Number(inv.ratePercent || 18),
      inv.cgstPaise.toString(),
      inv.sgstPaise.toString(),
      inv.igstPaise.toString(),
      inv.totalPaise.toString(),
      inv.status || 'CONFIRMED',
      new Date().toISOString()
    );
  }

  return getSalesInvoices(userEmail);
}

// Purchase Invoices Operations
export function getPurchaseInvoices(email) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM purchase_invoices WHERE LOWER(user_email) = LOWER(?) ORDER BY date DESC, created_at DESC').all((email || '').trim());
  return rows.map(formatPurchaseInvoice);
}

export function createPurchaseInvoice(email, inv) {
  const db = getDb();
  const userEmail = (email || '').trim();
  const id = inv.id || `pur-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  db.prepare(`
    INSERT INTO purchase_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, itc_eligibility, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userEmail,
    inv.invoiceNumber,
    inv.date,
    inv.partyName,
    inv.partyGstin || null,
    inv.placeOfSupply || '33',
    inv.supplyType || 'INTRA',
    inv.taxablePaise.toString(),
    Number(inv.ratePercent || 18),
    inv.cgstPaise.toString(),
    inv.sgstPaise.toString(),
    inv.igstPaise.toString(),
    inv.totalPaise.toString(),
    inv.status || 'CONFIRMED',
    inv.itcEligibility || 'ELIGIBLE',
    new Date().toISOString()
  );

  return getPurchaseInvoices(userEmail);
}

export function updatePurchaseInvoice(email, inv) {
  const db = getDb();
  const userEmail = (email || '').trim();

  db.prepare(`
    UPDATE purchase_invoices 
    SET invoice_number = ?, date = ?, party_name = ?, party_gstin = ?, place_of_supply = ?, supply_type = ?, taxable_paise = ?, rate_percent = ?, cgst_paise = ?, sgst_paise = ?, igst_paise = ?, total_paise = ?, status = ?, itc_eligibility = ?
    WHERE id = ? AND LOWER(user_email) = LOWER(?)
  `).run(
    inv.invoiceNumber,
    inv.date,
    inv.partyName,
    inv.partyGstin || null,
    inv.placeOfSupply || '33',
    inv.supplyType || 'INTRA',
    inv.taxablePaise.toString(),
    Number(inv.ratePercent || 18),
    inv.cgstPaise.toString(),
    inv.sgstPaise.toString(),
    inv.igstPaise.toString(),
    inv.totalPaise.toString(),
    inv.status || 'CONFIRMED',
    inv.itcEligibility || 'ELIGIBLE',
    inv.id,
    userEmail
  );

  return getPurchaseInvoices(userEmail);
}

export function deletePurchaseInvoice(email, invoiceId) {
  const db = getDb();
  const userEmail = (email || '').trim();
  db.prepare('DELETE FROM purchase_invoices WHERE id = ? AND LOWER(user_email) = LOWER(?)').run(invoiceId, userEmail);
  return getPurchaseInvoices(userEmail);
}

export function bulkImportPurchases(email, invoices) {
  const db = getDb();
  const userEmail = (email || '').trim();
  const stmt = db.prepare(`
    INSERT INTO purchase_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, itc_eligibility, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const inv of invoices) {
    const id = inv.id || `pur-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    stmt.run(
      id,
      userEmail,
      inv.invoiceNumber,
      inv.date,
      inv.partyName,
      inv.partyGstin || null,
      inv.placeOfSupply || '33',
      inv.supplyType || 'INTRA',
      inv.taxablePaise.toString(),
      Number(inv.ratePercent || 18),
      inv.cgstPaise.toString(),
      inv.sgstPaise.toString(),
      inv.igstPaise.toString(),
      inv.totalPaise.toString(),
      inv.status || 'CONFIRMED',
      inv.itcEligibility || 'ELIGIBLE',
      new Date().toISOString()
    );
  }

  return getPurchaseInvoices(userEmail);
}

// Seed standard baseline invoices (5 sales, 4 purchases) for any user account
export function seedBaselineInvoicesForUser(db, userEmail) {
  const cleanEmail = (userEmail || 'owner@murugantraders.in').trim().toLowerCase();
  
  // Standard 5 sales invoices
  const defaultSales = [
    { num: 'INV-2026-081', date: '2026-10-04', party: 'Chennai Construction Corp', gstin: '33AABCC1234F1Z1', pos: '33', supply: 'INTRA', taxable: '4500000', rate: 18, cgst: '405000', sgst: '405000', igst: '0', total: '5310000' },
    { num: 'INV-2026-082', date: '2026-10-09', party: 'Bengaluru Lightworks Ltd', gstin: '29AAACL5678K1Z3', pos: '29', supply: 'INTER', taxable: '8200000', rate: 18, cgst: '0', sgst: '0', igst: '1476000', total: '9676000' },
    { num: 'INV-2026-083', date: '2026-10-14', party: 'Counter Cash Sale (Walk-in Customer)', gstin: '', pos: '33', supply: 'INTRA', taxable: '1250000', rate: 18, cgst: '112500', sgst: '112500', igst: '0', total: '1475000' },
    { num: 'INV-2026-084', date: '2026-10-18', party: 'Salem Motors Pvt Ltd', gstin: '33AABCS9876D1Z8', pos: '33', supply: 'INTRA', taxable: '3500000', rate: 12, cgst: '210000', sgst: '210000', igst: '0', total: '3920000' },
    { num: 'INV-2026-085', date: '2026-10-22', party: 'Kovai Engineering Works', gstin: '33AABCK3344P1Z2', pos: '33', supply: 'INTRA', taxable: '2800000', rate: 18, cgst: '252000', sgst: '252000', igst: '0', total: '3304000' },
  ];

  const insertSale = db.prepare(`
    INSERT INTO sales_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
  `);

  for (let i = 0; i < defaultSales.length; i++) {
    const s = defaultSales[i];
    const id = `inv-base-${i + 1}-${Date.now()}`;
    insertSale.run(id, cleanEmail, s.num, s.date, s.party, s.gstin || null, s.pos, s.supply, s.taxable, s.rate, s.cgst, s.sgst, s.igst, s.total, new Date().toISOString());
  }

  // Standard 4 purchase invoices
  const defaultPurchases = [
    { num: 'HVL-2026-992', date: '2026-10-02', party: 'Havells India Limited', gstin: '07AAACH0001K1ZV', pos: '33', supply: 'INTER', taxable: '6500000', rate: 18, cgst: '0', sgst: '0', igst: '1170000', total: '7670000', itc: 'ELIGIBLE' },
    { num: 'POL-OCT-112', date: '2026-10-08', party: 'Polycab Wires & Cables Ltd', gstin: '33AAACP4411M1ZQ', pos: '33', supply: 'INTRA', taxable: '4000000', rate: 18, cgst: '360000', sgst: '360000', igst: '0', total: '4720000', itc: 'ELIGIBLE' },
    { num: 'SWT-2026-044', date: '2026-10-15', party: 'Anchor Electrical Switchgears', gstin: '33AAACA9812J1ZR', pos: '33', supply: 'INTRA', taxable: '1800000', rate: 18, cgst: '162000', sgst: '162000', igst: '0', total: '2124000', itc: 'ELIGIBLE' },
    { num: 'OFF-OCT-01', date: '2026-10-19', party: 'Office Tea & Snacks Supply', gstin: '', pos: '33', supply: 'INTRA', taxable: '250000', rate: 5, cgst: '6250', sgst: '6250', igst: '0', total: '262500', itc: 'INELIGIBLE' },
  ];

  const insertPur = db.prepare(`
    INSERT INTO purchase_invoices (id, user_email, invoice_number, date, party_name, party_gstin, place_of_supply, supply_type, taxable_paise, rate_percent, cgst_paise, sgst_paise, igst_paise, total_paise, status, itc_eligibility, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)
  `);

  for (let i = 0; i < defaultPurchases.length; i++) {
    const p = defaultPurchases[i];
    const id = `pur-base-${i + 1}-${Date.now()}`;
    insertPur.run(id, cleanEmail, p.num, p.date, p.party, p.gstin || null, p.pos, p.supply, p.taxable, p.rate, p.cgst, p.sgst, p.igst, p.total, p.itc, new Date().toISOString());
  }
}

// Reset / Clear Operations
export function resetUserData(email) {
  const db = getDb();
  const userEmail = (email || 'owner@murugantraders.in').trim().toLowerCase();

  db.prepare('DELETE FROM sales_invoices WHERE LOWER(user_email) = LOWER(?)').run(userEmail);
  db.prepare('DELETE FROM purchase_invoices WHERE LOWER(user_email) = LOWER(?)').run(userEmail);

  if (userEmail === 'owner@murugantraders.in') {
    db.prepare('DELETE FROM users WHERE LOWER(email) = LOWER(?)').run(userEmail);
    db.prepare('DELETE FROM businesses WHERE LOWER(user_email) = LOWER(?)').run(userEmail);
    seedDefaultUsers(db);
  } else {
    // For any user who clicks "Reset to Normal", populate the clean 5 sales and 4 purchase baseline bills!
    seedBaselineInvoicesForUser(db, userEmail);
  }

  return {
    sales: getSalesInvoices(userEmail),
    purchases: getPurchaseInvoices(userEmail),
    business: getBusinessForUser(userEmail)
  };
}

export function clearUserRecords(email) {
  const db = getDb();
  const userEmail = (email || '').trim().toLowerCase();
  db.prepare('DELETE FROM sales_invoices WHERE LOWER(user_email) = ?').run(userEmail);
  db.prepare('DELETE FROM purchase_invoices WHERE LOWER(user_email) = ?').run(userEmail);
  return { sales: [], purchases: [], business: getBusinessForUser(userEmail) };
}

// Formatters
function formatBusiness(row) {
  if (!row) return null;
  return {
    id: row.id,
    legalName: row.legal_name,
    tradeName: row.trade_name,
    gstin: row.gstin,
    pan: row.pan,
    stateCode: row.state_code,
    stateName: row.state_name,
    businessType: row.business_type,
    returnPeriod: row.return_period,
    isDemo: Boolean(row.is_demo),
  };
}

function formatSalesInvoice(row) {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    date: row.date,
    partyName: row.party_name,
    partyGstin: row.party_gstin || undefined,
    placeOfSupply: row.place_of_supply,
    supplyType: row.supply_type,
    taxablePaise: row.taxable_paise,
    ratePercent: row.rate_percent,
    cgstPaise: row.cgst_paise,
    sgstPaise: row.sgst_paise,
    igstPaise: row.igst_paise,
    totalPaise: row.total_paise,
    status: row.status,
  };
}

function formatPurchaseInvoice(row) {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    date: row.date,
    partyName: row.party_name,
    partyGstin: row.party_gstin || undefined,
    placeOfSupply: row.place_of_supply,
    supplyType: row.supply_type,
    taxablePaise: row.taxable_paise,
    ratePercent: row.rate_percent,
    cgstPaise: row.cgst_paise,
    sgstPaise: row.sgst_paise,
    igstPaise: row.igst_paise,
    totalPaise: row.total_paise,
    status: row.status,
    itcEligibility: row.itc_eligibility,
  };
}

// Audit Trail Operations
export function createAuditRecord(data) {
  const db = getDb();
  const id = `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  
  // Deterministic cryptographic SHA-256 hash of the return declaration
  const payloadToHash = `${data.userEmail}|${data.businessName}|${data.gstin}|${data.returnPeriod}|${data.netPayablePaise}|${now}`;
  const sha256Hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

  db.prepare(`
    INSERT INTO audit_records (
      id, user_email, business_name, gstin, return_period, return_type, 
      taxable_sales_paise, tax_liability_paise, itc_claimed_paise, net_payable_paise, 
      sha256_hash, authorized_by, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AUTHORIZED', ?)
  `).run(
    id,
    data.userEmail,
    data.businessName,
    data.gstin,
    data.returnPeriod || 'October 2026',
    data.returnType || 'GSTR-3B',
    (data.taxableSalesPaise || '0').toString(),
    (data.taxLiabilityPaise || '0').toString(),
    (data.itcClaimedPaise || '0').toString(),
    (data.netPayablePaise || '0').toString(),
    sha256Hash,
    data.authorizedBy || data.userEmail,
    now
  );

  return getAuditRecords(data.userEmail);
}

export function getAuditRecords(userEmail) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM audit_records WHERE LOWER(user_email) = LOWER(?) ORDER BY created_at DESC').all((userEmail || '').trim());
  return rows.map(r => ({
    id: r.id,
    userEmail: r.user_email,
    businessName: r.business_name,
    gstin: r.gstin,
    returnPeriod: r.return_period,
    returnType: r.return_type,
    taxableSalesPaise: r.taxable_sales_paise,
    taxLiabilityPaise: r.tax_liability_paise,
    itcClaimedPaise: r.itc_claimed_paise,
    netPayablePaise: r.net_payable_paise,
    sha256Hash: r.sha256_hash,
    authorizedBy: r.authorized_by,
    status: r.status,
    createdAt: r.created_at,
  }));
}

