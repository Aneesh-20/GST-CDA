# GST CDA - Operations & Deployment Runbook

**Target Environments:** Local Workstation (Development & Testing), Staging (Sandbox GSP), Production (Certified GSP/GSTN)

---

## 1. Quickstart Guide (Local Development)

### 1.1 Prerequisites
- Node.js >= 18.x (tested on Node v24)
- npm >= 9.x

### 1.2 Installation & Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Generate Prisma client & apply database migrations (SQLite out-of-the-box)
npx prisma db push

# 4. Seed database with demo company ("Sharma Hardware & Trading Co.")
npm run db:seed

# 5. Start the development server
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

---

## 2. Environment Variables Specification

See `.env.example` for all configurable keys.

| Variable Name | Required | Default / Example | Purpose |
|:---|:---:|:---|:---|
| `DATABASE_URL` | Yes | `file:./dev.db` (or `postgresql://...`) | Database connection string |
| `NODE_ENV` | Yes | `development` | Runtime environment |
| `APP_SECRET` | Yes | `development-secret-change-in-production` | Session cookie encryption secret |
| `GSP_ENVIRONMENT` | Yes | `SANDBOX` | `SANDBOX` or `PRODUCTION` |
| `ENABLE_LIVE_GSP` | No | `false` | Global safety toggle for live GSTN calls |
| `GEMINI_API_KEY` | No | - | Server-side Gemini Copilot assistant key |

---

## 3. Database Management & Seeding

- **Push Schema:** `npx prisma db push`
- **Prisma Studio:** `npx prisma studio` (launches database inspection UI on port 5555)
- **Reset Database:** `npx prisma migrate reset` or delete `prisma/dev.db` and rerun `npx prisma db push && npm run db:seed`.

---

## 4. Disaster Recovery & Backups

1. **Database Backups:** Daily automated snapshot of PostgreSQL cluster or SQLite database file with 30-day WAL retention.
2. **Audit Immutability:** Audit tables are append-only. Deletions or updates to `AuditLog` and `FilingAttempt` are rejected by database triggers.
3. **Graceful Degraded Mode:** If GSP or GSTN portals experience downtime (common during peak filing dates on the 11th and 20th of the month), the application automatically flags the integration circuit breaker and falls back to local return preparation, draft validation, and offline tax calculation.

