// TaxMate - Grounded Copilot Engine

const KNOWLEDGE_BASE = [
  {
    keywords: ['itc', 'input tax credit', 'what is itc', 'purchase credit'],
    answer: 'Input Tax Credit (ITC) means claiming back the GST you paid when purchasing goods or services for your business. For example, if you paid ₹1,800 GST on electrical stock and collect ₹2,500 GST on sales, you pay only the difference (₹700) to the government. Note: You can only claim ITC if your supplier has uploaded the invoice to GSTN and it reflects in your GSTR-2B.',
    provenance: 'General GST Rule',
    actions: [{ label: 'Check Purchase Tax Credit', actionTab: 'reconciliation' }, { label: 'View Purchases', actionTab: 'purchases' }]
  },
  {
    keywords: ['gstr-1', 'gstr1', 'sales return', 'report sales'],
    answer: 'GSTR-1 is your monthly or quarterly statement of sales made by your business. You report all B2B and B2C invoices here. You do not pay tax when filing GSTR-1; it merely reports outward supplies so your buyers can receive tax credit.',
    provenance: 'General GST Rule',
    actions: [{ label: 'Prepare GSTR-1 Draft', actionTab: 'reports' }, { label: 'Add Sales Invoice', actionTab: 'sales' }]
  },
  {
    keywords: ['gstr-3b', 'gstr3b', 'tax payable', 'pay gst'],
    answer: 'GSTR-3B is your self-declared monthly summary return. Here, your total sales tax is matched against your eligible Input Tax Credit (ITC). The remaining balance is paid either using your electronic credit ledger or online cash payment.',
    provenance: 'General GST Rule',
    actions: [{ label: 'Review GSTR-3B Summary', actionTab: 'reports' }]
  },
  {
    keywords: ['deadline', 'due date', 'when to file', 'penalty', 'calendar'],
    answer: 'For regular monthly filers: GSTR-1 is due on the 11th of each month, and GSTR-3B is due on the 20th of each month. Late filing attracts a statutory late fee (₹50/day or ₹20/day for nil returns) plus 18% annual interest on unpaid tax.',
    provenance: 'General GST Rule',
    actions: [{ label: 'Open Compliance Calendar', actionTab: 'calendar' }]
  },
  {
    keywords: ['reconciliation', 'mismatch', 'difference', 'supplier', 'gstr-2b'],
    answer: 'A reconciliation mismatch happens when a purchase bill recorded in your books does not match what the supplier filed on the GST portal (GSTR-2B). This could be due to invoice number typos, wrong GSTIN, or the supplier filing late. Mismatches are common and not fraud; simply contact your supplier to ensure they file their GSTR-1.',
    provenance: 'General GST Rule',
    actions: [{ label: 'Resolve Mismatches', actionTab: 'reconciliation' }]
  },
  {
    keywords: ['status', 'my business', 'summary', 'overview', 'how am i doing'],
    answer: 'Here is your current compliance summary: You have 8 sales invoices recorded and 6 purchase bills in your local draft. 2 purchase invoices have differences compared to GSTR-2B and require your review before finalizing this month’s GSTR-3B.',
    provenance: 'Based on your business records',
    actions: [{ label: 'Go to Dashboard', actionTab: 'dashboard' }, { label: 'Review GST Summary', actionTab: 'reports' }]
  }
];

export function getCopilotResponse(query, context) {
  const normalized = (query || '').toLowerCase();
  
  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some(k => normalized.includes(k))) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: item.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provenance: item.provenance,
        quickActions: item.actions,
      };
    }
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: "I can explain GST rules, guide your monthly filings, or help you understand purchase tax credits. If you need specific legal classification or advance statutory advice, please consult an accredited Chartered Accountant.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    provenance: 'Professional Verification Required',
    quickActions: [
      { label: 'Consult CA Support', actionTab: 'ca-support' },
      { label: 'View GST Reports', actionTab: 'reports' }
    ]
  };
}

