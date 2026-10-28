// GST CDA - Integration Capability Registry
// Source: 182-API analysis workbook

export type CapabilityStatus = 
  | 'WORKING_DISABLED_BY_DEFAULT' // 96 APIs - Needs GSP credentials & end-to-end sandbox verification
  | 'PARTIAL_UNAVAILABLE'        // 2 APIs - Limited supported subsets
  | 'NOT_WORKING_DISABLED'       // 6 APIs - Portal failures or defects
  | 'NOT_TESTED_BACKLOG'         // 77 APIs - Backlog only
  | 'UNKNOWN';                   // 1 API

export interface APICapability {
  id: string;
  code: string;
  name: string;
  category: 'AUTH' | 'GSTR1' | 'GSTR1A' | 'GSTR2A_2B' | 'IMS' | 'GSTR3B' | 'GSTR4' | 'GSTR6' | 'GSTR7' | 'GSTR9' | 'PUBLIC';
  status: CapabilityStatus;
  description: string;
  workbookStatus: 'Working' | 'Partial Working' | 'Not Working' | 'Not Tested' | 'No Status';
  requiresAuth: boolean;
}

export const CAPABILITY_REGISTRY: APICapability[] = [
  // Session & Public Auth
  { id: 'cap-1', code: 'AUTH_OTP_REQUEST', name: 'Request OTP', category: 'AUTH', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: false, description: 'Requests OTP for EVC or GST portal session authentication.' },
  { id: 'cap-2', code: 'AUTH_OTP_EVC', name: 'Initiate OTP for EVC', category: 'AUTH', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Sends OTP to taxpayer registered mobile for return filing.' },
  { id: 'cap-3', code: 'AUTH_TOKEN', name: 'Authorisation Token', category: 'AUTH', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Exchanges OTP for GSP session auth token.' },
  { id: 'cap-4', code: 'PUB_GSTIN_VERIFY', name: 'Online GSTIN Verification', category: 'PUBLIC', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: false, description: 'Checks taxpayer registration status in real-time.' },
  { id: 'cap-5', code: 'PUB_RETURN_TRACK', name: 'View / Track Return Filing', category: 'PUBLIC', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: false, description: 'Retrieves return filing history by GSTIN and financial year.' },

  // GSTR-1 Outward Supplies
  { id: 'cap-10', code: 'GSTR1_FILE', name: 'File GSTR-1', category: 'GSTR1', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Cryptographic submission with EVC/DSC.' },
  { id: 'cap-11', code: 'GSTR1_SAVE', name: 'Save GSTR-1 Payload', category: 'GSTR1', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Saves invoice records to GSTN staging.' },
  { id: 'cap-12', code: 'GSTR1_B2B_GET', name: 'Get B2B Supplies', category: 'GSTR1', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Retrieves B2B outward invoices filed on portal.' },
  { id: 'cap-13', code: 'GSTR1_SUMMARY_GET', name: 'Get GSTR-1 Summary', category: 'GSTR1', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Fetches section-wise summary counts and values.' },
  { id: 'cap-14', code: 'GSTR1_HSN_SUMMARY', name: 'Get HSN Summary', category: 'GSTR1', status: 'NOT_WORKING_DISABLED', workbookStatus: 'Not Working', requiresAuth: true, description: 'Defect reported in workbook; disabled in product.' },

  // GSTR-2B & IMS Purchase Data
  { id: 'cap-20', code: 'GSTR2B_GENERATE', name: 'Generate GSTR-2B On-Demand', category: 'GSTR2A_2B', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Triggers real-time generation of GSTR-2B statement.' },
  { id: 'cap-21', code: 'GSTR2B_GET_ALL', name: 'Get GSTR-2B All Details', category: 'GSTR2A_2B', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Retrieves auto-drafted ITC statement data.' },
  { id: 'cap-22', code: 'IMS_GET_INVOICES', name: 'IMS Get Invoices', category: 'IMS', status: 'PARTIAL_UNAVAILABLE', workbookStatus: 'Partial Working', requiresAuth: true, description: 'Invoice Management System retrieval is partially functional.' },

  // GSTR-3B Summary Return
  { id: 'cap-30', code: 'GSTR3B_AUTO_CALC', name: 'Auto-calculated ITC / Liability', category: 'GSTR3B', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Retrieves portal auto-populated figures from GSTR-1 & 2B.' },
  { id: 'cap-31', code: 'GSTR3B_OFFSET_LIABILITY', name: 'Offset Liability', category: 'GSTR3B', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Offsets cash and credit ledgers against tax payable.' },
  { id: 'cap-32', code: 'GSTR3B_FILE', name: 'File GSTR-3B', category: 'GSTR3B', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Submits finalized GSTR-3B return with EVC.' },
  { id: 'cap-33', code: 'GSTR3B_RCM_OPENING', name: 'Submit RCM Opening Balance', category: 'GSTR3B', status: 'NOT_WORKING_DISABLED', workbookStatus: 'Not Working', requiresAuth: true, description: 'Marked not working in workbook.' },

  // Additional returns
  { id: 'cap-40', code: 'GSTR9_GET_DETAILS', name: 'GSTR-9 Auto-Calculated Details', category: 'GSTR9', status: 'WORKING_DISABLED_BY_DEFAULT', workbookStatus: 'Working', requiresAuth: true, description: 'Annual return pre-fill data.' },
  { id: 'cap-41', code: 'GSTR4_FILE', name: 'GSTR-4 File (Composition)', category: 'GSTR4', status: 'NOT_TESTED_BACKLOG', workbookStatus: 'Not Tested', requiresAuth: true, description: 'Composition annual return filing.' },
];

export function getCapabilitiesByCategory(category?: string) {
  if (!category || category === 'ALL') return CAPABILITY_REGISTRY;
  return CAPABILITY_REGISTRY.filter(c => c.category === category);
}

export const CAPABILITY_METRICS = {
  total: 182,
  working: 96,
  partial: 2,
  notWorking: 6,
  notTested: 77,
  unknown: 1,
};

