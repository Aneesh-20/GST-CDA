// TaxMate - Domain Types & Core Interfaces

export type BusinessType = 
  | 'PROPRIETORSHIP'
  | 'PARTNERSHIP'
  | 'LLP'
  | 'PVT_LTD'
  | 'OTHER';

export type UserRole = 
  | 'OWNER'
  | 'CA'
  | 'KIOSK_OPERATOR'
  | 'ADMIN'
  | 'VIEWER';

export type InvoiceType = 
  | 'B2B'    // Business to Business (with GSTIN)
  | 'B2CL'   // Business to Consumer Large (> 2.5 Lakhs inter-state)
  | 'B2CS'   // Business to Consumer Small
  | 'EXP'    // Export of goods or services
  | 'CDNR';  // Credit / Debit Note Registered

export type SupplyType = 'INTRA' | 'INTER';

export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELLED';

export type ITCEligibility = 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING_REVIEW';

export type ReturnType = 'GSTR1' | 'GSTR3B' | 'GSTR2B' | 'GSTR4' | 'GSTR9';

export type ReturnDraftStatus = 
  | 'LOCAL_DRAFT'
  | 'VALIDATION_ISSUES'
  | 'READY_FOR_REVIEW'
  | 'AWAITING_AUTHORISATION'
  | 'FILING_REQUESTED'
  | 'FILED'
  | 'FAILED';

export type ReconciliationMatchCategory = 
  | 'EXACT_MATCH'
  | 'LOCAL_ONLY'
  | 'PORTAL_ONLY'
  | 'AMOUNT_MISMATCH'
  | 'DATE_MISMATCH'
  | 'GSTIN_MISMATCH'
  | 'NEEDS_REVIEW';

export type ReconciliationAction = 
  | 'ACCEPT'
  | 'CONTACT_SUPPLIER'
  | 'ADD_TO_BOOKS'
  | 'DISMISS';

export interface CurrencyPaise {
  amountPaise: bigint;
}

export interface TaxLineItem {
  ratePercent: number; // e.g. 18.0
  taxablePaise: bigint;
  cgstPaise: bigint;
  sgstPaise: bigint;
  igstPaise: bigint;
}

export interface CalculationTrace {
  supplierStateCode: string;
  placeOfSupplyStateCode: string;
  supplyType: SupplyType;
  rateAppliedPercent: number;
  taxableAmountPaise: bigint;
  cgstPaise: bigint;
  sgstPaise: bigint;
  igstPaise: bigint;
  totalPaise: bigint;
  ruleVersion: string;
  timestamp: string;
}

export interface ReturnSummaryItem {
  label: string;
  statutoryCategory: string; // e.g. "Table 4(A)(5)" or "Table 3.1(a)"
  plainLanguageMeaning: string;
  taxablePaise: bigint;
  cgstPaise: bigint;
  sgstPaise: bigint;
  igstPaise: bigint;
  totalTaxPaise: bigint;
  status: 'CALCULATED' | 'ESTIMATED' | 'USER_ENTERED' | 'VERIFIED_PORTAL';
}
