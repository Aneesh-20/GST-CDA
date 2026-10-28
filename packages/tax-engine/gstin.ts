// GST CDA - GSTIN Validation & State Directory
// Note: Local validation verifies syntax and checksum. It does NOT claim GSTN live verification.

export interface GSTINValidationResult {
  isValid: boolean;
  gstin: string;
  stateCode?: string;
  stateName?: string;
  pan?: string;
  entityType?: string;
  error?: string;
}

export const INDIAN_STATES: Record<string, string> = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
  '97': 'Other Territory',
};

const ENTITY_TYPE_MAP: Record<string, string> = {
  P: 'Individual / Sole Proprietorship',
  C: 'Private / Public Limited Company',
  F: 'Partnership Firm / LLP',
  H: 'Hindu Undivided Family (HUF)',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  G: 'Government Entity',
  J: 'Artificial Juridical Person',
  L: 'Local Authority',
};

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * Modulo 36 checksum calculation for Indian GSTIN
 */
function verifyGSTINChecksum(gstin: string): boolean {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let factor = 1;
  let sum = 0;

  for (let i = 0; i < 14; i++) {
    const codePoint = chars.indexOf(gstin[i]);
    if (codePoint === -1) return false;
    let addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    addend = Math.floor(addend / 36) + (addend % 36);
    sum += addend;
  }

  const remainder = sum % 36;
  const checkCodePoint = (36 - remainder) % 36;
  return gstin[14] === chars[checkCodePoint];
}

/**
 * Validates GSTIN structure, state code, PAN and checksum
 */
export function validateGSTIN(rawGstin: string): GSTINValidationResult {
  const gstin = rawGstin.trim().toUpperCase();

  if (!gstin) {
    return { isValid: false, gstin, error: 'GSTIN cannot be empty' };
  }

  if (gstin.length !== 15) {
    return {
      isValid: false,
      gstin,
      error: `GSTIN must be exactly 15 characters (received ${gstin.length})`,
    };
  }

  if (!GSTIN_REGEX.test(gstin)) {
    return {
      isValid: false,
      gstin,
      error: 'Invalid GSTIN format. Expected: 2 digits (State) + 10 alphanumeric (PAN) + 1 entity + Z + 1 checksum',
    };
  }

  const stateCode = gstin.substring(0, 2);
  const stateName = INDIAN_STATES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      gstin,
      error: `Invalid State Code '${stateCode}' in GSTIN`,
    };
  }

  const pan = gstin.substring(2, 12);
  const fourthChar = pan[3];
  const entityType = ENTITY_TYPE_MAP[fourthChar] || 'Other Entity';

  const isChecksumValid = verifyGSTINChecksum(gstin);
  if (!isChecksumValid) {
    return {
      isValid: false,
      gstin,
      stateCode,
      stateName,
      pan,
      entityType,
      error: 'GSTIN checksum verification failed. Please double-check the 15 characters.',
    };
  }

  return {
    isValid: true,
    gstin,
    stateCode,
    stateName,
    pan,
    entityType,
  };
}
