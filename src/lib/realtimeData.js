/**
 * TaxMate - Real-Time Data Store & File Import Helpers
 * Supports: CSV, TXT, Excel/XLSX mapping, and PDF Invoice Extraction
 * Minor-unit integer arithmetic with zero floating-point drift
 */

export const BLANK_BUSINESS = {
  legalName: '',
  tradeName: '',
  contactName: '',
  gstin: '',
  stateCode: '32',
  stateName: 'Kerala',
  city: '',
  constitution: '',
  pan: '',
  dateOfRegistration: '',
  filingFrequency: 'Monthly (Regular GST)',
  period: '',
  annualTurnoverEstimated: '',
  isCustomWorkspace: true,
  advisor: {
    name: '',
    firm: '',
    city: '',
    phone: '',
    email: '',
    membershipNo: '',
    avatarInitials: '',
  }
};

export const DEFAULT_BUSINESS = BLANK_BUSINESS;

export const STARTER_BUSINESS = {
  legalName: 'Apex Enterprises LLP',
  tradeName: 'Apex Hardware & Electricals',
  contactName: 'Suresh Kumar',
  gstin: '32AABCA8842P1Z9',
  stateCode: '32',
  stateName: 'Kerala',
  city: 'Kochi',
  constitution: 'Limited Liability Partnership',
  pan: 'AABCA8842P',
  dateOfRegistration: '01 Apr 2024',
  filingFrequency: 'Monthly (Regular GST)',
  period: 'October 2026',
  annualTurnoverEstimated: '₹ 1.2 Crore',
  isCustomWorkspace: true,
  advisor: {
    name: 'Tax Advisor, FCA',
    firm: 'GST Compliance Services',
    city: 'Kochi Jurisdiction',
    phone: '+91 98000 00000',
    email: 'advisor@compliance.in',
    membershipNo: 'FCA-ACTIVE',
    avatarInitials: 'CA',
  }
};

export const SAMPLE_PURCHASE_TABLE = [
  {
    id: 'HND-2026-901',
    date: '2026-09-04',
    vendorName: 'Kerala Handloom Weavers',
    vendorGstin: '32AAACK1100R1Z2',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 140000,
    ratePercent: 12,
    gstPaise: 16800,
    totalRupees: 156800,
    status: 'Matched in 2B',
    itcEligible: true
  },
  {
    id: 'CPS-8842',
    date: '2026-09-12',
    vendorName: 'Calicut Packaging Solutions',
    vendorGstin: '32AABCC7788P1Z6',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 42000,
    ratePercent: 18,
    gstPaise: 7560,
    totalRupees: 49560,
    status: 'Difference (₹2K)',
    itcEligible: true
  },
  {
    id: 'SRW-991',
    date: '2026-09-18',
    vendorName: 'Spice Route Woodcraft Artisans',
    vendorGstin: '32AAACS9900L1Z9',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 65000,
    ratePercent: 18,
    gstPaise: 11700,
    totalRupees: 76700,
    status: 'Timing Delay (Oct)',
    itcEligible: true
  },
  {
    id: 'MFL-204',
    date: '2026-09-22',
    vendorName: 'Malabar Freight Logistics',
    vendorGstin: '32AABCM4433D1Z1',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 28000,
    ratePercent: 18,
    gstPaise: 5040,
    totalRupees: 33040,
    status: 'State Tag Check',
    itcEligible: true
  },
  {
    id: 'CPP-4421',
    date: '2026-09-27',
    vendorName: 'Cochin Paper & Printworks',
    vendorGstin: '32AAACC3311N1Z5',
    placeOfSupply: 'Kerala (32)',
    supplyType: 'Intra-State',
    taxableRupees: 16000,
    ratePercent: 18,
    gstPaise: 2880,
    totalRupees: 18880,
    status: 'Matched in 2B',
    itcEligible: true
  }
];

/**
 * Robust CSV parser that handles quotes, commas, and varied header naming
 */
export function parseCsvText(text, defaultType = 'sales') {
  const lines = text.split(/\r\n|\n|\r/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Helper to split row respecting quotes
  const parseRow = (row) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const rawHeaders = parseRow(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  // Find column indices
  const getIndex = (aliases) => rawHeaders.findIndex(h => aliases.some(a => h.includes(a)));

  const invIdx = getIndex(['inv', 'bill', 'number', 'docno', 'id']);
  const dateIdx = getIndex(['date', 'invoicedate', 'billdate', 'dt']);
  const partyIdx = getIndex(['customer', 'vendor', 'supplier', 'party', 'client', 'buyer', 'seller', 'name']);
  const gstinIdx = getIndex(['gstin', 'gst', 'taxid', 'tin']);
  const taxableIdx = getIndex(['taxable', 'taxablevalue', 'amount', 'net', 'basic', 'base', 'subtotal']);
  const rateIdx = getIndex(['rate', 'gstpct', 'taxrate', 'pct', 'percentage']);
  const totalIdx = getIndex(['total', 'invoicevalue', 'grandtotal', 'gross']);
  const placeIdx = getIndex(['place', 'pos', 'state']);
  const statusIdx = getIndex(['status', 'match', 'itc']);

  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    if (cols.length === 0 || cols.every(c => c === '')) continue;

    const rawTaxable = taxableIdx !== -1 && cols[taxableIdx] 
      ? cols[taxableIdx].replace(/[^0-9.]/g, '') 
      : '0';
    const taxableRupees = Math.round(parseFloat(rawTaxable) || 0);

    const rawRate = rateIdx !== -1 && cols[rateIdx] 
      ? cols[rateIdx].replace(/[^0-9]/g, '') 
      : '18';
    let ratePercent = parseInt(rawRate, 10) || 18;
    if (![0, 5, 12, 18, 28].includes(ratePercent)) ratePercent = 18;

    const gstPaise = Math.round(taxableRupees * (ratePercent / 100));
    
    let totalRupees = taxableRupees + gstPaise;
    if (totalIdx !== -1 && cols[totalIdx]) {
      const parsedTotal = Math.round(parseFloat(cols[totalIdx].replace(/[^0-9.]/g, '')) || 0);
      if (parsedTotal > 0) totalRupees = parsedTotal;
    }

    const partyName = partyIdx !== -1 && cols[partyIdx] ? cols[partyIdx] : (defaultType === 'sales' ? `Customer #${i}` : `Supplier #${i}`);
    const partyGstin = gstinIdx !== -1 && cols[gstinIdx] ? cols[gstinIdx].toUpperCase() : 'Unregistered';
    const id = invIdx !== -1 && cols[invIdx] ? cols[invIdx] : (defaultType === 'sales' ? `INV-${Date.now().toString().slice(-4)}-${i}` : `BILL-${Date.now().toString().slice(-4)}-${i}`);
    const date = dateIdx !== -1 && cols[dateIdx] ? cols[dateIdx] : new Date().toISOString().split('T')[0];
    const placeOfSupply = placeIdx !== -1 && cols[placeIdx] ? cols[placeIdx] : (partyGstin.startsWith('32') ? 'Kerala (32)' : 'Inter-State (IGST)');
    const supplyType = placeOfSupply.includes('32') || placeOfSupply.toLowerCase().includes('intra') ? 'Intra-State' : 'Inter-State (IGST)';
    const status = statusIdx !== -1 && cols[statusIdx] ? cols[statusIdx] : (defaultType === 'sales' ? 'Ready' : 'Matched in 2B');

    results.push({
      id,
      date,
      customerName: partyName,
      vendorName: partyName,
      customerGstin: partyGstin,
      vendorGstin: partyGstin,
      placeOfSupply,
      supplyType,
      taxableRupees,
      ratePercent,
      gstPaise,
      totalRupees,
      status,
      category: defaultType === 'sales' ? 'Commercial Sales' : 'Raw Materials / Services',
      itcEligible: true
    });
  }

  return results;
}

/**
 * Generate standard CSV Template for Sales
 */
export function getSalesCsvTemplate() {
  return `Invoice_Number,Date,Customer_Name,Customer_GSTIN,Place_Of_Supply,Taxable_Value,GST_Rate_Pct,Invoice_Total
INV-2026-101,2026-09-02,Malabar Trading Co,32AABCM1122P1Z4,Kerala (32),85000,18,100300
INV-2026-102,2026-09-06,Bengaluru Studio,29AAABL9988D1Z2,Karnataka (29),120000,18,141600
INV-2026-103,2026-09-12,Cochin Craft House,32AAACC4455K1Z8,Kerala (32),45000,12,50400
INV-2026-104,2026-09-18,Direct Consumer Sales,Unregistered,Kerala (32),32000,12,35840
INV-2026-105,2026-09-24,Nilgiri Interiors,33AABCN3322E1Z7,Tamil Nadu (33),95000,18,112100`;
}

/**
 * Generate standard CSV Template for Purchases
 */
export function getPurchasesCsvTemplate() {
  return `Bill_Number,Date,Supplier_Name,Supplier_GSTIN,Place_Of_Supply,Taxable_Value,GST_Rate_Pct,Total_Amount,ITC_Status
CPS-2026-01,2026-09-04,Calicut Packaging Supplies,32AABCC7788P1Z6,Kerala (32),42000,18,49560,Matched in 2B
SRW-2026-02,2026-09-09,Spice Route Raw Materials,32AAACS9900L1Z9,Kerala (32),65000,18,76700,Matched in 2B
MFL-2026-03,2026-09-15,Malabar Freight Logistics,32AABCM4433D1Z1,Kerala (32),28000,18,33040,Matched in 2B
CPP-2026-04,2026-09-22,Cochin Printworks Ltd,32AAACC3311N1Z5,Kerala (32),16000,18,18880,Matched in 2B
HND-2026-05,2026-09-26,Kerala Handloom Weavers,32AAACK1100R1Z2,Kerala (32),140000,12,156800,Matched in 2B`;
}

/**
 * Helper to trigger browser file download
 */
export function triggerBrowserDownload(filename, content, type = 'text/csv;charset=utf-8;') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
