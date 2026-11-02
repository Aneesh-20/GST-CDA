# Project Guidelines & Autonomous Workflows: GST CDA

## Standing Git Workflow
- **Auto-Commit and Push**: After making and verifying any changes, modifications, or new features in this codebase:
  1. Verify the project builds cleanly (`./node_modules/.bin/next build`).
  2. Stage all modified and new files (`git add .`).
  3. Create a clear descriptive commit (`git commit -m "..."`).
  4. Immediately push the commit to GitHub (`git push origin aneesh`).
- **Remote Configuration & Branch Rule**: The repository remote `origin` is set to `git@github.com:Aneesh-20/GST-CDA.git`. All active development, commits, and pushes must be made on branch `aneesh` (`git push origin aneesh`). Never push or work directly on branch `main`.

## Architectural Principles
- **Financial Arithmetic Integrity**: All currency values (taxable, CGST, SGST, IGST, total liability, ITC) must be computed in integer paise using `BigInt` or minor-unit math. Zero floating-point drift is tolerated.
- **SQLite Database Persistence**: Database operations in `src/lib/db.js` must maintain multi-tenant safety by user email.
- **Truthful Compliance Status**: Adhere strictly to the real statutory rules of Indian GST (GSTR-3B, GSTR-2B, Section 16(2)(aa)).

