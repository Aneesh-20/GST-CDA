# GST CDA — Phase 1 Remediation Report

**Date:** 2026-11-02  
**Branch:** `Sanjay` (tracking `origin/Sanjay`)  
**Status:** **PASS** (Ready for Phase 1 Sign-Off)  
**Auditor / Architect:** Senior Backend Architect, PostgreSQL Database Engineer & Application Security Engineer  

---

## 1. Executive Summary

Phase 1 of the GST CDA Security & Architectural Remediation has been fully implemented and verified against the actual codebase. All critical findings identified in `docs/PHASE_1_INDEPENDENT_VERIFICATION.md` have been systematically resolved:

1. **Database Adapter Layer Implemented:** Created `src/lib/db/adapter.js` with unified abstraction (`DatabaseAdapter`, `PostgresAdapter`, `SqliteAdapter`). Supports parameterized queries, transactional execution (`withTransaction`), and `AsyncLocalStorage` tenant context isolation (`withTenantContext`).
2. **TenantStore CRUD Operations Refactored:** All 26+ CRUD methods in `TenantStore` now execute strictly through the database adapter interface (`getAdapter().queryOne()`, `queryAll()`, `execute()`, `withTransaction()`), removing raw calls to `getTenantDb()` from application operations.
3. **Production Fail-Closed Enforcement:** Designed and implemented `src/lib/db/startup.js` and `src/instrumentation.js`. In `NODE_ENV === 'production'`, the server verifies `DATABASE_URL` is configured and points to PostgreSQL. If missing or invalid, the application fails immediately and refuses to accept incoming traffic.
4. **API Direct SQLite Access Eliminated:** `src/app/api/reset/route.js` has been completely rewritten. All raw SQLite statements were removed; resets now route exclusively through `TenantStore.resetTenantData(...)` in an atomic transaction.
5. **PostgreSQL Adapter ESM & Transaction Fixes:** Fixed ESM `createRequire` imports in `src/lib/db/postgres.js`. Tenant context is set per transaction via parameterized `SELECT set_config('app.organization_id', $1, true)`. In `finally`, connections are sanitized (`SELECT set_config('app.organization_id', '', false)`) before returning to the pool.
6. **Backward Compatibility & Local Data Preserved:** Existing SQLite databases (`data/gst_cda_v2.sqlite`) and SQLite development modes remain fully operational. All existing 100 organizations, 63 users, and 43 invoices remain intact.
7. **Comprehensive Test Suite:** 17 automated tests run and pass cleanly with 0 failures, covering production fail-closed behavior, tenant context isolation, parameter normalization, transactional resets, RLS simulation, and the full API v1 lifecycle.

---

## 2. Changed & Created Files

| File | Status | Description |
|---|---|---|
| `src/lib/db/adapter.js` | **Created** | Unified database adapter interface (`DatabaseAdapter`, `PostgresAdapter`, `SqliteAdapter`), parameter normalizer (`$n` to `?` for SQLite), and `AsyncLocalStorage` context scoping. |
| `src/lib/db/startup.js` | **Created** | Production startup check validating PostgreSQL connection and rejecting traffic if `DATABASE_URL` is missing. |
| `src/instrumentation.js` | **Created** | Next.js server startup hook invoking database validation before traffic is served. |
| `src/lib/db/postgres.js` | **Modified** | Fixed ESM require, parameterized `set_config` transaction handling, connection pool hygiene, and fail-closed checks. |
| `src/lib/services/tenantStore.js` | **Modified** | Refactored all 26+ CRUD operations to query through `getAdapter()`. Added `resetTenantData()` atomic method. |
| `src/app/api/reset/route.js` | **Modified** | Replaced direct SQLite database statements with `TenantStore.resetTenantData()`. |
| `tests/database-adapter-phase1.test.js` | **Created** | Unit & integration tests for adapter operations, parameterized queries, tenant isolation, and transactional resets. |
| `docs/GST_CDA_REMEDIATION_MASTER_PLAN.md` | **Created** | Comprehensive Revision 2.0 remediation master plan with architectural safeguards. |
| `docs/PHASE_1_REMEDIATION_REPORT.md` | **Created** | This report. |

---

## 3. Detailed Architectural Fixes

### 3.1 TenantStore Database Adapter Integration
- **Previous Flaw:** `TenantStore` hardcoded `this.getTenantDb()` in all CRUD methods, bypassing PostgreSQL even when `DATABASE_URL` was provided.
- **Remediation:** 
  - `TenantStore.getAdapter()` returns the active `DatabaseAdapter` (`PostgresAdapter` or `SqliteAdapter`).
  - CRUD operations (`createOrganization`, `createUser`, `createMembership`, `saveSessionRecord`, `createSalesInvoice`, `getSalesInvoices`, `updateSalesInvoice`, `deleteSalesInvoice`, `createPurchaseInvoice`, `createReconciliationRun`, `createFilingAttempt`, `appendAuditEvent`, etc.) now execute through `this.getAdapter().execute()`, `queryOne()`, `queryAll()`, or `withTransaction()`.
  - SQLite compatibility is maintained via `SqliteAdapter._normalizeSql()`, translating `$1, $2, ...` to `?` while ensuring PostgreSQL receives native positional parameters.

### 3.2 Reset API Isolation & Atomicity
- **Previous Flaw:** `src/app/api/reset/route.js` directly imported `getTenantDb()` and executed raw SQLite `DELETE FROM` statements, creating risk of orphaned tenant records, bypassing audit trails, and failing in PostgreSQL.
- **Remediation:**
  - Added `TenantStore.resetTenantData({ organizationId, actorId, correlationId, action })`.
  - Executes inside an atomic transaction:
    - If `action === 'ALL'`, deletes all sales invoices, purchase invoices, and reconciliation runs for that organization.
    - If `action === 'RECONCILIATION'`, clears only reconciliation runs and resets purchase invoice statuses.
    - Appends an immutable `RESET_TENANT_DATA` audit event within the same transaction.
  - `src/app/api/reset/route.js` delegates entirely to `TenantStore.resetTenantData()`. Direct SQLite database imports have been removed.

### 3.3 Production Fail-Closed Startup Check
- **Previous Flaw:** If `DATABASE_URL` was missing in production, the system silently defaulted to SQLite, violating enterprise compliance.
- **Remediation:**
  - `src/lib/db/startup.js` exports `verifyProductionDatabaseConfig()`.
  - If `process.env.NODE_ENV === 'production'`:
    - Checks that `DATABASE_URL` is set and begins with `postgres://` or `postgresql://`.
    - If invalid, throws `FATAL STARTUP ERROR: PostgreSQL DATABASE_URL is mandatory in production environment. Refusing to accept traffic.` and terminates the process (`process.exit(1)`).
  - Wired into `src/instrumentation.js` `register()` lifecycle hook.

### 3.4 Connection Pool Cleanliness & Parameterized Context
- **Previous Flaw:** `set_config` string interpolation was vulnerable to injection, and connections returned to the pool retained prior tenant settings.
- **Remediation:**
  - `src/lib/db/postgres.js` sets tenant context via `SELECT set_config('app.organization_id', $1, true)` (transaction-local).
  - In `finally` blocks, `SELECT set_config('app.organization_id', '', false)` is executed before releasing the connection back to `pool`.

---

## 4. Test Evidence & Output

### 4.1 Test Suite Run (`npm test`)
```
> gst-cda@1.0.0 test
> node --test --test-concurrency=1 tests/**/*.test.js

✔ API v1: Full Lifecycle (Signup -> Me -> Invoices -> Concurrency -> Filing -> Audit) (208.9688ms)
FATAL STARTUP ERROR: PostgreSQL DATABASE_URL is mandatory in production environment. Refusing to accept traffic.
✔ Phase 1: Production Fail-Closed Enforcement (5.3721ms)
✔ Phase 1: AsyncLocalStorage Tenant Context Concurrency Isolation (59.1136ms)
✔ Phase 1: PostgreSQL Adapter & set_config Transaction Handling (827.9076ms)
✔ Phase 1: SqliteAdapter & Node:SQLite Parameter Normalization (15.7057ms)
✔ Phase 1: TenantStore Operations Route Through Database Adapter (3.3915ms)
✔ Phase 1: Transactional Tenant Data Reset Without Direct SQLite Access (94.7876ms)
[Migration] Found 1 users, 1 businesses, 1 sales, 1 purchases, 0 audits.
[Migration] Reconciliation Report: {
  status: 'COMPLETED',
  legacyUsersCount: 1,
  migratedOrganizationsCount: 1,
  salesPaiseMatch: true,
  purchasesPaiseMatch: true,
  totalSalesPaiseLegacy: '118000',
  totalSalesPaiseMigrated: '118000',
  totalPurchasesPaiseLegacy: '59000',
  totalPurchasesPaiseMigrated: '59000'
}
✔ Migration: Verify Legacy SQLite to Multi-Tenant Reconciliation (15.8134ms)
✔ PostgreSQL RLS: Enforce USING + WITH CHECK with non-owner role & absent scope rejection (79.1578ms)
✔ 1. Security: Password Hashing & Verification with PBKDF2 (236.2519ms)
✔ 2. Security: Persistent Hashed Session Token Signing & Revocation (103.5556ms)
✔ 3. Tenancy & Isolation: Org A cannot read or mutate Org B data (203.8764ms)
✔ 4. RBAC: Role Permissions Enforcement (0.2402ms)
✔ 5. Optimistic Concurrency Control (If-Match) (21.2112ms)
✔ 6. Filing State Machine: Idempotency & No Fake ARN Synthesis (86.9748ms)
✔ 7. Audit Trail: Tamper-Evident SHA-256 Hash Chaining (79.8538ms)
✔ 8. Currency: Paise BigInt Precision & Purchase Default ITC NEEDS_REVIEW (16.5569ms)
ℹ tests 17
ℹ suites 0
ℹ pass 17
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3927.7753
```

### 4.2 Production Build Verification (`npm run build`)
```
> gst-cda@1.0.0 build
> next build --webpack

▲ Next.js 16.4.3 (webpack)
✓ Running next.config took 40ms

  Creating an optimized production build ...
✓ Compiled successfully in 13.1s
  Running TypeScript ...
  Finished TypeScript in 7ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/26) ...
  Generating static pages using 7 workers (6/26) 
  Generating static pages using 7 workers (12/26) 
  Generating static pages using 7 workers (19/26) 
✓ Generating static pages using 7 workers (26/26) in 1116ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/audit
├ ƒ /api/auth
├ ƒ /api/business
├ ƒ /api/invoices/parse-pdf
├ ƒ /api/invoices/purchases
├ ƒ /api/invoices/sales
├ ƒ /api/reset
├ ƒ /api/v1/audit-events
├ ƒ /api/v1/auth/login
├ ƒ /api/v1/auth/logout
├ ƒ /api/v1/auth/signup
├ ƒ /api/v1/exception-cases
├ ƒ /api/v1/exception-cases/[id]/actions
├ ƒ /api/v1/filings
├ ƒ /api/v1/filings/[id]
├ ƒ /api/v1/gst-registrations
├ ƒ /api/v1/gst-registrations/[id]
├ ƒ /api/v1/imports
├ ƒ /api/v1/imports/[id]
├ ƒ /api/v1/invitations
├ ƒ /api/v1/legal-entities
├ ƒ /api/v1/me
├ ƒ /api/v1/purchase-invoices
├ ƒ /api/v1/purchase-invoices/[id]
├ ƒ /api/v1/reconciliation-runs
├ ƒ /api/v1/return-periods/[id]/prepare
├ ƒ /api/v1/returns/[id]/approve
├ ƒ /api/v1/sales-invoices
├ ƒ /api/v1/sales-invoices/[id]
├ ƒ /api/v1/session/switch-organization
└ ○ /login

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
Exit code: 0
```

### 4.3 SQLite Local Data Verification
Inspected `data/gst_cda_v2.sqlite` with `DatabaseSync`:
- **Organizations:** 100 records (intact)
- **Users:** 63 records (intact)
- **Sales Invoices:** 32 records (intact)
- **Purchase Invoices:** 11 records (intact)
- Zero data loss or corruption.

---

## 5. Remaining Risks & Phasing Roadmap

| Area | Status in Phase 1 | Action Required in Subsequent Phases |
|---|---|---|
| **PostgreSQL RLS Migrations** | Tested via mock/adapter | **Phase 2:** Apply real PostgreSQL DDL migrations (`001_initial_schema.sql`, `002_rls_policies.sql`) with dedicated non-owner role `gst_cda_app`. |
| **Auth Session Bootstrap** | Functional in SQLite & Adapter | **Phase 2:** Harden `SECURITY DEFINER` session lookup with strict `search_path`, parameter validation, and restricted permissions. |
| **Advisory Lock Concurrency** | Basic transaction support | **Phase 3:** Introduce PostgreSQL transaction-level advisory locks (`pg_advisory_xact_lock`) for audit hash-chain serialization and optimistic concurrency. |
| **Authentication & CSRF** | Functional | **Phase 4:** Enforce SameSite cookie attributes, CSRF double-submit token on logout, and secure password reset. |
| **GST Filing & Provider Lifecycle** | Mock provider separated | **Phase 5:** Implement real GSP webhook signature verification, replay protection, and provider polling state machine. |

---

## 6. Status & Recommendation

- **Phase 1 Remediation Status:** **PASS**
- **Git State:** Local modifications and untracked files on branch `Sanjay`. No commits or pushes have been made.
- **Recommendation:** Proceed to Phase 2 (Tenant Isolation, PostgreSQL RLS & Schema Migrations) upon explicit user review and approval.

