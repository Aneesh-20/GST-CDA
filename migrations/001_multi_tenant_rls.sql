-- PostgreSQL Multi-Tenant Migration with Row-Level Security (RLS)
-- Tenancy hierarchy: organization -> legal_entity -> gst_registration -> return_period

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Identity & Tenancy
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT NOT NULL DEFAULT 'STANDARD',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'VIEWER', -- OWNER, CA, ADMIN, KIOSK_OPERATOR, VIEWER
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INVITED, SUSPENDED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_user UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CA',
    invited_by UUID NOT NULL REFERENCES users(id),
    token_hash TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, REVOKED, EXPIRED
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Taxpayer Entities
CREATE TABLE IF NOT EXISTS legal_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    legal_name TEXT NOT NULL,
    trade_name TEXT,
    pan TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- PROPRIETORSHIP, PARTNERSHIP, LLP, PVT_LTD, OTHER
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_pan UNIQUE (organization_id, pan)
);

CREATE TABLE IF NOT EXISTS gst_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    legal_entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
    gstin TEXT UNIQUE NOT NULL,
    state_code TEXT NOT NULL,
    state_name TEXT NOT NULL,
    registration_type TEXT NOT NULL DEFAULT 'REGULAR', -- REGULAR, COMPOSITION, SEZ
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS return_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    gst_registration_id UUID NOT NULL REFERENCES gst_registrations(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL, -- e.g. "2026-09"
    financial_year TEXT NOT NULL, -- e.g. "2026-27"
    month INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, RECONCILED, PREPARED, FILED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_reg_period UNIQUE (gst_registration_id, period_key)
);

-- 3. Books & Invoices (Exact minor-unit paise bigint)
CREATE TABLE IF NOT EXISTS sales_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    legal_entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
    gst_registration_id UUID NOT NULL REFERENCES gst_registrations(id) ON DELETE CASCADE,
    return_period_key TEXT NOT NULL,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    party_name TEXT NOT NULL,
    party_gstin TEXT,
    place_of_supply TEXT NOT NULL,
    supply_type TEXT NOT NULL, -- INTRA, INTER
    taxable_paise BIGINT NOT NULL,
    rate_percent NUMERIC(5,2) NOT NULL,
    cgst_paise BIGINT NOT NULL DEFAULT 0,
    sgst_paise BIGINT NOT NULL DEFAULT 0,
    igst_paise BIGINT NOT NULL DEFAULT 0,
    total_paise BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED', -- DRAFT, CONFIRMED, CANCELLED
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_sales_inv UNIQUE (gst_registration_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS purchase_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    legal_entity_id UUID NOT NULL REFERENCES legal_entities(id) ON DELETE CASCADE,
    gst_registration_id UUID NOT NULL REFERENCES gst_registrations(id) ON DELETE CASCADE,
    return_period_key TEXT NOT NULL,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    party_name TEXT NOT NULL,
    party_gstin TEXT,
    place_of_supply TEXT NOT NULL,
    supply_type TEXT NOT NULL,
    taxable_paise BIGINT NOT NULL,
    rate_percent NUMERIC(5,2) NOT NULL,
    cgst_paise BIGINT NOT NULL DEFAULT 0,
    sgst_paise BIGINT NOT NULL DEFAULT 0,
    igst_paise BIGINT NOT NULL DEFAULT 0,
    total_paise BIGINT NOT NULL,
    itc_eligibility TEXT NOT NULL DEFAULT 'ELIGIBLE', -- ELIGIBLE, INELIGIBLE, BLOCKED
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_purchase_inv UNIQUE (gst_registration_id, party_gstin, invoice_number)
);

-- 4. Reconciliation & Exceptions
CREATE TABLE IF NOT EXISTS reconciliation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    gst_registration_id UUID NOT NULL REFERENCES gst_registrations(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL,
    rule_version TEXT NOT NULL DEFAULT 'v1.0.0',
    matched_count INTEGER NOT NULL DEFAULT 0,
    mismatched_count INTEGER NOT NULL DEFAULT 0,
    missing_in_2b_count INTEGER NOT NULL DEFAULT 0,
    missing_in_books_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exception_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    reconciliation_run_id UUID NOT NULL REFERENCES reconciliation_runs(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    party_name TEXT NOT NULL,
    difference_paise BIGINT NOT NULL DEFAULT 0,
    exception_type TEXT NOT NULL, -- MISMATCHED_TAX, MISSING_IN_2B, MISSING_IN_BOOKS, INVALID_GSTIN
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, ACCEPTED, REJECTED, RESOLVED
    assigned_to UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Filings & Submissions
CREATE TABLE IF NOT EXISTS filing_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    gst_registration_id UUID NOT NULL REFERENCES gst_registrations(id) ON DELETE CASCADE,
    period_key TEXT NOT NULL,
    return_type TEXT NOT NULL, -- GSTR-1, GSTR-3B, GSTR-9
    idempotency_key TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PREPARED', -- PREPARED, AUTHORIZED, SUBMITTED, FILED, REJECTED
    arn TEXT,
    payload_hash TEXT NOT NULL,
    response_hash TEXT,
    authorized_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Imports & Batch Jobs
CREATE TABLE IF NOT EXISTS import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- SALES, PURCHASES
    filename TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PROCESSING', -- PROCESSING, COMPLETED, FAILED
    total_rows INTEGER NOT NULL DEFAULT 0,
    valid_rows INTEGER NOT NULL DEFAULT 0,
    error_rows INTEGER NOT NULL DEFAULT 0,
    error_log JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Audit Trail (Tamper-evident hash chained)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    prev_hash TEXT NOT NULL,
    event_hash TEXT NOT NULL,
    correlation_id TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_memberships_user ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON auth_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sales_org ON sales_invoices(organization_id, gst_registration_id);
CREATE INDEX IF NOT EXISTS idx_purchases_org ON purchase_invoices(organization_id, gst_registration_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_events(organization_id, created_at DESC);

-- Enable Row-Level Security (RLS) on all tenant-owned tables
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exception_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE filing_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- PostgreSQL server enforces that app.organization_id is set per transaction:
-- SET LOCAL app.organization_id = 'uuid';
CREATE POLICY tenant_isolation_memberships ON organization_memberships
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_entities ON legal_entities
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_registrations ON gst_registrations
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_periods ON return_periods
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_sales ON sales_invoices
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_purchases ON purchase_invoices
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_reconciliations ON reconciliation_runs
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_exceptions ON exception_cases
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_filings ON filing_attempts
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_imports ON import_jobs
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY tenant_isolation_audit ON audit_events
    USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);
