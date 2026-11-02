# TaxMate - Security, Privacy & Threat Model

**Standard:** Section 9 of System Specification  
**Classification:** Financial & Statutory Data Compliance (India Digital Personal Data Protection Act - DPDP)

---

## 1. Threat Modeling & Mitigation Matrix

| Threat Category | Potential Vector | Security Control Implemented |
|:---|:---|:---|
| **Multi-Tenant Data Leakage** | User alters `businessId` in URL/request payload to access unauthorized records | **Tenant Isolation Enforcement:** Every server action and query strictly scopes reads and writes to `where: { businessId: session.activeBusinessId }`. |
| **Credential / Token Exposure** | GSP credentials, Auth tokens or App keys leaked in logs, client bundles, or AI context | **Zero-Client Secret Boundary:** Secrets stored exclusively in `EncryptedTokenSecret`. Client never receives provider tokens. AI prompts receive strictly redacted payloads without auth headers. |
| **Tampered Filing State** | Client attempts to mark return draft as `FILED` without valid GSP acknowledgement | **Server-side State Machine Guard:** The status `FILED` can only be set by verified GSP cryptographic response handling containing verified ARN and request correlation IDs. |
| **Privilege Escalation** | Invited CA or Kiosk operator modifying organization settings or deleting audit logs | **Granular RBAC:** Server-side capability check prevents non-owner roles from accessing secret keys, tenant deletion, or audit manipulation. Kiosk sessions are time-bounded and scoped. |
| **Malicious Document Upload** | Uploading malware/executables masked as tax invoices | **Strict Upload Verification:** MIME type validation, file size limits (max 10MB), magic bytes validation, and signed, expiring download URLs. |
| **AI Prompt Injection / Poisoning** | User tricks Copilot into approving illegitimate tax deduction or inventing fake filing proof | **Read-Only Server Orchestrator:** Copilot cannot call write tools, cannot mutate databases, and includes system-level guardrails prohibiting tax authority impersonation. |

---

## 2. Authentication & Session Architecture

- **Session Security:** HTTP-only, secure, `SameSite=Lax` session cookies with CSRF defense.
- **Password Policies:** Argon2id or bcrypt hashing with high cost factor; prevention of common credentials.
- **Audit Logging:** Every critical statutory action (`INVOICE_CREATED`, `INVOICE_DELETED`, `FILING_AUTHORISED`, `CA_INVITED`, `CA_REVOKED`) writes an immutable record to `AuditLog`.

---

## 3. Data Retention & Cryptography

- **Rest Cryptography:** Sensitive GSP tokens are encrypted using AES-256-GCM with distinct Initialization Vectors (IVs) and tenant-isolated salt keys.
- **DPDP Compliance:** Right to export invoice books in open format (JSON/CSV), soft-delete with 30-day purge cycle, and transparent privacy notices.

