# GST CDA - Architecture & System Design

**Tagline:** *GST Made Simple. Business Made Easy.*  
**System Classification:** Indian Compliance SaaS (SME/MSME/Taxpayer & CA Assisted)  
**Deployment Target:** Web Application (Next.js App Router, TypeScript Strict Mode, SQLite / PostgreSQL, Prisma ORM)

---

## 1. System Overview

GST CDA is architected as a modular monolith adhering to strict domain boundaries, separation of concerns, and rigorous truthfulness standards:

```mermaid
graph TD
  UserClient[Web & Mobile Client (Accessible UI)] --> BFF[Next.js App Router & Server Actions]
  BFF --> Authz[Auth & Multi-Tenant RBAC]
  Authz --> Services[Domain Services Layer]
  
  subgraph "Domain Core Services"
    Services --> TaxEngine[Deterministic Tax Engine]
    Services --> InvService[Sales & Purchases Service]
    Services --> ReturnPrep[GSTR-1 & GSTR-3B Prep Engine]
    Services --> Reconciler[GSTR-2B Matching Engine]
    Services --> ImportWizard[CSV / Excel Import Engine]
    Services --> DocVault[Document Vault & Grants]
  end

  subgraph "Intelligence & Assistant"
    Services --> Copilot[Server-side Grounded Copilot]
    Copilot -.-> ContextPack[Tenant-scoped Redacted Context Package]
  end

  subgraph "Integration Layer (Never Browser Facing)"
    Services --> IntGateway[Integration Gateway & Circuit Breaker]
    IntGateway --> CapRegistry[182-API Capability Registry]
    IntGateway --> Adapter[ProviderAdapter Interface]
    Adapter --> SandboxMock[Mock Sandbox Provider]
    Adapter -.-> LiveGSP[Live Authorized GSP/GSTN (Disabled by default)]
  end

  subgraph "Data Storage"
    Services --> DB[(Prisma ORM - PostgreSQL / SQLite)]
    DocVault --> EncryptedStorage[(Private Storage Vault)]
  end
```

---

## 2. Core Architectural Pillars

### 2.1 Truthfulness & Statutory Integrity
- **No Inferred Success:** The system never simulates or invents a successful filing. A filing status only transitions to `FILED` upon cryptographically verified ARN acknowledgement from a validated GSP adapter.
- **Deterministic Math:** Float arithmetic is strictly prohibited for financial numbers. All monetary quantities are represented in integer minor units (paise) or exact decimals.
- **AI Boundaries:** The Copilot operates strictly on a server-side read-only context package. It is prohibited from executing tax computations, altering return numbers, or making compliance determinations.

### 2.2 Security & Tenant Isolation
- Every query, mutation, export, and search is enforced with a verified `businessId` tenant scope.
- Zero credential leakage: Tokens and secrets are isolated in `EncryptedTokenSecret` and never returned across the client boundary.
- Granular Role-Based Access Control (RBAC):
  - **OWNER**: Full administrative and filing authority.
  - **CA**: Scoped preparation, draft review, and document access across invited clients.
  - **KIOSK_OPERATOR**: Assisted customer onboarding and document intake; restricted from sensitive tenant credentials.
  - **VIEWER**: Read-only business data exploration.

---

## 3. Module Boundaries & Responsibilities

1. **`packages/domain`**: Pure TypeScript domain interfaces, entities, status enumerations, and validation schemas (Zod).
2. **`packages/tax-engine`**: Pure, deterministic statutory tax calculations (Intra-state CGST + SGST vs Inter-state IGST, rate tables 0% to 28%, exact paise rounding, place-of-supply resolution).
3. **`packages/integrations`**: `ProviderAdapter` abstraction, capability registry categorizing all 182 APIs from the test workbook, circuit breaker, idempotency guard, and mock contracts.
4. **`packages/authz`**: Role definitions, granular permission checks, and tenancy assertion helpers.
5. **`packages/ai`**: Server-side grounded GST Copilot orchestrator with provenance tagging (`BASED_ON_RECORDS`, `GENERAL_EXPLANATION`, `NEEDS_VERIFICATION`).
6. **`apps/web`**: Next.js App Router frontend, Tailwind accessible design system, and multi-step assisted wizards.

