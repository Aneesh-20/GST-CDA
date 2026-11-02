/**
 * TaxMate - Smart GST Compliance Companion
 * Core Reference Data aligned with TaxMate Concept Paper
 * 
 * Fictional Business: Anaya Home & Living (Kochi, Kerala)
 * Period: September 2026
 * Integer paise math with zero calculation drift
 */

export const DEMO_BUSINESS = {
  legalName: 'Anaya Home & Living LLP',
  tradeName: 'Anaya Home & Living',
  gstin: '32AABCA8842P1Z9',
  stateCode: '32',
  stateName: 'Kerala',
  city: 'Kochi (Panampilly Nagar)',
  constitution: 'Limited Liability Partnership',
  pan: 'AABCA8842P',
  dateOfRegistration: '14 May 2023',
  filingFrequency: 'Monthly (Regular)',
  period: 'September 2026',
  annualTurnoverEstimated: '₹ 84.5 Lakhs',
  complianceHealth: {
    status: 'High Compliance',
    label: 'Records Up to Date',
    subtitle: 'Zero penalty risk • 3 purchase records to review before GSTR-3B summary',
  },
  advisor: {
    name: 'CA Priya Ramanujam, FCA',
    firm: 'Ramanujam & Associates Chartered Accountants',
    city: 'Marine Drive, Kochi',
    phone: '+91 98470 23411',
    email: 'priya.ca@ramanujamtax.in',
    membershipNo: 'FCA-218492',
    avatarInitials: 'PR',
  }
};

/**
 * PDF Section 6: Compliance Score & Status
 * "YOUR BUSINESS COMPLIANCE"
 * 🟢 GST Registration — Active
 * 🟢 GSTR-1 — Ready for review
 * 🟢 GSTR-3B — Draft ready
 * 🟡 ITC Reconciliation — 3 mismatches
 * 🔴 Next payment — Due in 4 days
 * Compliance Score: 92/100
 */
export const COMPLIANCE_SCORE = {
  score: 92,
  total: 100,
  label: 'High Compliance',
  rating: 'Excellent',
  lastUpdated: 'Updated today',
};

export const COMPLIANCE_STATUS_LIST = [
  { id: 'reg', label: 'GST Registration', status: 'Active', color: '#0E7051', dot: '🟢', bg: '#ECFDF5', border: '#A7F3D0', detail: 'State Jurisdiction: Kerala (32) • Valid' },
  { id: 'gstr1', label: 'GSTR-1', status: 'Ready for review', color: '#0E7051', dot: '🟢', bg: '#ECFDF5', border: '#A7F3D0', detail: '124 outward sales compiled • Due 11 Oct' },
  { id: 'gstr3b', label: 'GSTR-3B', status: 'Draft ready', color: '#0E7051', dot: '🟢', bg: '#ECFDF5', border: '#A7F3D0', detail: 'Net tax settlement pending purchase check' },
  { id: 'itc', label: 'ITC Reconciliation', status: '3 mismatches', color: '#B45309', dot: '🟡', bg: '#FEF7EC', border: '#F7E1B8', detail: '83 matched • 3 items need confirmation' },
  { id: 'payment', label: 'Next payment', status: 'Due in 4 days', color: '#DC2626', dot: '🔴', bg: '#FEF2F2', border: '#FECACA', detail: 'Estimated ₹ 76,760 due on 20 Oct' },
];

/**
 * PDF Section 3: The biggest differentiator: GST Copilot
 * "Your GST for this month is ready."
 * Step 1 — Sales: "Upload your sales invoices."
 * Step 2 — Purchases: "We found ₹X of purchase invoices."
 * Step 3 — ITC: "Your available input tax credit appears to be ₹X. Review exceptions."
 * Step 4 — Tax: "Estimated GST payable: ₹X."
 * Step 5 — File: "Your return is ready. Review and authorise filing."
 */
export const COPILOT_5_STEPS = [
  {
    step: 1,
    title: 'Sales',
    prompt: 'Upload your sales invoices.',
    detail: '124 sales invoices recorded (₹ 8,42,000 taxable)',
    status: 'complete',
    badge: 'Uploaded',
    color: '#0E7051',
    bg: '#ECFDF5',
    tab: 'sales'
  },
  {
    step: 2,
    title: 'Purchases',
    prompt: 'We found ₹ 4,85,000 of purchase invoices.',
    detail: '86 vendor bills matched with supplier GSTR-2B',
    status: 'complete',
    badge: 'Found',
    color: '#0E7051',
    bg: '#ECFDF5',
    tab: 'purchases'
  },
  {
    step: 3,
    title: 'ITC',
    prompt: 'Your available input tax credit appears to be ₹ 74,800. Review exceptions.',
    detail: '3 mismatches to review (Calicut Packaging discount, etc.)',
    status: 'action',
    badge: '3 Mismatches',
    color: '#B45309',
    bg: '#FEF7EC',
    tab: 'purchases',
    subTab: 'reconciliation'
  },
  {
    step: 4,
    title: 'Tax',
    prompt: 'Estimated GST payable: ₹ 76,760.',
    detail: 'Net calculation: ₹ 1,51,560 output tax minus ₹ 74,800 credit',
    status: 'ready',
    badge: 'Estimated',
    color: '#0D6258',
    bg: '#EEF8F6',
    tab: 'reports'
  },
  {
    step: 5,
    title: 'File',
    prompt: 'Your return is ready. Review and authorise filing.',
    detail: 'Cryptographic review safeguard before GSP submission',
    status: 'waiting',
    badge: 'Ready to Authorise',
    color: '#596579',
    bg: '#FAF8F5',
    tab: 'reports'
  }
];

export const SAMPLE_SALES_SUMMARY = {
  totalRecords: 124,
  taxableValueRupees: 842000,
  taxableValueFormatted: '₹ 8,42,000',
  outputGstRupees: 151560,
  outputGstFormatted: '₹ 1,51,560',
  draftCount: 3,
  intraStateCount: 96,
  interStateCount: 28,
};

export const SAMPLE_SALES_TABLE = [
  {
    id: 'INV-2026-SEP-01',
    date: '02 Sep 2026',
    customerName: 'Malabar Craft Villa',
    customerGstin: '32AABCM1122P1Z4',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 85000,
    ratePercent: 18,
    gstPaise: 15300,
    totalRupees: 100300,
    status: 'Ready',
    category: 'Handcrafted Decor',
  },
  {
    id: 'INV-2026-SEP-02',
    date: '06 Sep 2026',
    customerName: 'Cochin Living Boutique',
    customerGstin: '32AAACC4455K1Z8',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 120000,
    ratePercent: 18,
    gstPaise: 21600,
    totalRupees: 141600,
    status: 'Ready',
    category: 'Loom Cushions',
  },
  {
    id: 'INV-2026-SEP-03',
    date: '10 Sep 2026',
    customerName: 'Bengaluru Studio Homes',
    customerGstin: '29AAABL9988D1Z2',
    placeOfSupply: 'Karnataka (29)',
    supplyType: 'Inter-State (IGST)',
    taxableRupees: 240000,
    ratePercent: 18,
    gstPaise: 43200,
    totalRupees: 283200,
    status: 'Ready',
    category: 'Teak Furniture',
  },
  {
    id: 'INV-2026-SEP-04',
    date: '14 Sep 2026',
    customerName: 'Boutique Counter Sales (B2C)',
    customerGstin: 'Unregistered Consumer',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 45000,
    ratePercent: 12,
    gstPaise: 5400,
    totalRupees: 50400,
    status: 'Ready',
    category: 'Ceramic Tableware',
  },
  {
    id: 'INV-2026-SEP-05',
    date: '18 Sep 2026',
    customerName: 'Travancore Heritage Resort',
    customerGstin: '32AABCT6677F1Z1',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 175000,
    ratePercent: 18,
    gstPaise: 31500,
    totalRupees: 206500,
    status: 'Ready',
    category: 'Handloom Linen',
  },
  {
    id: 'INV-2026-SEP-06',
    date: '21 Sep 2026',
    customerName: 'Nilgiri Organic Interiors',
    customerGstin: '33AABCN3322E1Z7',
    placeOfSupply: 'Tamil Nadu (33)',
    supplyType: 'Inter-State (IGST)',
    taxableRupees: 95000,
    ratePercent: 18,
    gstPaise: 17100,
    totalRupees: 112100,
    status: 'Ready',
    category: 'Bamboo Lighting',
  },
  {
    id: 'INV-2026-SEP-07',
    date: '25 Sep 2026',
    customerName: 'Marine Drive Residences',
    customerGstin: '32AACCM8877H1Z5',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 62000,
    ratePercent: 12,
    gstPaise: 7440,
    totalRupees: 69440,
    status: 'Ready',
    category: 'Brass Sculptures',
  },
  {
    id: 'INV-2026-SEP-08',
    date: '28 Sep 2026',
    customerName: 'Wayanad Plantation Homestay',
    customerGstin: '32AAACW1234Q1Z3',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 20000,
    ratePercent: 12,
    gstPaise: 2400,
    totalRupees: 22400,
    status: 'Draft',
    category: 'Terracotta Planters',
  },
];

export const SAMPLE_PURCHASES_SUMMARY = {
  totalRecords: 86,
  taxableValueRupees: 485000,
  taxableValueFormatted: '₹ 4,85,000',
  eligibleItcRupees: 74800,
  eligibleItcFormatted: '₹ 74,800',
  differencesCount: 3,
  matchedCount: 83,
};

export const SAMPLE_PURCHASE_DIFFERENCES = [
  {
    id: 'diff-1',
    severity: 'amber',
    vendorName: 'Calicut Packaging Solutions',
    vendorGstin: '32AABCC7788P1Z6',
    invoiceNumber: 'CPS-8842',
    invoiceDate: '12 Sep 2026',
    categoryLabel: 'Value difference',
    headline: '₹ 2,000 value difference between your book and supplier filing',
    explanation: 'Your purchase bill shows ₹42,000, while Calicut Packaging filed ₹40,000 in their GSTR-1. This is usually due to a post-invoice trade discount or return credit note.',
    yourRecord: {
      taxable: '₹ 42,000',
      tax: '₹ 7,560 (18%)',
      date: '12 Sep 2026',
      invoiceNumber: 'CPS-8842',
    },
    gstPortalRecord: {
      taxable: '₹ 40,000',
      tax: '₹ 7,200 (18%)',
      date: '12 Sep 2026',
      gstr1Status: 'Filed on 11 Oct 2026',
    },
    itcImpact: '₹ 360 difference in tax credit',
    suggestedAction: 'Ask vendor for credit note or adjust your record by ₹2,000',
    status: 'Pending review',
  },
  {
    id: 'diff-2',
    severity: 'neutral',
    vendorName: 'Spice Route Woodcraft Artisans',
    vendorGstin: '32AAACS9900L1Z9',
    invoiceNumber: 'SRW-991',
    invoiceDate: '18 Sep 2026',
    categoryLabel: 'Timing difference',
    headline: 'Bill not yet reflected in September GSTR-2B',
    explanation: 'Spice Route Woodcraft generated this bill on 18 Sep, but their accountant uploaded their monthly sales after the 11th cut-off. Your credit is safe and will reflect in next month’s statement.',
    yourRecord: {
      taxable: '₹ 65,000',
      tax: '₹ 11,700 (18%)',
      date: '18 Sep 2026',
      invoiceNumber: 'SRW-991',
    },
    gstPortalRecord: {
      taxable: 'Not found in Sep GSTR-2B',
      tax: '₹ 0 in this period',
      date: 'Expected in Oct GSTR-2B',
      gstr1Status: 'Supplier delayed filing',
    },
    itcImpact: 'Credit shifts to October return',
    suggestedAction: 'Mark as reviewed; claim credit safely next month under Section 16(2)(aa)',
    status: 'Timing checked',
  },
  {
    id: 'diff-3',
    severity: 'soft-red',
    vendorName: 'Malabar Freight Logistics',
    vendorGstin: '32AABCM4433D1Z1',
    invoiceNumber: 'MFL-204',
    invoiceDate: '22 Sep 2026',
    categoryLabel: 'GSTIN location check',
    headline: 'Supply recorded as Inter-State, filed as Intra-State',
    explanation: 'You recorded this as an inter-state logistics charge (IGST), but Malabar Freight billed from their Kochi terminal (CGST + SGST). Both tax amounts match exactly.',
    yourRecord: {
      taxable: '₹ 28,000',
      tax: '₹ 5,040 (IGST)',
      date: '22 Sep 2026',
      invoiceNumber: 'MFL-204',
    },
    gstPortalRecord: {
      taxable: '₹ 28,000',
      tax: '₹ 2,520 CGST + ₹ 2,520 SGST',
      date: '22 Sep 2026',
      gstr1Status: 'Filed correctly in 2B',
    },
    itcImpact: '₹ 0 monetary difference, tax type reallocation only',
    suggestedAction: 'Update tax classification from IGST to CGST/SGST with one tap',
    status: 'Quick fix ready',
  },
];

export const SAMPLE_REPORTS_DATA = {
  period: 'September 2026',
  gstr1: {
    title: 'Report your business sales',
    technicalCode: 'GSTR-1',
    dueDate: '11 Oct 2026',
    status: 'Ready for your review',
    badge: 'Draft ready',
    totalInvoices: 124,
    taxableSalesRupees: 842000,
    outputTaxRupees: 151560,
    b2bCount: 92,
    b2cCount: 32,
    explanation: 'This outward-supply return compiles all invoices issued to customers so your buyers can claim tax credits.',
  },
  gstr3b: {
    title: 'Review your GST summary',
    technicalCode: 'GSTR-3B',
    dueDate: '20 Oct 2026',
    status: 'Awaiting purchase review',
    badge: 'In review',
    outputTaxPayableRupees: 151560,
    eligibleItcCreditRupees: 74800,
    netTaxPayableRupees: 76760,
    cashPayableRupees: 76760,
    explanation: 'Your monthly summary return: Output tax collected on sales minus eligible input tax credit already paid on purchases.',
  }
};

/**
 * PDF Page 3: The exact 7 questions the AI layer handles
 */
export const COPILOT_KNOWLEDGE = [
  {
    id: 'q1',
    question: 'Do I need to file this month?',
    badge: 'Filing Obligation',
    answer: `Yes. As an active regular GST taxpayer in Kerala, you have two monthly filing milestones for **September 2026**:
    
1. **GSTR-1 (Outward Sales)**: Due on **11 Oct 2026** — 124 invoices are already verified and ready.
2. **GSTR-3B (Summary & Settlement)**: Due on **20 Oct 2026** — Net tax payable is **₹ 76,760**.

Even in months with low or zero sales, regular GSTINs must file to keep their compliance score intact and avoid late fee penalties.`,
    action: {
      label: 'View GSTR-1 Status',
      tab: 'reports',
    }
  },
  {
    id: 'q2',
    question: 'What is my next GST deadline?',
    badge: 'Due-Date Engine',
    answer: `Your next immediate GST deadline is **11 October 2026** for submitting **GSTR-1** (Sales).
    
Your second deadline is **20 October 2026** for settling **GSTR-3B** (Payment of ₹ 76,760 net tax). Both dates are tracked automatically by our Due-Date Engine with SMS & WhatsApp reminders.`,
    action: {
      label: 'Open Compliance Calendar',
      tab: 'calendar',
    }
  },
  {
    id: 'q3',
    question: 'Why is my ITC different?',
    badge: 'Input Tax Credit',
    answer: `Your available Input Tax Credit (ITC) is **₹ 74,800**, but your raw purchase records totaled ₹ 75,160.
    
The ₹ 360 difference comes from **Calicut Packaging Solutions**: their uploaded GSTR-1 listed ₹ 40,000 (with ₹ 7,200 tax) reflecting a post-invoice ₹ 2,000 trade discount, whereas your draft bill recorded ₹ 42,000. Under GST Section 16(2)(aa), you can only claim what the supplier files in GSTR-2B.`,
    action: {
      label: 'Review Purchase Differences',
      tab: 'purchases',
      subTab: 'reconciliation',
    }
  },
  {
    id: 'q4',
    question: 'What documents do I need?',
    badge: 'Document Vault',
    answer: `To remain 100% compliant for September 2026, you need:
    
1. **Tax Invoices for Outward Sales** (All 124 are compiled in your register).
2. **Supplier Purchase Bills** with valid GSTINs (86 bills stored in your Document Vault).
3. **E-Way Bills** for inter-state consignments over ₹ 50,000.
4. **Bank Statement / Challan** proving tax payment after GSTR-3B submission.

All of these are safely stored in your immutable Document Vault with SHA-256 integrity.`,
    action: {
      label: 'Open Document Vault',
      tab: 'vault',
    }
  },
  {
    id: 'q5',
    question: 'Why do I have this mismatch?',
    badge: 'Reconciliation',
    answer: `A mismatch **does not mean you or your supplier made a mistake**!
    
In GST, mismatches typically fall into three natural categories:
1. **Trade Discounts**: Suppliers file the post-discount figure in GSTR-1.
2. **Timing Cut-offs**: A supplier uploaded after the 11th cut-off; the credit shifts to next month under Section 16(2)(aa).
3. **Tax Head Misclassification**: Billed as CGST/SGST by a local terminal instead of IGST.

None of these cause penalties if reviewed before GSTR-3B authorisation.`,
    action: {
      label: 'Inspect 3 Mismatches',
      tab: 'purchases',
      subTab: 'reconciliation',
    }
  },
  {
    id: 'q6',
    question: 'How much tax do I approximately owe?',
    badge: 'Tax Computation',
    answer: `For **September 2026**, your estimated net GST payable is **₹ 76,760**.
    
Here is the exact integer calculation:
- **Output GST collected on sales**: ₹ 1,51,560 (from 124 invoices)
- **Minus Eligible Input Tax Credit (ITC)**: - ₹ 74,800 (from 83 verified purchases)
- **Net Cash to Pay**: **₹ 76,760**

Zero floating-point calculation drift.`,
    action: {
      label: 'View Detailed GSTR-3B Draft',
      tab: 'reports',
    }
  },
  {
    id: 'q7',
    question: 'My return is ready—what should I do next?',
    badge: 'Ready to File',
    answer: `Congratulations! Since your sales are complete and your tax is computed:
    
1. **Quick Check**: Spend 60 seconds confirming the 3 purchase differences.
2. **CA Sign-off (Optional)**: Request a quick verification from CA Priya Ramanujam via the portal.
3. **Authorise Filing**: Review your GSTR-3B draft and trigger authorized GSP filing with your OTP credentials.

You will receive an instant acknowledgement ARN and an automated challan in your Document Vault.`,
    action: {
      label: 'Authorise September Filing',
      tab: 'reports',
    }
  }
];

export const TIMELINE_SAMPLE_ITEMS = [
  {
    date: '11 Oct 2026',
    tag: 'Due-Date Engine',
    title: 'GSTR-1: Report Business Sales',
    description: 'Compile September outward invoices so buyers can claim input tax credit.',
    status: 'Ready',
    completed: true,
  },
  {
    date: '14 Oct 2026',
    tag: 'GSTR-2B Statement',
    title: 'Government GSTR-2B Statement Available',
    description: 'Auto-generated statement reflecting what suppliers uploaded to GSTN.',
    status: 'Available',
    completed: true,
  },
  {
    date: '20 Oct 2026',
    tag: 'Due-Date Engine',
    title: 'GSTR-3B: Review & Settle GST Summary',
    description: 'Final authorization of net tax liability (₹ 76,760) for September.',
    status: 'Due in 4 days',
    completed: false,
  },
];

export const DOCUMENTS_VAULT_FILES = [
  {
    id: 'doc-1',
    name: 'GST_Registration_Certificate_REG06.pdf',
    type: 'Statutory Certificate',
    size: '1.2 MB',
    date: '14 May 2023',
    status: 'Verified',
    tag: 'Official',
  },
  {
    id: 'doc-2',
    name: 'September_2026_Sales_Register.xlsx',
    type: 'Outward Invoices',
    size: '348 KB',
    date: '30 Sep 2026',
    status: 'Compiled (124 records)',
    tag: 'Sales',
  },
  {
    id: 'doc-3',
    name: 'Supplier_Purchase_Invoices_Archive.zip',
    type: 'Tax Invoices',
    size: '14.8 MB',
    date: '28 Sep 2026',
    status: 'Archived (86 bills)',
    tag: 'Purchases',
  },
  {
    id: 'doc-4',
    name: 'Draft_GSTR3B_September_2026.pdf',
    type: 'Tax Computation',
    size: '620 KB',
    date: '02 Oct 2026',
    status: 'Draft in review',
    tag: 'Reports',
  },
];

/**
 * PDF Section 5: Startup Express
 * "START MY BUSINESS"
 * "What are you starting?"
 * - Proprietorship
 * - Partnership / LLP
 * - Private Limited
 * - Other applicable structure
 * "PAN → Business registration → MCA-related workflow where applicable → GST registration → Bank/accounting setup → Invoicing → GST compliance"
 * Tagline: "From starting your business to filing your GST — one digital platform."
 */
export const STARTUP_EXPRESS_DATA = {
  title: 'Startup Express',
  ctaText: 'START MY BUSINESS',
  tagline: 'From starting your business to filing your GST — one digital platform.',
  question: 'What are you starting?',
  structures: [
    {
      id: 'proprietorship',
      title: 'Proprietorship',
      desc: 'Single owner, minimal formalities, immediate operations',
      leadTime: '2-3 Days',
      mcaRequired: false,
    },
    {
      id: 'llp',
      title: 'Partnership / LLP',
      desc: 'Shared liability, MCA incorporation, ideal for professional firms',
      leadTime: '5-7 Days',
      mcaRequired: true,
      selected: true,
    },
    {
      id: 'pvt_ltd',
      title: 'Private Limited',
      desc: 'Separate legal entity, equity funding ready, MCA registrar',
      leadTime: '7-10 Days',
      mcaRequired: true,
    },
    {
      id: 'other',
      title: 'Other applicable structure',
      desc: 'One Person Company (OPC), Trust, Section 8, or HUF',
      leadTime: 'Varies',
      mcaRequired: true,
    }
  ],
  workflow: [
    { step: 1, label: 'PAN', desc: 'Entity / Proprietor PAN generation', done: true },
    { step: 2, label: 'Business registration', desc: 'Shop & Establishment / Trade license', done: true },
    { step: 3, label: 'MCA-related workflow', desc: 'Name approval & digital signatures', done: true },
    { step: 4, label: 'GST registration', desc: 'Form GST REG-01 filing & GSTIN grant', done: true },
    { step: 5, label: 'Bank/accounting setup', desc: 'Current account & accounting sync', done: true },
    { step: 6, label: 'Invoicing', desc: 'GST-compliant invoice templates', done: true },
    { step: 7, label: 'GST compliance', desc: 'Monthly GSTR-1, GSTR-3B & 2B matching', done: false, active: true },
  ]
};

/**
 * PDF Section 7: Pricing Strategy
 */
export const PRICING_STRATEGY_DATA = [
  {
    id: 'free',
    tier: 'FREE',
    price: '₹ 0',
    frequency: 'forever',
    headline: 'Essential compliance tracking for small ventures',
    features: [
      'GST reminders via SMS & email',
      'Basic compliance calendar',
      'Basic dashboard & GSTIN lookup',
      'HSN/SAC rate search tool'
    ],
    cta: 'Current Starter Tier',
    highlight: false,
  },
  {
    id: 'filing',
    tier: 'Per Filing',
    price: '₹ 199',
    frequency: 'per return',
    headline: 'Pay as you file without monthly lock-in',
    features: [
      'Automated return preparation',
      'GSP filing via government APIs',
      'Invoice upload (Excel / CSV)',
      'Basic reconciliation (GSTR-2B)'
    ],
    cta: 'Choose Per Filing',
    highlight: false,
  },
  {
    id: 'month',
    tier: 'Monthly Pro',
    price: '₹ 499',
    frequency: 'per month',
    headline: 'Full digital automation for active MSMEs',
    features: [
      'GST + purchase reconciliation',
      'Multiple GST registrations (GSTINs)',
      'Automated WhatsApp & voice reminders',
      'Reports & audit-ready exports',
      'AI GST assistant (unlimited questions)'
    ],
    cta: 'Active on Your Workspace',
    highlight: true,
  },
  {
    id: 'enterprise',
    tier: 'Business / Enterprise',
    price: 'Custom',
    frequency: 'for multi-entity',
    headline: 'For high-volume traders, CAs & multiple entities',
    features: [
      'Multiple business entities',
      'Direct ERP / API integration',
      'Accountant / CA collaborative access',
      'Advanced 3-way reconciliation',
      'Multi-user role based access'
    ],
    cta: 'Contact Advisory Team',
    highlight: false,
  }
];

/**
 * PDF Section 8: Referral Engine
 * "Filed successfully 🎉 Refer another business and receive ₹X credit on your next filing."
 * "Welcome benefit: ₹X off your first GST filing."
 * Growth loop: GST Filing → Referral → New Business → GST Registration → Monthly Filing → Referral
 */
export const REFERRAL_ENGINE_DATA = {
  postFilingHeadline: 'Filed successfully 🎉',
  referrerReward: 'Refer another business and receive ₹ 500 credit on your next filing.',
  refereeReward: 'Welcome benefit: ₹ 500 off your first GST filing.',
  growthLoop: [
    'GST Filing',
    'Referral',
    'New Business',
    'GST Registration',
    'Monthly Filing',
    'Referral'
  ],
  referralCode: 'ANAYA500',
  totalEarnedRupees: 1500,
  successfulReferralsCount: 3,
};

/**
 * PDF Section 9: Kiosk Model
 * "Assisted GST services at physical locations (especially for smaller towns and MSME markets)"
 * Services:
 * - GST Registration
 * - GST Return Filing
 * - PAN Services
 * - Business Registration Assistance
 * - Invoice Services
 * - Compliance Check
 * Tagline: "Digital-first + assisted commerce. This can be especially powerful in Kerala and subsequently across India."
 */
export const KIOSK_SERVICES_DATA = [
  { id: 'k1', title: 'GST Registration', desc: 'Guided on-spot application with instant acknowledgement', icon: 'UserPlus' },
  { id: 'k2', title: 'GST Return Filing', desc: 'Assisted GSTR-1 & GSTR-3B submission with operator support', icon: 'FileText' },
  { id: 'k3', title: 'PAN Services', desc: 'Instant PAN application, verification & corrections', icon: 'ShieldCheck' },
  { id: 'k4', title: 'Business Registration Assistance', desc: 'MSME Udyam, Partnership, and trade licenses', icon: 'Building2' },
  { id: 'k5', title: 'Invoice Services', desc: 'Convert physical paper bills into digital GST invoices', icon: 'Receipt' },
  { id: 'k6', title: 'Compliance Check', desc: 'Instant health scan & penalty risk audit report', icon: 'CheckCircle2' },
];

/**
 * PDF Section 1: Experience Channels (Assisted Modes)
 * Note: Web and Mobile layouts adapt automatically via responsive design.
 */
export const EXPERIENCE_CHANNELS = [
  { id: 'kiosk', name: 'Assisted Kiosk', icon: '🏢', desc: 'Physical touchpoint for small towns' },
  { id: 'voice_wa', name: 'Voice / WhatsApp', icon: '📞', desc: 'Conversational compliance updates' },
  { id: 'ca_desk', name: 'CA Dashboard', icon: '👨‍💼', desc: 'Professional review & audit console' },
];

/**
 * PDF Section 11: Long-term opportunity (Phase 2) - MSME Compliance OS
 */
export const MSME_OS_ROADMAP = [
  'GST',
  'PAN / Business Registration',
  'Invoices',
  'Accounting',
  'Banking',
  'Payroll',
  'TDS',
  'Income Tax',
  'MCA Compliance',
  'Credit Score / Business Intelligence',
  'Loans / Working Capital',
  'Insurance',
  'Exports'
];

/**
 * Super Premium Differentiation: TaxMate vs. ClearTax vs. Traditional CA
 */
export const CLEAR_TAX_COMPARISON_MATRIX = [
  {
    feature: 'Core Philosophy',
    taxMate: 'Plain Language 5-Step Model for MSMEs',
    gstCda: 'Plain Language 5-Step Model for MSMEs',
    clearTax: 'Corporate ERP jargon (SAP/Oracle focus)',
    traditionalCa: 'Manual paper-based compliance',
    highlight: true,
  },
  {
    feature: 'Pricing Model',
    taxMate: '₹0 Starter / ₹199 per filing (Transparent)',
    gstCda: '₹0 Starter / ₹199 per filing (Transparent)',
    clearTax: 'Hidden behind sales quote (₹40,000+ lock-in)',
    traditionalCa: '₹1,500 – ₹5,000 monthly retainer',
    highlight: true,
  },
  {
    feature: 'Data Sovereignty & Lock-in',
    taxMate: 'Zero Lock-in. 100% Free JSON/Excel/PDF forever',
    gstCda: 'Zero Lock-in. 100% Free JSON/Excel/PDF forever',
    clearTax: 'Historical data restricted if subscription lapses',
    traditionalCa: 'Stored in CA personal files/tally',
    highlight: true,
  },
  {
    feature: 'Calculation Precision',
    taxMate: 'Integer paise minor-unit math (0 drift)',
    gstCda: 'Integer paise minor-unit math (0 drift)',
    clearTax: 'Standard floating-point calculations',
    traditionalCa: 'Manual spreadsheets & rounded figures',
    highlight: false,
  },
  {
    feature: 'Notice & Scrutiny Defense',
    taxMate: 'Built-in Rule 88C & 88D Scrutiny Radar (Included)',
    gstCda: 'Built-in Rule 88C & 88D Scrutiny Radar (Included)',
    clearTax: 'Expensive enterprise add-on module',
    traditionalCa: 'Charges extra ₹5k–₹25k per notice reply',
    highlight: true,
  },
  {
    feature: 'Vendor ITC Recovery',
    taxMate: '1-Click WhatsApp Nudge with pre-composed draft',
    gstCda: '1-Click WhatsApp Nudge with pre-composed draft',
    clearTax: 'Enterprise ERP-only email automation',
    traditionalCa: 'Manual phone calls by business owner',
    highlight: true,
  },
  {
    feature: 'Multi-Channel Access',
    taxMate: 'Web Portal, Mobile App, Assisted Kiosk & WhatsApp',
    gstCda: 'Web Portal, Mobile App, Assisted Kiosk & WhatsApp',
    clearTax: 'Desktop web-only portal',
    traditionalCa: 'In-person visits & phone calls',
    highlight: false,
  },
];

/**
 * Super Premium: GST Scrutiny & Notice Risk Radar Metrics
 */
export const SCRUTINY_DEFENSE_RADAR = {
  overallScore: 100,
  riskLevel: 'Zero Risk (Optimal)',
  riskColor: '#0E7051',
  rule88C: {
    title: 'Rule 88C Check (GSTR-1 vs GSTR-3B Turnover)',
    status: 'Passed (0.00% Variance)',
    detail: 'Outward tax reported matches tax paid in summary return. No DRC-01B notice exposure.',
    badge: 'Compliant',
  },
  rule88D: {
    title: 'Rule 88D Check (GSTR-2B vs GSTR-3B ITC Claimed)',
    status: 'Passed (100% Reconciled)',
    detail: 'ITC claimed does not exceed GSTR-2B eligible credit. No DRC-01C notice exposure.',
    badge: 'Protected',
  },
  sec16_2_aa: {
    title: 'Section 16(2)(aa) Statutory Matching',
    status: 'Passed (Supplier Uploads Verified)',
    detail: 'All claimed credits correspond to invoices uploaded by registered suppliers.',
    badge: 'Statutory Shield',
  },
  sec16_4: {
    title: 'Section 16(4) Limitation Check',
    status: 'Passed (Within 30th Nov Deadline)',
    detail: 'No time-barred purchase credits in current filing period.',
    badge: 'On-Time',
  },
};

