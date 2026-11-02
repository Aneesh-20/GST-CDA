// GST CDA - Milestone 1 Tenant Isolation & Security Test Suite
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { TenantStore } from '../src/lib/services/tenantStore.js';
import { createSession, verifyToken, getSession } from '../src/lib/security/session.js';
import { hashPassword, verifyPassword } from '../src/lib/security/password.js';
import { hasPermission } from '../packages/authz/roles.js';

function generateTestPAN() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let p = '';
  for (let i = 0; i < 5; i++) p += chars[Math.floor(Math.random() * chars.length)];
  p += Math.floor(1000 + Math.random() * 9000);
  p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

function generateTestGSTIN(stateCode = '33') {
  const pan = generateTestPAN();
  return `${stateCode}${pan}1Z${Math.floor(1 + Math.random() * 9)}`;
}

test('1. Security: Password Hashing & Verification with PBKDF2', () => {
  const password = 'SuperSecurePassword2026!';
  const hash = hashPassword(password);
  
  assert.ok(hash.includes(':'), 'Hash must contain salt and derived key');
  assert.strictEqual(verifyPassword(password, hash), true, 'Correct password must verify');
  assert.strictEqual(verifyPassword('WrongPassword', hash), false, 'Wrong password must fail');
  assert.strictEqual(verifyPassword('', hash), false, 'Empty password must fail');
});

test('2. Security: Persistent Hashed Session Token Signing & Revocation', async () => {
  const org = await TenantStore.createOrganization({ name: 'Session Org', slug: `sess-${Date.now()}` });
  const user = await TenantStore.createUser({ email: `sess-${Date.now()}@test.in`, password: 'Password123!', fullName: 'Session User' });
  await TenantStore.createMembership({ organizationId: org.id, userId: user.id, role: 'OWNER' });

  const session = await createSession({
    userId: user.id,
    organizationId: org.id,
    legalEntityId: null,
    gstRegistrationId: null,
    role: 'OWNER',
    email: user.email,
    name: user.fullName
  });

  assert.ok(session.token, 'Must return signed token');
  const verified = verifyToken(session.token);
  assert.ok(verified, 'Token must verify cryptographically');
  assert.strictEqual(verified.email, user.email);

  // Database session check
  const activeSession = await getSession(session.token);
  assert.ok(activeSession, 'Must find active unrevoked session in database');
  assert.strictEqual(activeSession.userId, user.id);

  // Revoke session
  await TenantStore.revokeSession(session.sessionId);
  const revokedSession = await getSession(session.token);
  assert.strictEqual(revokedSession, null, 'Revoked session must be rejected');

  // Tamper with token signature
  const [data] = session.token.split('.');
  const tampered = `${data}.tamperedSignature`;
  assert.strictEqual(verifyToken(tampered), null, 'Tampered token must be rejected');
});

test('3. Tenancy & Isolation: Org A cannot read or mutate Org B data', async () => {
  const nonce = crypto.randomUUID().substring(0, 8);
  // Setup Org A
  const orgA = await TenantStore.createOrganization({ name: `Alpha Traders ${nonce}`, slug: `alpha-${nonce}` });
  const userA = await TenantStore.createUser({ email: `alpha-${nonce}@test.in`, password: 'Password123!', fullName: 'Alpha Owner' });
  await TenantStore.createMembership({ organizationId: orgA.id, userId: userA.id, role: 'OWNER' });
  const entA = await TenantStore.createLegalEntity({ organizationId: orgA.id, legalName: 'Alpha Pvt Ltd', pan: generateTestPAN(), entityType: 'PVT_LTD' });
  const regA = await TenantStore.createGSTRegistration({ organizationId: orgA.id, legalEntityId: entA.id, gstin: generateTestGSTIN('33'), stateCode: '33', stateName: 'Tamil Nadu' });

  // Setup Org B
  const orgB = await TenantStore.createOrganization({ name: `Beta Logistics ${nonce}`, slug: `beta-${nonce}` });
  const userB = await TenantStore.createUser({ email: `beta-${nonce}@test.in`, password: 'Password123!', fullName: 'Beta Owner' });
  await TenantStore.createMembership({ organizationId: orgB.id, userId: userB.id, role: 'OWNER' });
  const entB = await TenantStore.createLegalEntity({ organizationId: orgB.id, legalName: 'Beta Logistics LLP', pan: generateTestPAN(), entityType: 'LLP' });
  const regB = await TenantStore.createGSTRegistration({ organizationId: orgB.id, legalEntityId: entB.id, gstin: generateTestGSTIN('29'), stateCode: '29', stateName: 'Karnataka' });

  // Create an invoice in Org A
  const invA = await TenantStore.createSalesInvoice({
    organizationId: orgA.id,
    legalEntityId: entA.id,
    gstRegistrationId: regA.id,
    invoiceNumber: `INV-A-${nonce}`,
    invoiceDate: '2026-09-10',
    partyName: 'Chennai Retail',
    partyGstin: null,
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 1000000n, // ₹ 10,000.00
    ratePercent: 18,
    cgstPaise: 90000n,
    sgstPaise: 90000n,
    igstPaise: 0n,
    totalPaise: 1180000n // ₹ 11,800.00
  });

  // Test 1: Org B queries Org A's invoice by ID
  const breachAttempt = await TenantStore.getSalesInvoiceById(orgB.id, invA.id);
  assert.strictEqual(breachAttempt, null, 'Org B must NOT be able to read Org A invoice by ID');

  // Test 2: Org B lists invoices
  const orgBList = await TenantStore.getSalesInvoices(orgB.id);
  assert.strictEqual(orgBList.items.length, 0, 'Org B must see 0 invoices');

  // Test 3: Org B attempts to update Org A's invoice
  const updateBreach = await TenantStore.updateSalesInvoice(orgB.id, invA.id, 1, { partyName: 'Malicious Hijack' });
  assert.strictEqual(updateBreach.notFound, true, 'Org B cannot mutate Org A invoice');

  // Verify Org A invoice was not altered
  const verifyOrgA = await TenantStore.getSalesInvoiceById(orgA.id, invA.id);
  assert.strictEqual(verifyOrgA.partyName, 'Chennai Retail', 'Org A invoice data must remain unchanged');

  // Test 4: Org B attempts to delete Org A's invoice
  const deleteBreach = await TenantStore.deleteSalesInvoice(orgB.id, invA.id);
  assert.strictEqual(deleteBreach, false, 'Org B cannot delete Org A invoice');
});

test('4. RBAC: Role Permissions Enforcement', () => {
  // OWNER can authorize filing
  assert.strictEqual(hasPermission('OWNER', 'canAuthorizeFiling'), true);
  assert.strictEqual(hasPermission('OWNER', 'canEditInvoices'), true);

  // CA cannot authorize filing without Owner approval
  assert.strictEqual(hasPermission('CA', 'canAuthorizeFiling'), false);
  assert.strictEqual(hasPermission('CA', 'canPrepareDrafts'), true);
  assert.strictEqual(hasPermission('CA', 'canEditInvoices'), true);

  // VIEWER cannot edit invoices or authorize filing
  assert.strictEqual(hasPermission('VIEWER', 'canEditInvoices'), false);
  assert.strictEqual(hasPermission('VIEWER', 'canAuthorizeFiling'), false);
  assert.strictEqual(hasPermission('VIEWER', 'canViewReports'), true);
});

test('5. Optimistic Concurrency Control (If-Match)', async () => {
  const nonce = crypto.randomUUID().substring(0, 8);
  const org = await TenantStore.createOrganization({ name: 'Concurrency Org', slug: `conc-${nonce}` });
  const ent = await TenantStore.createLegalEntity({ organizationId: org.id, legalName: 'Conc Ltd', pan: generateTestPAN(), entityType: 'PVT_LTD' });
  const reg = await TenantStore.createGSTRegistration({ organizationId: org.id, legalEntityId: ent.id, gstin: generateTestGSTIN('33'), stateCode: '33', stateName: 'Tamil Nadu' });

  const inv = await TenantStore.createSalesInvoice({
    organizationId: org.id,
    legalEntityId: ent.id,
    gstRegistrationId: reg.id,
    invoiceNumber: `INV-CONC-${nonce}`,
    invoiceDate: '2026-09-01',
    partyName: 'Party One',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 500000n,
    ratePercent: 18,
    totalPaise: 590000n
  });

  assert.strictEqual(inv.version, 1, 'Initial version must be 1');

  // Update with correct version
  const update1 = await TenantStore.updateSalesInvoice(org.id, inv.id, 1, { partyName: 'Party Updated' });
  assert.strictEqual(update1.invoice.version, 2, 'Version must increment to 2');

  // Update with stale version (expected 1, but is now 2)
  const staleUpdate = await TenantStore.updateSalesInvoice(org.id, inv.id, 1, { partyName: 'Stale Attempt' });
  assert.strictEqual(staleUpdate.conflict, true, 'Stale update must trigger conflict');
  assert.strictEqual(staleUpdate.currentVersion, 2);
});

test('6. Filing State Machine: Idempotency & No Fake ARN Synthesis', async () => {
  const nonce = crypto.randomUUID().substring(0, 8);
  const org = await TenantStore.createOrganization({ name: 'Filing Org', slug: `filing-${nonce}` });
  const user = await TenantStore.createUser({ email: `filing-${nonce}@test.in`, password: 'Password123!', fullName: 'Filer' });
  const ent = await TenantStore.createLegalEntity({ organizationId: org.id, legalName: 'Filing Ltd', pan: generateTestPAN(), entityType: 'PVT_LTD' });
  const reg = await TenantStore.createGSTRegistration({ organizationId: org.id, legalEntityId: ent.id, gstin: generateTestGSTIN('33'), stateCode: '33', stateName: 'Tamil Nadu' });

  const idempotencyKey = crypto.randomUUID();
  const providerTrackingId = `mock_submission_${crypto.randomUUID()}`;

  // First submission: state must be SUBMITTED, arn must be null (no invented ARN)
  const first = await TenantStore.createFilingAttempt({
    organizationId: org.id,
    gstRegistrationId: reg.id,
    periodKey: '2026-09',
    returnType: 'GSTR-3B',
    idempotencyKey,
    providerTrackingId,
    status: 'SUBMITTED',
    arn: null,
    authorizedBy: user.id
  });

  assert.strictEqual(first.isDuplicate, false, 'First submission must not be duplicate');
  assert.strictEqual(first.filing.arn, null, 'Must NOT synthesize a fake ARN locally');
  assert.strictEqual(first.filing.status, 'SUBMITTED');
  assert.strictEqual(first.filing.provider_tracking_id, providerTrackingId);

  // Second submission with identical idempotency key
  const second = await TenantStore.createFilingAttempt({
    organizationId: org.id,
    gstRegistrationId: reg.id,
    periodKey: '2026-09',
    returnType: 'GSTR-3B',
    idempotencyKey,
    providerTrackingId: `mock_submission_${crypto.randomUUID()}`,
    status: 'SUBMITTED',
    arn: null,
    authorizedBy: user.id
  });

  assert.strictEqual(second.isDuplicate, true, 'Replayed submission must be flagged as duplicate');
  assert.strictEqual(second.filing.provider_tracking_id, first.filing.provider_tracking_id, 'Must return identical record');
});

test('7. Audit Trail: Tamper-Evident SHA-256 Hash Chaining', async () => {
  const nonce = crypto.randomUUID().substring(0, 8);
  const org = await TenantStore.createOrganization({ name: 'Audit Org', slug: `audit-${nonce}` });
  const user = await TenantStore.createUser({ email: `audit-${nonce}@test.in`, password: 'Password123!', fullName: 'Auditor' });

  const event1 = await TenantStore.appendAuditEvent({
    organizationId: org.id,
    actorId: user.id,
    action: 'INVOICE_CREATED',
    entityType: 'SALES_INVOICE',
    entityId: 'INV-001',
    correlationId: crypto.randomUUID(),
    metadata: { total: '1000' }
  });

  assert.strictEqual(event1.prevHash, '0000000000000000000000000000000000000000000000000000000000000000', 'Genesis event prevHash must be zeroed');

  const event2 = await TenantStore.appendAuditEvent({
    organizationId: org.id,
    actorId: user.id,
    action: 'INVOICE_UPDATED',
    entityType: 'SALES_INVOICE',
    entityId: 'INV-001',
    correlationId: crypto.randomUUID(),
    metadata: { total: '1500' }
  });

  assert.strictEqual(event2.prevHash, event1.eventHash, 'Event 2 prevHash must equal Event 1 eventHash');
});

test('8. Currency: Paise BigInt Precision & Purchase Default ITC NEEDS_REVIEW', async () => {
  const nonce = crypto.randomUUID().substring(0, 8);
  const org = await TenantStore.createOrganization({ name: 'Money Org', slug: `money-${nonce}` });
  const ent = await TenantStore.createLegalEntity({ organizationId: org.id, legalName: 'Money Ltd', pan: generateTestPAN(), entityType: 'PVT_LTD' });
  const reg = await TenantStore.createGSTRegistration({ organizationId: org.id, legalEntityId: ent.id, gstin: generateTestGSTIN('33'), stateCode: '33', stateName: 'Tamil Nadu' });

  // ₹ 1234567.89 = 123456789n paise
  const largePaise = 123456789n;
  const inv = await TenantStore.createSalesInvoice({
    organizationId: org.id,
    legalEntityId: ent.id,
    gstRegistrationId: reg.id,
    invoiceNumber: `INV-PAISE-${nonce}`,
    invoiceDate: '2026-09-01',
    partyName: 'Paise Test',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: largePaise,
    ratePercent: 18,
    cgstPaise: 11111111n,
    sgstPaise: 11111111n,
    igstPaise: 0n,
    totalPaise: largePaise + 22222222n
  });

  const fetched = await TenantStore.getSalesInvoiceById(org.id, inv.id);
  assert.strictEqual(fetched.taxablePaise, largePaise, 'Paise value must preserve exact BigInt integer without float loss');

  // Verify Purchase Invoice default ITC eligibility is NEEDS_REVIEW
  const purchase = await TenantStore.createPurchaseInvoice({
    organizationId: org.id,
    legalEntityId: ent.id,
    gstRegistrationId: reg.id,
    invoiceNumber: `BILL-ITC-${nonce}`,
    invoiceDate: '2026-09-01',
    partyName: 'Vendor Check',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 100000n,
    ratePercent: 18,
    totalPaise: 118000n
  });

  assert.strictEqual(purchase.itcEligibility, 'NEEDS_REVIEW', 'Default purchase ITC eligibility must be NEEDS_REVIEW');
});
