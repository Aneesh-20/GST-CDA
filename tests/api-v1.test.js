// GST CDA - Versioned API v1 Integration Tests
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// Route Handlers
import { POST as signupHandler } from '../src/app/api/v1/auth/signup/route.js';
import { POST as loginHandler } from '../src/app/api/v1/auth/login/route.js';
import { GET as meHandler } from '../src/app/api/v1/me/route.js';
import { GET as getSalesHandler, POST as createSalesHandler } from '../src/app/api/v1/sales-invoices/route.js';
import { GET as getSingleSalesHandler, PATCH as patchSalesHandler } from '../src/app/api/v1/sales-invoices/[id]/route.js';
import { POST as prepareReturnHandler } from '../src/app/api/v1/return-periods/[id]/prepare/route.js';
import { POST as approveReturnHandler } from '../src/app/api/v1/returns/[id]/approve/route.js';
import { POST as filingHandler } from '../src/app/api/v1/filings/route.js';
import { GET as auditHandler } from '../src/app/api/v1/audit-events/route.js';
import { POST as legacyAuthHandler } from '../src/app/api/auth/route.js';
import { POST as resetHandler } from '../src/app/api/reset/route.js';

function createMockRequest(method, url, body = null, headers = {}) {
  const reqHeaders = new Headers(headers);
  if (body) reqHeaders.set('Content-Type', 'application/json');

  return {
    method,
    url,
    headers: reqHeaders,
    json: async () => body
  };
}

test('API v1: Full Lifecycle (Signup -> Me -> Invoices -> Concurrency -> Filing -> Audit)', async () => {
  process.env.MOCK_FILING_PROVIDER = 'true';

  const nonce = crypto.randomUUID().substring(0, 8);
  const email = `test-${nonce}@enterprise.in`;
  const password = 'StrongPassword123!';
  const orgName = `Enterprise ${nonce}`;
  const pan = `AABCP${Math.floor(1000 + Math.random() * 9000)}F`;
  const gstin = `33${pan}1Z5`;

  // 1. Signup (Sets HttpOnly Cookie, does NOT leak token in JSON body)
  const signupReq = createMockRequest('POST', 'http://localhost/api/v1/auth/signup', {
    email,
    password,
    fullName: 'Jane Doe',
    organizationName: orgName,
    pan,
    gstin,
    stateCode: '33',
    stateName: 'Tamil Nadu',
    businessType: 'PVT_LTD'
  });

  const signupRes = await signupHandler(signupReq);
  assert.strictEqual(signupRes.status, 201, 'Signup must return 201 Created');
  const signupData = await signupRes.json();
  assert.strictEqual(signupData.token, undefined, 'Must NOT leak raw bearer token in JSON body');
  
  const cookieVal = signupRes.cookies.get('gst_cda_session')?.value;
  assert.ok(cookieVal, 'Must set HttpOnly gst_cda_session cookie');
  const cookieHeader = `gst_cda_session=${cookieVal}`;

  // 2. GET /v1/me
  const meReq = createMockRequest('GET', 'http://localhost/api/v1/me', null, {
    'Cookie': cookieHeader
  });
  const meRes = await meHandler(meReq);
  assert.strictEqual(meRes.status, 200, 'GET /v1/me must return 200');
  const meData = await meRes.json();
  assert.strictEqual(meData.user.email, email);
  assert.strictEqual(meData.activeScope.role, 'OWNER');
  assert.strictEqual(meData.activeScope.permissions.canAuthorizeFiling, true);

  // 3. POST /v1/sales-invoices
  const invoiceNumber = `INV-${nonce}-01`;
  const createSalesReq = createMockRequest('POST', 'http://localhost/api/v1/sales-invoices', {
    invoiceNumber,
    invoiceDate: '2026-09-15',
    partyName: 'Madurai Spices',
    partyGstin: `33${pan}1Z8`,
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: '2000000', // ₹ 20,000.00
    ratePercent: 18,
    cgstPaise: '180000',
    sgstPaise: '180000',
    igstPaise: '0',
    totalPaise: '2360000',
    status: 'CONFIRMED'
  }, {
    'Cookie': cookieHeader
  });

  const createSalesRes = await createSalesHandler(createSalesReq);
  assert.strictEqual(createSalesRes.status, 201, 'Invoice creation must return 201 Created');
  const salesData = await createSalesRes.json();
  assert.strictEqual(salesData.data.invoiceNumber, invoiceNumber);
  assert.strictEqual(salesData.data.version, 1);
  const invoiceId = salesData.data.id;

  // 4. GET /v1/sales-invoices (with cursor pagination)
  const listSalesReq = createMockRequest('GET', 'http://localhost/api/v1/sales-invoices?limit=10', null, {
    'Cookie': cookieHeader
  });
  const listSalesRes = await getSalesHandler(listSalesReq);
  assert.strictEqual(listSalesRes.status, 200);
  const listData = await listSalesRes.json();
  assert.ok(Array.isArray(listData.data));
  assert.strictEqual(listData.data.length, 1);
  assert.strictEqual(listData.pagination.hasMore, false);

  // 5. PATCH /v1/sales-invoices/:id with optimistic locking (If-Match)
  // 5a. Stale If-Match fails
  const stalePatchReq = createMockRequest('PATCH', `http://localhost/api/v1/sales-invoices/${invoiceId}`, {
    partyName: 'Updated Name Attempt'
  }, {
    'Cookie': cookieHeader,
    'If-Match': '"999"'
  });
  const stalePatchRes = await patchSalesHandler(stalePatchReq, { params: { id: invoiceId } });
  assert.strictEqual(stalePatchRes.status, 412, 'Stale version must return 412 Precondition Failed');

  // 5b. Valid If-Match succeeds
  const validPatchReq = createMockRequest('PATCH', `http://localhost/api/v1/sales-invoices/${invoiceId}`, {
    partyName: 'Madurai Spices Global'
  }, {
    'Cookie': cookieHeader,
    'If-Match': '"1"'
  });
  const validPatchRes = await patchSalesHandler(validPatchReq, { params: { id: invoiceId } });
  assert.strictEqual(validPatchRes.status, 200, 'Valid version must update successfully');
  const updatedData = await validPatchRes.json();
  assert.strictEqual(updatedData.data.version, 2, 'Version must be incremented to 2');
  assert.strictEqual(updatedData.data.partyName, 'Madurai Spices Global');

  // 6. POST /v1/return-periods/:id/prepare
  const prepareReq = createMockRequest('POST', 'http://localhost/api/v1/return-periods/2026-09/prepare', {
    periodKey: '2026-09',
    returnType: 'GSTR-3B'
  }, {
    'Cookie': cookieHeader
  });
  const prepareRes = await prepareReturnHandler(prepareReq, { params: { id: '2026-09' } });
  assert.strictEqual(prepareRes.status, 200);
  const prepData = await prepareRes.json();
  assert.strictEqual(prepData.draft.status, 'PREPARED');
  assert.strictEqual(prepData.draft.taxableSalesPaise, '2000000');

  // 7. POST /v1/returns/:id/approve
  const approveReq = createMockRequest('POST', 'http://localhost/api/v1/returns/2026-09/approve', {
    periodKey: '2026-09',
    returnType: 'GSTR-3B',
    declarationAccepted: true
  }, {
    'Cookie': cookieHeader
  });
  const approveRes = await approveReturnHandler(approveReq, { params: { id: '2026-09' } });
  assert.strictEqual(approveRes.status, 200);
  const approveData = await approveRes.json();
  assert.strictEqual(approveData.approval.status, 'AUTHORIZED');

  // 8. POST /v1/filings (Statutory state machine, No Fake ARN)
  const idempotencyKey = crypto.randomUUID();
  const fileReq = createMockRequest('POST', 'http://localhost/api/v1/filings', {
    periodKey: '2026-09',
    returnType: 'GSTR-3B',
    idempotencyKey,
    authMethod: 'OTP',
    authCode: '123456'
  }, {
    'Cookie': cookieHeader
  });
  const fileRes1 = await filingHandler(fileReq);
  assert.strictEqual(fileRes1.status, 202, 'First submission queued must return 202 Accepted');
  const fileData1 = await fileRes1.json();
  assert.strictEqual(fileData1.isDuplicateReplay, false);
  assert.strictEqual(fileData1.filing.arn, null, 'Must NOT synthesize a fake ARN locally');
  assert.strictEqual(fileData1.filing.status, 'SUBMITTED');
  assert.ok(fileData1.filing.providerTrackingId.startsWith('mock_submission_'));

  // Replay filing with identical idempotency key
  const fileRes2 = await filingHandler(fileReq);
  assert.strictEqual(fileRes2.status, 200, 'Replayed filing must return 200 OK');
  const fileData2 = await fileRes2.json();
  assert.strictEqual(fileData2.isDuplicateReplay, true);
  assert.strictEqual(fileData2.filing.providerTrackingId, fileData1.filing.providerTrackingId);

  // 9. GET /v1/audit-events
  const auditReq = createMockRequest('GET', 'http://localhost/api/v1/audit-events', null, {
    'Cookie': cookieHeader
  });
  const auditRes = await auditHandler(auditReq);
  assert.strictEqual(auditRes.status, 200);
  const auditData = await auditRes.json();
  assert.ok(auditData.events.length >= 3, 'Must have recorded audit events');

  // 10. Decommissioned Legacy /api/auth Test
  const legacyReq = createMockRequest('POST', 'http://localhost/api/auth', { email: 'hacker@bypass.in' });
  const legacyRes = await legacyAuthHandler(legacyReq);
  assert.strictEqual(legacyRes.status, 410, 'Legacy /api/auth must return 410 Gone');

  // 11. Destructive Reset Execution Test
  const resetReq = createMockRequest('POST', 'http://localhost/api/reset', {
    action: 'clear',
    confirmation: 'CONFIRM_RESET_TENANT_DATA'
  }, {
    'Cookie': cookieHeader
  });
  const resetRes = await resetHandler(resetReq);
  assert.strictEqual(resetRes.status, 200, 'Reset with explicit confirmation must succeed');
  const resetData = await resetRes.json();
  assert.strictEqual(resetData.salesCount, 0);
});
