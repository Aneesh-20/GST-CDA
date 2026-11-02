// GST CDA - Legacy SQLite to Multi-Tenant Repository Migration & Reconciliation
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { TenantStore } from '../src/lib/services/tenantStore.js';

const LEGACY_DB_PATH = path.join(process.cwd(), 'data', 'gst_cda.sqlite');

export function runMigration() {
  if (!fs.existsSync(LEGACY_DB_PATH)) {
    console.log('[Migration] No legacy database found at', LEGACY_DB_PATH);
    return { status: 'NO_LEGACY_DB', migratedUsers: 0 };
  }

  const legacyDb = new DatabaseSync(LEGACY_DB_PATH, { readOnly: true });

  const legacyUsers = legacyDb.prepare('SELECT * FROM users').all();
  const legacyBusinesses = legacyDb.prepare('SELECT * FROM businesses').all();
  const legacySales = legacyDb.prepare('SELECT * FROM sales_invoices').all();
  const legacyPurchases = legacyDb.prepare('SELECT * FROM purchase_invoices').all();
  const legacyAudits = legacyDb.prepare('SELECT * FROM audit_records').all();

  console.log(`[Migration] Found ${legacyUsers.length} users, ${legacyBusinesses.length} businesses, ${legacySales.length} sales, ${legacyPurchases.length} purchases, ${legacyAudits.length} audits.`);

  let migratedCount = 0;
  let totalSalesPaiseLegacy = 0n;
  let totalSalesPaiseMigrated = 0n;
  let totalPurchasesPaiseLegacy = 0n;
  let totalPurchasesPaiseMigrated = 0n;

  for (const lUser of legacyUsers) {
    const lBiz = legacyBusinesses.find(b => b.user_email === lUser.email) || {
      legal_name: lUser.business_name || `${lUser.name} Enterprise`,
      trade_name: lUser.business_name || `${lUser.name} Enterprise`,
      gstin: '33AABCM1234F1Z5',
      pan: 'AABCM1234F',
      state_code: '33',
      state_name: 'Tamil Nadu',
      business_type: 'PROPRIETORSHIP',
      return_period: '2026-09',
      is_demo: 1
    };

    // 1. Create or get user
    let user = TenantStore.getUserByEmail(lUser.email);
    if (!user) {
      user = TenantStore.createUser({
        email: lUser.email,
        password: 'Password123!', // Standard initial password for migrated accounts
        fullName: lUser.name,
        phone: null
      });
    }

    // 2. Create organization
    const orgSlug = lUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    let org = TenantStore.getOrganizationBySlug(orgSlug);
    if (!org) {
      org = TenantStore.createOrganization({
        name: lBiz.trade_name || lBiz.legal_name,
        slug: orgSlug,
        plan: 'STANDARD'
      });
    }

    // 3. Create membership
    let membership = TenantStore.getMembership(org.id, user.id);
    if (!membership) {
      membership = TenantStore.createMembership({
        organizationId: org.id,
        userId: user.id,
        role: lUser.role || 'OWNER',
        status: 'ACTIVE'
      });
    }

    // 4. Create Legal Entity & GST Registration
    let entities = TenantStore.getLegalEntities(org.id);
    let legalEntity = entities.find(e => e.pan === lBiz.pan);
    if (!legalEntity) {
      legalEntity = TenantStore.createLegalEntity({
        organizationId: org.id,
        legalName: lBiz.legal_name,
        tradeName: lBiz.trade_name,
        pan: lBiz.pan,
        entityType: lBiz.business_type,
        isDemo: lBiz.is_demo === 1
      });
    }

    let registrations = TenantStore.getGSTRegistrations(org.id, legalEntity.id);
    let gstRegistration = registrations.find(r => r.gstin === lBiz.gstin);
    if (!gstRegistration) {
      gstRegistration = TenantStore.createGSTRegistration({
        organizationId: org.id,
        legalEntityId: legalEntity.id,
        gstin: lBiz.gstin,
        stateCode: lBiz.state_code,
        stateName: lBiz.state_name,
        registrationType: 'REGULAR'
      });
    }

    // 5. Migrate Sales Invoices
    const userSales = legacySales.filter(s => s.user_email === lUser.email);
    for (const s of userSales) {
      totalSalesPaiseLegacy += BigInt(s.total_paise);
      try {
        const created = TenantStore.createSalesInvoice({
          organizationId: org.id,
          legalEntityId: legalEntity.id,
          gstRegistrationId: gstRegistration.id,
          returnPeriodKey: lBiz.return_period || '2026-09',
          invoiceNumber: s.invoice_number,
          invoiceDate: s.date,
          partyName: s.party_name,
          partyGstin: s.party_gstin,
          placeOfSupply: s.place_of_supply,
          supplyType: s.supply_type,
          taxablePaise: BigInt(s.taxable_paise),
          ratePercent: Number(s.rate_percent),
          cgstPaise: BigInt(s.cgst_paise),
          sgstPaise: BigInt(s.sgst_paise),
          igstPaise: BigInt(s.igst_paise),
          totalPaise: BigInt(s.total_paise),
          status: s.status
        });
        totalSalesPaiseMigrated += created.totalPaise;
      } catch (err) {
        const existing = TenantStore.getSalesInvoices(org.id).items.find(i => i.invoiceNumber === s.invoice_number);
        if (existing) {
          totalSalesPaiseMigrated += existing.totalPaise;
        }
      }
    }

    // 6. Migrate Purchase Invoices
    const userPurchases = legacyPurchases.filter(p => p.user_email === lUser.email);
    for (const p of userPurchases) {
      totalPurchasesPaiseLegacy += BigInt(p.total_paise);
      try {
        const created = TenantStore.createPurchaseInvoice({
          organizationId: org.id,
          legalEntityId: legalEntity.id,
          gstRegistrationId: gstRegistration.id,
          returnPeriodKey: lBiz.return_period || '2026-09',
          invoiceNumber: p.invoice_number,
          invoiceDate: p.date,
          partyName: p.party_name,
          partyGstin: p.party_gstin,
          placeOfSupply: p.place_of_supply,
          supplyType: p.supply_type,
          taxablePaise: BigInt(p.taxable_paise),
          ratePercent: Number(p.rate_percent),
          cgstPaise: BigInt(p.cgst_paise),
          sgstPaise: BigInt(p.sgst_paise),
          igstPaise: BigInt(p.igst_paise),
          totalPaise: BigInt(p.total_paise),
          itcEligibility: p.itc_eligibility || 'ELIGIBLE',
          status: p.status
        });
        totalPurchasesPaiseMigrated += created.totalPaise;
      } catch (err) {
        const existing = TenantStore.getPurchaseInvoices(org.id).items.find(i => i.invoiceNumber === p.invoice_number);
        if (existing) {
          totalPurchasesPaiseMigrated += existing.totalPaise;
        }
      }
    }

    // 7. Migrate Audits
    const userAudits = legacyAudits.filter(a => a.user_email === lUser.email);
    for (const a of userAudits) {
      TenantStore.appendAuditEvent({
        organizationId: org.id,
        actorId: user.id,
        action: 'MIGRATED_LEGACY_AUDIT',
        entityType: a.return_type || 'GSTR-3B',
        entityId: a.id,
        correlationId: crypto.randomUUID(),
        metadata: {
          period: a.return_period,
          taxableSalesPaise: a.taxable_sales_paise,
          taxLiabilityPaise: a.tax_liability_paise,
          itcClaimedPaise: a.itc_claimed_paise,
          netPayablePaise: a.net_payable_paise,
          sha256Hash: a.sha256_hash,
          authorizedBy: a.authorized_by
        }
      });
    }

    migratedCount++;
  }

  const report = {
    status: 'COMPLETED',
    legacyUsersCount: legacyUsers.length,
    migratedOrganizationsCount: migratedCount,
    salesPaiseMatch: totalSalesPaiseLegacy === totalSalesPaiseMigrated,
    purchasesPaiseMatch: totalPurchasesPaiseLegacy === totalPurchasesPaiseMigrated,
    totalSalesPaiseLegacy: totalSalesPaiseLegacy.toString(),
    totalSalesPaiseMigrated: totalSalesPaiseMigrated.toString(),
    totalPurchasesPaiseLegacy: totalPurchasesPaiseLegacy.toString(),
    totalPurchasesPaiseMigrated: totalPurchasesPaiseMigrated.toString()
  };

  console.log('[Migration] Reconciliation Report:', report);
  return report;
}

if (process.argv[1]?.endsWith('migrate-legacy-data.js')) {
  runMigration();
}
