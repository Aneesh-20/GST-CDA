// TaxMate - Demo Mode Data Store
// Fictional Tamil Nadu business: Murugan Electricals & Hardware
// Rule: All amounts in integer paise (1 INR = 100 paise)

export interface DemoInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  partyName: string;
  partyGstin?: string;
  placeOfSupply: string; // state code e.g. "33"
  supplyType: 'INTRA' | 'INTER';
  taxablePaise: bigint;
  ratePercent: number;
  cgstPaise: bigint;
  sgstPaise: bigint;
  igstPaise: bigint;
  totalPaise: bigint;
  status: 'DRAFT' | 'CONFIRMED';
  itcEligibility?: 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING_REVIEW';
}

export interface DemoReconciliationItem {
  id: string;
  supplierName: string;
  supplierGstin: string;
  invoiceNumber: string;
  invoiceDate: string;
  booksTaxablePaise?: bigint;
  booksTaxPaise?: bigint;
  portalTaxablePaise?: bigint;
  portalTaxPaise?: bigint;
  matchCategory: 'EXACT_MATCH' | 'LOCAL_ONLY' | 'PORTAL_ONLY' | 'AMOUNT_MISMATCH';
  suggestedAction: string;
}

export const DEMO_BUSINESS = {
  legalName: 'Murugan Electricals & Hardware',
  tradeName: 'Murugan Traders',
  gstin: '33AAAAA0000A1Z5',
  pan: 'AAAAA0000A',
  stateCode: '33',
  stateName: 'Tamil Nadu',
  businessType: 'Sole Proprietorship',
  returnPeriod: 'October 2026',
  isDemo: true,
};

export const INITIAL_SALES_INVOICES: DemoInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-081',
    date: '2026-10-04',
    partyName: 'Chennai Construction Corp',
    partyGstin: '33AABCC1234F1Z1',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 4500000n, // ₹45,000.00
    ratePercent: 18,
    cgstPaise: 405000n,    // ₹4,050.00
    sgstPaise: 405000n,    // ₹4,050.00
    igstPaise: 0n,
    totalPaise: 5310000n,  // ₹53,100.00
    status: 'CONFIRMED',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-082',
    date: '2026-10-09',
    partyName: 'Bengaluru Lightworks Ltd',
    partyGstin: '29AAACL5678K1Z3',
    placeOfSupply: '29', // Karnataka (Inter-State)
    supplyType: 'INTER',
    taxablePaise: 8200000n, // ₹82,000.00
    ratePercent: 18,
    cgstPaise: 0n,
    sgstPaise: 0n,
    igstPaise: 1476000n,   // ₹14,760.00
    totalPaise: 9676000n,  // ₹96,760.00
    status: 'CONFIRMED',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-083',
    date: '2026-10-14',
    partyName: 'Counter Cash Sale (Walk-in Customer)',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 1250000n, // ₹12,500.00
    ratePercent: 18,
    cgstPaise: 112500n,    // ₹1,125.00
    sgstPaise: 112500n,    // ₹1,125.00
    igstPaise: 0n,
    totalPaise: 1475000n,  // ₹14,750.00
    status: 'CONFIRMED',
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-084',
    date: '2026-10-18',
    partyName: 'Salem Motors Pvt Ltd',
    partyGstin: '33AABCS9876D1Z8',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 3500000n, // ₹35,000.00
    ratePercent: 12,
    cgstPaise: 210000n,    // ₹2,100.00
    sgstPaise: 210000n,    // ₹2,100.00
    igstPaise: 0n,
    totalPaise: 3920000n,  // ₹39,200.00
    status: 'CONFIRMED',
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-2026-085',
    date: '2026-10-22',
    partyName: 'Kovai Engineering Works',
    partyGstin: '33AABCK3344P1Z2',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 2800000n, // ₹28,000.00
    ratePercent: 18,
    cgstPaise: 252000n,    // ₹2,520.00
    sgstPaise: 252000n,    // ₹2,520.00
    igstPaise: 0n,
    totalPaise: 3304000n,  // ₹33,040.00
    status: 'DRAFT',
  },
];

export const INITIAL_PURCHASE_INVOICES: DemoInvoice[] = [
  {
    id: 'pur-201',
    invoiceNumber: 'HVL-2026-992',
    date: '2026-10-02',
    partyName: 'Havells India Limited',
    partyGstin: '07AAACH0001K1ZV',
    placeOfSupply: '33',
    supplyType: 'INTER',
    taxablePaise: 6500000n, // ₹65,000.00
    ratePercent: 18,
    cgstPaise: 0n,
    sgstPaise: 0n,
    igstPaise: 1170000n,   // ₹11,700.00
    totalPaise: 7670000n,  // ₹76,700.00
    status: 'CONFIRMED',
    itcEligibility: 'ELIGIBLE',
  },
  {
    id: 'pur-202',
    invoiceNumber: 'POL-OCT-112',
    date: '2026-10-08',
    partyName: 'Polycab Wires & Cables Ltd',
    partyGstin: '33AAACP4411M1ZQ',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 4000000n, // ₹40,000.00
    ratePercent: 18,
    cgstPaise: 360000n,    // ₹3,600.00
    sgstPaise: 360000n,    // ₹3,600.00
    igstPaise: 0n,
    totalPaise: 4720000n,  // ₹47,200.00
    status: 'CONFIRMED',
    itcEligibility: 'ELIGIBLE',
  },
  {
    id: 'pur-203',
    invoiceNumber: 'SWT-2026-044',
    date: '2026-10-15',
    partyName: 'Anchor Electrical Switchgears',
    partyGstin: '33AAACA9812J1ZR',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 1800000n, // ₹18,000.00
    ratePercent: 18,
    cgstPaise: 162000n,    // ₹1,620.00
    sgstPaise: 162000n,    // ₹1,620.00
    igstPaise: 0n,
    totalPaise: 2124000n,  // ₹21,240.00
    status: 'CONFIRMED',
    itcEligibility: 'ELIGIBLE',
  },
  {
    id: 'pur-204',
    invoiceNumber: 'OFF-OCT-01',
    date: '2026-10-19',
    partyName: 'Office Tea & Snacks Supply',
    placeOfSupply: '33',
    supplyType: 'INTRA',
    taxablePaise: 250000n,  // ₹2,500.00
    ratePercent: 5,
    cgstPaise: 6250n,      // ₹62.50
    sgstPaise: 6250n,      // ₹62.50
    igstPaise: 0n,
    totalPaise: 262500n,   // ₹2,625.00
    status: 'CONFIRMED',
    itcEligibility: 'INELIGIBLE', // Blocked under Sec 17(5)
  },
];

export const DEMO_RECONCILIATION_DATA: DemoReconciliationItem[] = [
  {
    id: 'rec-1',
    supplierName: 'Havells India Limited',
    supplierGstin: '07AAACH0001K1ZV',
    invoiceNumber: 'HVL-2026-992',
    invoiceDate: '2026-10-02',
    booksTaxablePaise: 6500000n,
    booksTaxPaise: 1170000n,
    portalTaxablePaise: 6500000n,
    portalTaxPaise: 1170000n,
    matchCategory: 'EXACT_MATCH',
    suggestedAction: 'Match Confirmed. Eligible for full ITC in GSTR-3B.',
  },
  {
    id: 'rec-2',
    supplierName: 'Polycab Wires & Cables Ltd',
    supplierGstin: '33AAACP4411M1ZQ',
    invoiceNumber: 'POL-OCT-112',
    invoiceDate: '2026-10-08',
    booksTaxablePaise: 4000000n,
    booksTaxPaise: 720000n,
    portalTaxablePaise: 3800000n, // Portal has ₹38,000 taxable
    portalTaxPaise: 684000n,
    matchCategory: 'AMOUNT_MISMATCH',
    suggestedAction: 'Discrepancy: ₹360 difference in tax. Contact supplier to verify bill.',
  },
  {
    id: 'rec-3',
    supplierName: 'Anchor Electrical Switchgears',
    supplierGstin: '33AAACA9812J1ZR',
    invoiceNumber: 'SWT-2026-044',
    invoiceDate: '2026-10-15',
    booksTaxablePaise: 1800000n,
    booksTaxPaise: 324000n,
    portalTaxablePaise: undefined,
    portalTaxPaise: undefined,
    matchCategory: 'LOCAL_ONLY',
    suggestedAction: 'Supplier has not filed GSTR-1 yet. Send reminder to claim ITC.',
  },
  {
    id: 'rec-4',
    supplierName: 'Finolex Cables Limited',
    supplierGstin: '27AAACF1234D1ZP',
    invoiceNumber: 'FIN-2026-554',
    invoiceDate: '2026-10-21',
    booksTaxablePaise: undefined,
    booksTaxPaise: undefined,
    portalTaxablePaise: 2500000n,
    portalTaxPaise: 450000n,
    matchCategory: 'PORTAL_ONLY',
    suggestedAction: 'Invoice exists on GST portal but is missing in your purchase books. Add to books?',
  },
];

export const DEMO_COMPLIANCE_CALENDAR = [
  {
    id: 'cal-1',
    title: 'GSTR-1 (Outward Supplies Sales Report)',
    period: 'October 2026',
    dueDate: '2026-11-11',
    status: 'UPCOMING',
    type: 'SALES_REPORT',
    explanation: 'Report all your sales invoices issued during October 2026.',
    penaltyNote: 'Late fee: ₹50/day (₹20/day for Nil return) if filed after Nov 11.',
  },
  {
    id: 'cal-2',
    title: 'GSTR-2B Statement Generation',
    period: 'October 2026',
    dueDate: '2026-11-14',
    status: 'UPCOMING',
    type: 'ITC_STATEMENT',
    explanation: 'GST portal automatically compiles eligible input tax credit from your suppliers.',
    penaltyNote: 'Static statement; review before filing GSTR-3B.',
  },
  {
    id: 'cal-3',
    title: 'GSTR-3B (Monthly Summary & Tax Payment)',
    period: 'October 2026',
    dueDate: '2026-11-20',
    status: 'PENDING_REVIEW',
    type: 'TAX_PAYMENT',
    explanation: 'Offset sales liability against eligible purchase ITC and pay the balance net tax.',
    penaltyNote: 'Statutory late fee + 18% annual interest on delayed cash tax.',
  },
];

export const DEMO_DOCUMENTS = [
  { id: 'doc-1', name: 'GST_Registration_Certificate_REG06.pdf', category: 'REGISTRATION', size: '1.2 MB', uploadedAt: '2026-08-15', verified: true },
  { id: 'doc-2', name: 'Shop_Commercial_Rental_Agreement.pdf', category: 'BUSINESS_PROOF', size: '3.4 MB', uploadedAt: '2026-08-15', verified: true },
  { id: 'doc-3', name: 'Electricity_Bill_Store_Premises.pdf', category: 'ADDRESS_PROOF', size: '820 KB', uploadedAt: '2026-09-02', verified: true },
  { id: 'doc-4', name: 'Purchase_Batch_Havells_Oct2026.pdf', category: 'INVOICES', size: '2.1 MB', uploadedAt: '2026-10-03', verified: false },
];

