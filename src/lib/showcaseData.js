/**
 * GST CDA - Super-Premium Frontend Showcase Mock Data
 * Fictional Business: Anaya Home & Living (Kochi, Kerala)
 * Period: September 2026 (Demo)
 * All values are strictly marked as Sample / Demo
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
  period: 'September 2026 (Demo)',
  annualTurnoverEstimated: '₹ 84.5 Lakhs (Sample)',
  complianceHealth: {
    status: 'Quietly Compliant',
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
  period: 'September 2026 (Demo)',
  gstr1: {
    title: 'Report your business sales',
    technicalCode: 'GSTR-1',
    dueDate: '11 Oct 2026 (Sample)',
    status: 'Ready for your review',
    badge: 'Draft ready',
    totalInvoices: 124,
    taxableSalesRupees: 842000,
    outputTaxRupees: 151560,
    b2bCount: 92,
    b2cCount: 32,
    explanation: 'This report compiles all invoices issued to customers so your buyers can claim tax credits.',
  },
  gstr3b: {
    title: 'Review your GST summary',
    technicalCode: 'GSTR-3B',
    dueDate: '20 Oct 2026 (Sample)',
    status: 'Awaiting purchase review',
    badge: 'In review',
    outputTaxPayableRupees: 151560,
    eligibleItcCreditRupees: 74800,
    netTaxPayableRupees: 76760,
    cashPayableRupees: 76760,
    explanation: 'Your monthly net calculation: Output tax collected on sales minus tax already paid on purchases.',
  }
};

export const COPILOT_KNOWLEDGE = [
  {
    id: 'next-steps',
    question: 'What should I do this month?',
    badge: 'Recommended',
    answer: `Good evening! Here is your quick roadmap for **September 2026** for **Anaya Home & Living**:

1. **Your Sales are Complete**: All 124 sales records (₹ 8.42 Lakhs) are organised and ready.
2. **Review 3 Purchase Differences**: You have 3 purchase bills that need a 60-second review (e.g. a ₹2,000 supplier discount from Calicut Packaging).
3. **Review GSTR-3B Summary**: After checking those 3 items, your net tax estimate is **₹ 76,760** (Sample).

Would you like to review the 3 purchase differences right now?`,
    action: {
      label: 'Open Purchase Reconciliation',
      tab: 'purchases',
      subTab: 'reconciliation',
    }
  },
  {
    id: 'what-is-3b',
    question: 'What is GSTR-3B?',
    badge: 'GST Basics',
    answer: `Think of **GSTR-3B** as your **Monthly Tax Summary & Settlement**.

Instead of listing every individual customer, GSTR-3B has just two main numbers:
- **Tax you collected on sales** (Output Tax): ₹ 1,51,560
- **Minus Tax you paid to suppliers** (Input Tax Credit): ₹ 74,800
- **Net to Pay**: ₹ 76,760 *(Sample calculation)*

Keeping your purchase bills matched is what allows you to legally claim the ₹ 74,800 discount on your tax bill!`,
    action: {
      label: 'View September GSTR-3B Summary',
      tab: 'reports',
    }
  },
  {
    id: 'why-differences',
    question: 'Why do I have differences?',
    badge: 'Peace of mind',
    answer: `A difference **does not mean something is wrong or that you did an error**.

In Indian GST, differences usually happen for 3 very normal business reasons:
1. **Timing difference**: You recorded the purchase bill in September, but your supplier filed their return on the 13th of October.
2. **Trade discount**: The supplier gave you a post-billing cash discount not reflected on the original PDF.
3. **State classification**: A local Kochi shipment was mistakenly tagged as Inter-State (IGST) instead of Intra-State (CGST/SGST).

None of these cause penalties if reviewed before authorizing your summary return.`,
    action: {
      label: 'Inspect 3 Differences',
      tab: 'purchases',
      subTab: 'reconciliation',
    }
  },
  {
    id: 'how-to-add-sales',
    question: 'How do I add sales?',
    badge: 'Guide',
    answer: `Adding sales in GST CDA takes less than 30 seconds:

- **Method 1 (Fastest)**: Upload an Excel or CSV file from your billing system.
- **Method 2 (AI Scanner)**: Drag and drop your invoice PDF — we read the amounts automatically.
- **Method 3**: Click **“Add a sale”** to fill in customer name, amount, and GST rate.

We instantly compute the correct CGST, SGST, or IGST with zero math mistakes!`,
    action: {
      label: 'Open Sales Desk',
      tab: 'sales',
    }
  }
];

export const TIMELINE_SAMPLE_ITEMS = [
  {
    date: '11 Oct 2026',
    tag: 'Sample Timeline',
    title: 'Report Business Sales (GSTR-1)',
    description: 'Compile September outward invoices so buyers can see tax credits.',
    status: 'Ready',
    completed: true,
  },
  {
    date: '14 Oct 2026',
    tag: 'Sample Timeline',
    title: 'Government GSTR-2B Statement Available',
    description: 'Auto-generated statement reflecting what suppliers uploaded.',
    status: 'Available',
    completed: true,
  },
  {
    date: '20 Oct 2026',
    tag: 'Sample Timeline',
    title: 'Review & Settle GST Summary (GSTR-3B)',
    description: 'Final authorization of net tax liability for September.',
    status: 'Pending your review',
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
    status: 'Verified (Demo)',
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
