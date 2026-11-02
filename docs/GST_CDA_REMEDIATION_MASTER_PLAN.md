# GST CDA – Security Remediation Master Plan & Technical Specification

**Author:** Senior Backend Architect, PostgreSQL Database Engineer & Application Security Engineer  
**Repository:** `C:\GST-CDA`  
**Git Branch:** `Sanjay` (tracking `origin/Sanjay`)  
**Latest Baseline Commit:** `61ee2fddbd35107d759c6965f88f6bda6be53f7d`  
**Revision:** 2.0 (Post-Review Architectural Hardening)  
**Status:** PROPOSED – AWAITING USER APPROVAL (Zero application code modified)

---

## Executive Summary & Architectural Directives

Following architectural review of Revision 1.0, this Master Plan incorporates four mandatory architectural corrections:
1. **Production Fail-Closed Guarantee:** In `NODE_ENV === 'production'`, the system strictly fails closed at startup if `DATABASE_URL` is missing or invalid. SQLite is strictly forbidden in production and permitted exclusively in local development and testing environments under explicit opt-in configuration.
2. **Hardened Security-Definer Auth Bootstrap:** Authentication lookup is decoupled from tenant RLS via hardened `SECURITY DEFINER` functions with fixed `search_path = pg_catalog, public`, `REVOKE EXECUTE FROM PUBLIC`, explicit grants solely to `gst_cda_app`, and narrowly scoped column projections.
3. **Advisory-Locked Per-Organization Audit Chaining:** Concurrency race conditions in audit hash-chaining are eliminated using PostgreSQL transaction-level advisory locks (`pg_advisory_xact_lock`) scoped per organization, providing serial execution per tenant without cross-tenant contention.
4. **Strict Isolation of Mock vs. Statutory GSP Filings:** Mock filings and simulated webhooks are strictly quarantined from production and marked non-statutory (`is_mock: true`, `status: 'MOCK_ACK_RECEIVED'`). They are prevented from ever claiming statutory GSTN confirmation or synthesizing real Legal Acknowledgement Reference Numbers (ARNs).

---

## 1. Verified Current-State Audit (Ground Truth)

All findings below reflect the actual source code on branch `Sanjay`:

### 1.1 Database Architecture & Storage Engine
* **File:** `src/lib/services/tenantStore.js` (lines 1–24)
  * Directly imports `DatabaseSync` from `node:sqlite` and opens `data/gst_cda_v2.sqlite`.
  * All repository methods execute synchronous SQLite statements.
  * `withTenantContext` (lines 256–268) writes to a single shared variable `let activeOrganizationContext = null;`. It is never consumed by queries and introduces race conditions across asynchronous Node.js operations.
* **File:** `src/lib/db/postgres.js` (lines 1–87)
  * Disconnected from all application operations (`src/app/api/v1/*`).
  * **ESM Syntax Defect (line 52):** `const { createRequire } = require('node:module');` throws `ReferenceError: require is not defined` because `package.json` sets `"type": "module"`.
  * **Invalid PostgreSQL Syntax (line 68):** `await client.query('SET LOCAL app.organization_id = $1', [organizationId]);` throws `syntax error at or near "$1"` because PostgreSQL utility statements cannot be parameterized with `$1`. It must use `SELECT set_config('app.organization_id', $1, true)`.

### 1.2 Multi-Tenant Security & PostgreSQL RLS
* **File:** `migrations/001_multi_tenant_rls.sql` (lines 249–355)
  * Role `gst_cda_app` with `NOBYPASSRLS` is defined.
  * `FORCE ROW LEVEL SECURITY` is applied to tenant tables.
  * **Authentication Catch-22:** Policy `tenant_isolation_sessions` requires `organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid`. When an unauthenticated request arrives with only a cookie/token, `app.organization_id` is unknown. An RLS query under `gst_cda_app` returns 0 rows, blocking session resolution.
  * **Membership Discovery Catch-22:** RLS blocks listing a user's organizations upon login (`getUserMemberships(userId)`) before an active tenant context is set.
* **File:** `tests/postgresql-rls.test.js`
  * Relies on `pg-mem`, which does not support PostgreSQL RLS (`CREATE POLICY`, `FORCE ROW LEVEL SECURITY`).
  * Injects artificial `WHERE organization_id = ...` filters into test query strings, providing zero validation of PostgreSQL's native RLS engine.

### 1.3 Concurrency, Transactions & Data Integrity
* **File:** `src/lib/services/tenantStore.js`
  * **OCC TOCTOU Race Condition (lines 560–588, 683–713):** `updateSalesInvoice` and `updatePurchaseInvoice` fetch the row, compare `existing.version !== expectedVersion` in JavaScript, and execute an `UPDATE` without matching the version in SQL. Two concurrent requests reading version 1 both pass and overwrite each other.
  * **Audit Hash-Chain Forking (lines 845–866):** `appendAuditEvent` selects `prev_hash` from the latest row, hashes it in memory, and inserts. Concurrent writes read the same `prev_hash`, creating split branches in the cryptographic hash chain.
  * **Zero Transaction Atomicity:** Multi-table writes (reconciliation runs with exceptions, destructive resets) execute individual statements with no `BEGIN`/`COMMIT`/`ROLLBACK` error boundaries.

### 1.4 Authentication, Sessions & CSRF
* **File:** `src/app/api/v1/auth/logout/route.js` (lines 1–18)
  * **Missing CSRF Validation:** Does not call `validateCsrf(request)`. Cross-site POST requests from external origins can forcibly terminate sessions.
  * **Cookie Attribute Mismatch (lines 12–16):** Cookie clearing omits `sameSite: 'lax'`, `path: '/'`, and `secure: true`.
* **File:** `src/lib/security/csrf.js` (lines 22–40)
  * Omitting `Sec-Fetch-Site` and `Origin` headers passes silently without checking the `Referer` header or requiring an explicit CSRF header.

### 1.5 GST Filing Lifecycle & GSP Integration
* **File:** `src/app/api/v1/filings/route.js` (lines 1–89)
  * No check verifies whether a return period has an authorized approval record (`RETURN_FILING_AUTHORIZED`) signed by an Owner prior to submission.
  * Filings transition to `SUBMITTED` with `arn: null`. No webhook or polling endpoint exists to process statutory GSTN acknowledgement receipts (ARN, signed receipt hash), leaving filings permanently unresolved.
  * Return period status in `return_periods` is not synchronized.

### 1.6 Reset API Direct Database Access
* **File:** `src/app/api/reset/route.js` (lines 18–26)
  * Directly calls `getTenantDb().prepare('DELETE FROM ...')`.
  * Bypasses `TenantStore`, lacks transaction safety, and leaves orphaned records in `return_periods` and `import_jobs`.

---

## 2. Corrected Technical Architecture

```
                       ┌────────────────────────────────────────┐
                       │        Next.js API Layer (v1)          │
                       │   BFF Security Context & Role Auth     │
                       └──────────────────┬─────────────────────┘
                                          │
                                          ▼
                       ┌────────────────────────────────────────┐
                       │   Security Context & CSRF Validation   │
                       │   - validateCsrf() (Origin + Referer)  │
                       │   - AsyncLocalStorage Tenant Context   │
                       │     (Scope propagation helper only)    │
                       └──────────────────┬─────────────────────┘
                                          │
                                          ▼
                       ┌────────────────────────────────────────┐
                       │       TenantRepository Layer           │
                       │   Mandatory Tenant ID Parameterization │
                       │   + OCC SQL Atomic Compare-and-Swap    │
                       └─────────┬────────────────────┬─────────┘
                                 │                    │
                    DATABASE_URL │                    │ Permitted ONLY in Dev/Test
                         Present │                    │ (NODE_ENV !== 'production')
                                 ▼                    ▼
        ┌───────────────────────────────────┐    ┌──────────────────────────────────┐
        │      PostgreSQL Driver Pool       │    │       SQLite Driver (WAL)        │
        │   - Fail-Closed Production Boot   │    │   - Explicit Dev/Test Opt-In     │
        │   - set_config(app.org_id, true)  │    │   - Foreign Keys ON              │
        │   - Non-Owner gst_cda_app Role    │    │   - BEGIN IMMEDIATE Transactions │
        │   - Strict RLS (USING + CHECK)    │    │   - Preserves Existing Local DB  │
        │   - pg_advisory_xact_lock()       │    └──────────────────────────────────┘
        │   - Hardened SECURITY DEFINER     │
        └───────────────────────────────────┘
```

### 2.1 Production Fail-Closed Storage Engine Architecture
* **Production Rule:**
  ```javascript
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
      throw new Error('FATAL CONFIGURATION ERROR: DATABASE_URL pointing to PostgreSQL is mandatory in production. SQLite fallback is strictly prohibited.');
    }
  }
  ```
* **Local Development & Test Rule:**
  SQLite WAL mode is permitted only when `NODE_ENV !== 'production'` and `DATABASE_URL` is omitted. Existing data in `data/gst_cda_v2.sqlite` and `data/gst_cda.sqlite` is preserved and untouched.
* **Defense-in-Depth:**
  `AsyncLocalStorage` is utilized strictly for contextual request tracing and background scope propagation. **No tenant data authorization relies solely on AsyncLocalStorage.** Every repository query explicitly parameterizes `organization_id = $1` in application code, and PostgreSQL enforces RLS at the database engine level via `gst_cda_app`.

### 2.2 Hardened Authentication Bootstrap Mechanism
To resolve the RLS bootstrap paradox without compromising database security:
1. `auth_sessions` is queried through a hardened, security-definer function owned by the database migration admin.
2. The function enforces:
   * Fixed immutable `search_path`: `SET search_path = pg_catalog, public`.
   * Minimal privileges: Grants execute strictly to `gst_cda_app`; revokes execute from `PUBLIC`.
   * Narrow scope: Looks up strictly by SHA-256 `token_hash`, verifies `revoked = false AND expires_at > NOW()`, and returns only minimal session columns (`id`, `user_id`, `organization_id`, `role`, `expires_at`).
   ```sql
   CREATE OR REPLACE FUNCTION public.lookup_active_session(p_token_hash TEXT)
   RETURNS TABLE (
       id UUID,
       user_id UUID,
       organization_id UUID,
       role TEXT,
       expires_at TIMESTAMPTZ
   )
   LANGUAGE plpgsql
   STRICT
   SECURITY DEFINER
   SET search_path = pg_catalog, public
   AS $$
   BEGIN
       RETURN QUERY
       SELECT s.id, s.user_id, s.organization_id, s.role, s.expires_at
       FROM public.auth_sessions s
       WHERE s.token_hash = p_token_hash
         AND s.revoked = false
         AND s.expires_at > NOW();
   END;
   $$;

   REVOKE ALL ON FUNCTION public.lookup_active_session(TEXT) FROM PUBLIC;
   GRANT EXECUTE ON FUNCTION public.lookup_active_session(TEXT) TO gst_cda_app;
   ```
3. Membership discovery for login bootstrap is similarly isolated:
   ```sql
   CREATE OR REPLACE FUNCTION public.get_user_memberships_bootstrap(p_user_id UUID)
   RETURNS TABLE (
       organization_id UUID,
       organization_name TEXT,
       organization_slug TEXT,
       role TEXT,
       status TEXT
   )
   LANGUAGE plpgsql
   STRICT
   SECURITY DEFINER
   SET search_path = pg_catalog, public
   AS $$
   BEGIN
       RETURN QUERY
       SELECT m.organization_id, o.name, o.slug, m.role, m.status
       FROM public.organization_memberships m
       JOIN public.organizations o ON m.organization_id = o.id
       WHERE m.user_id = p_user_id
         AND m.status = 'ACTIVE'
         AND o.is_active = true;
   END;
   $$;

   REVOKE ALL ON FUNCTION public.get_user_memberships_bootstrap(UUID) FROM PUBLIC;
   GRANT EXECUTE ON FUNCTION public.get_user_memberships_bootstrap(UUID) TO gst_cda_app;
   ```

### 2.3 Advisory-Locked Per-Organization Audit Chaining
To prevent concurrent audit hash-chain forking without blocking other organizations:
1. Every audit write acquires a transaction-level advisory lock hashed to the organization ID:
   ```sql
   -- 64-bit advisory lock derived from organization UUID
   SELECT pg_advisory_xact_lock(('x' || substr(md5($1::text), 1, 16))::bit(64)::bigint);
   ```
2. Because it is a transaction-level lock (`pg_advisory_xact_lock`), it automatically releases on `COMMIT` or `ROLLBACK`.
3. Within this locked transaction:
   * Query the latest `event_hash` for that organization.
   * Compute the new SHA-256 event hash over `(prev_hash, organization_id, actor_id, action, entity_id, correlation_id, timestamp, metadata)`.
   * Insert the new event.
4. Concurrent writes within the same organization are strictly serialized. Distinct organizations run concurrently without contention.

### 2.4 Quarantined Mock vs. Statutory GSP Filings
1. **Mock Environment Quarantine:**
   * In local development and testing, `MockGspAdapter` generates simulated gateway acknowledgements.
   * Status is recorded as `MOCK_SUBMITTED` or `MOCK_ACK_RECEIVED`.
   * Provider tracking ID is strictly prefixed: `MOCK_SANDBOX_<uuid>`.
   * All responses return `isMockProvider: true` and a clear watermark: `"SIMULATED RECEIPT - NOT A STATUTORY GSTN ACKNOWLEDGEMENT"`.
   * Under no circumstances is a mock filing marked `FILED` or given an ARN.
2. **Production Statutory Pipeline:**
   * In production, the system requires a certified, licensed GST Suvidha Provider (e.g. Cygnet, ClearTax, Masters India).
   * Webhook callback route (`POST /api/v1/filings/callback`) validates the GSP cryptographic signature (HMAC-SHA256) using a pre-shared secret.
   * Real GSTN ARN and signed GSTN acknowledgement payload hashes are recorded upon confirmation, moving status to `FILED`.
   * If GSP credentials are absent in production, return submission fails closed with `503 Service Unavailable`.

---

## 3. Phased Implementation Plan

### Phase 1: PostgreSQL Integration and Database Architecture
* **Files to Modify:**
  * `src/lib/db/postgres.js`
  * `src/lib/services/tenantStore.js`
  * `src/lib/db/adapter.js` (New unified adapter interface)
* **Problems Addressed:** ESM syntax bug, unparameterized `SET LOCAL`, hardcoded SQLite coupling, production fail-closed enforcement.
* **Implementation:**
  * Fix ESM import: `import { createRequire } from 'node:module';`.
  * Parameterize session scope: `await client.query("SELECT set_config('app.organization_id', $1, true)", [orgId]);`.
  * Enforce fail-closed production check for `DATABASE_URL`.
  * Create `TenantRepository` supporting `PostgresAdapter` and `SqliteAdapter`.
  * Wrap context propagation with `AsyncLocalStorage`.
* **Dependencies & Migration:** `pg` package (already in `package.json`). Zero external runtime additions.
* **Breaking Changes:** None. External API contracts remain unchanged.
* **Rollback Strategy:** Revert git commit; fallback to existing SQLite adapter.

---

### Phase 2: Tenant Isolation and PostgreSQL RLS
* **Files to Modify:**
  * `migrations/001_multi_tenant_rls.sql`
  * `migrations/002_security_definer_auth.sql` (New hardened functions)
  * `scripts/migrate-postgres.js`
  * `tests/real-postgres-rls.test.js` (New real PostgreSQL RLS test)
* **Problems Addressed:** RLS auth catch-22, membership discovery deadlock, mock test gaps.
* **Implementation:**
  * Implement `lookup_active_session` and `get_user_memberships_bootstrap` functions with fixed `search_path = pg_catalog, public`.
  * Grant execute permissions strictly to `gst_cda_app`.
  * Enforce `USING` and `WITH CHECK` on all business tables (`sales_invoices`, `purchase_invoices`, `reconciliation_runs`, `exception_cases`, `filing_attempts`, `import_jobs`, `audit_events`).
* **Dependencies:** Free local Docker container `postgres:16-alpine`.
* **Breaking Changes:** None.
* **Rollback Strategy:** Rollback migration via `DROP FUNCTION` and re-applying baseline schema.

---

### Phase 3: Transactions, Concurrency and Data Integrity
* **Files to Modify:**
  * `src/lib/services/tenantStore.js`
  * `src/app/api/reset/route.js`
* **Problems Addressed:** TOCTOU version overwrite, audit chain forking, unencapsulated non-transactional reset.
* **Implementation:**
  * Atomic SQL Update:
    ```sql
    UPDATE sales_invoices
    SET party_name = $1, taxable_paise = $2, total_paise = $3, version = version + 1, updated_at = $4
    WHERE organization_id = $5 AND id = $6 AND version = $7
    RETURNING *;
    ```
    If row not updated, check existence: throw 412 if version mismatch, 404 if not found.
  * Audit Chaining: Execute inside a transaction with `pg_advisory_xact_lock`.
  * Encapsulated Reset: Move all logic to `TenantRepository.resetTenantData(orgId, actorId, correlationId)` inside a single database transaction.
* **Tests:** 5 parallel invoice updates; 20 parallel audit writes; reset error rollback test.

---

### Phase 4: Authentication, Sessions and CSRF
* **Files to Modify:**
  * `src/lib/security/csrf.js`
  * `src/app/api/v1/auth/logout/route.js`
  * `src/lib/security/session.js`
* **Problems Addressed:** Missing logout CSRF, cookie security flag mismatches, session accumulation.
* **Implementation:**
  * In `logout/route.js`, call `validateCsrf(request)`.
  * Clear cookie with exact attributes: `sameSite: 'lax'`, `path: '/'`, `secure: process.env.NODE_ENV === 'production'`.
  * In `csrf.js`, inspect `Referer` if `Origin` is missing on cookie-authenticated mutations.
  * Add `TenantRepository.revokeAllUserSessions(userId)` and `cleanupExpiredSessions()`.
* **Tests:** Cross-origin logout rejection (403); same-origin logout success; expired session revocation.

---

### Phase 5: GST Filing Lifecycle and Genuine GSP Integration
* **Files to Modify:**
  * `src/app/api/v1/filings/route.js`
  * `src/app/api/v1/filings/[id]/route.js`
  * `src/app/api/v1/filings/callback/route.js` (New: GSP webhook receiver)
  * `packages/integrations/core/gspAdapter.js` (New: isolated GSP client & mock)
* **Problems Addressed:** Unverified return submission, missing statutory receipt ingestion, mock vs production confusion.
* **Implementation:**
  * In `filings/route.js`, verify the period has `RETURN_FILING_AUTHORIZED` signed by an Owner.
  * Quarantined mock responses return `status: 'MOCK_SUBMITTED'` and disclaimer receipt.
  * In `filings/callback/route.js`, verify `X-GSP-Signature` HMAC, parse real ARN, update `filing_attempts` to `FILED`, and update `return_periods.status = 'FILED'`.
* **Tests:** Submission without authorization rejected (400); mock receipt marked non-statutory; valid statutory webhook receipt transitions to `FILED` with authentic ARN.

---

### Phase 6: Testing, Security Verification & Production Build
* **Files to Modify:**
  * `package.json`
  * `tests/api-v1.test.js`
  * `tests/tenant-isolation.test.js`
  * `tests/real-postgres-rls.test.js`
* **Implementation:**
  * Execute `npm install` (outside sandbox for pnpm/npm binary stability).
  * Run full unit & integration suite (`npm test`).
  * Run 12-scenario real PostgreSQL RLS test suite against local Docker container as `gst_cda_app`.
  * Execute Next.js production build (`npx next build`).

---

## 4. Real PostgreSQL Testing Matrix (12 Scenarios)

The test suite will execute against a local PostgreSQL container (`postgres:16-alpine`) running under the non-owner role `gst_cda_app`:

1. **Cross-Tenant SELECT:** Org B cannot read Org A sales invoices (returns 0 rows).
2. **Cross-Tenant INSERT:** Org B cannot insert with Org A's ID (throws PostgreSQL RLS policy violation).
3. **Cross-Tenant UPDATE:** Org B cannot mutate Org A's invoices (0 rows affected).
4. **Cross-Tenant DELETE:** Org B cannot delete Org A's invoices (0 rows affected).
5. **Missing Tenant Scope:** Queries executed without setting `app.organization_id` return 0 rows.
6. **Invalid/Forged Scope:** Passing an unauthorized UUID fails authorization.
7. **Connection Pool Leakage:** Releasing connection to pool and checking out does not bleed tenant scope.
8. **Session Expiration & Revocation:** Expired/revoked sessions return null and fail authentication.
9. **Concurrent Invoice Updates:** 5 simultaneous updates against the same invoice; exactly 1 increments version, 4 receive 412 Precondition Failed.
10. **Advisory-Locked Audit Chaining:** 20 concurrent audit events generate an unbroken linear SHA-256 chain with zero forks.
11. **Filing Webhook Validation:** Valid webhook transitions filing from `SUBMITTED` to `FILED` with ARN; invalid HMAC is rejected.
12. **Reset Transaction Rollback:** Simulated database failure during reset rolls back all deletions completely.

---

## 5. Security Threat Analysis (STRIDE Model)

| Threat | Vulnerability in Codebase | Remediated Architecture |
| :--- | :--- | :--- |
| **Spoofing** | Stale session cookie persists after logout | Strict cookie security flags + database session revocation + CSRF protection |
| **Tampering** | In-memory version check (TOCTOU) | Atomic SQL conditional update (`WHERE version = $expected`) |
| **Tampering** | Audit hash-chain forking under concurrency | Per-organization transaction advisory lock (`pg_advisory_xact_lock`) |
| **Repudiation** | Filing returns without taxpayer approval | Compulsory verification of Owner-signed `RETURN_FILING_AUTHORIZED` |
| **Information Disclosure** | Cross-tenant data exfiltration | `FORCE ROW LEVEL SECURITY` with non-owner role `gst_cda_app` |
| **Denial of Service** | Cross-site forced logout attack | `validateCsrf(request)` mandatory on `POST /api/v1/auth/logout` |
| **Elevation of Privilege** | Session lookup bypasses tenant isolation | Hardened `SECURITY DEFINER` function with fixed `search_path = pg_catalog, public` |

---

## 6. Acceptance Criteria

1. In `NODE_ENV === 'production'`, boot fails closed if `DATABASE_URL` is missing.
2. In development/testing, existing SQLite databases (`data/gst_cda_v2.sqlite`) remain intact and functional.
3. PostgreSQL schema and hardened security-definer functions execute cleanly.
4. All 12 real PostgreSQL test scenarios pass under `gst_cda_app`.
5. `POST /api/v1/auth/logout` rejects cross-site requests missing CSRF verification.
6. `POST /api/reset` operates through `TenantRepository` in an atomic transaction.
7. Next.js build (`npx next build`) completes cleanly with zero errors.

---

*This Revised Master Plan (Rev 2.0) is complete. Implementation will proceed only after your explicit approval.*
