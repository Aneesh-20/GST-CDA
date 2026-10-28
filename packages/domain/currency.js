// GST CDA - Exact Minor Unit (Paise) Currency Engine
// Rule: Never use floating-point numbers for financial computations.

/**
 * Converts Indian Rupees string or number into Paise (BigInt).
 * E.g. "1249.50" -> 124950n
 */
export function rupeesToPaise(amount) {
  const str = typeof amount === 'number' ? amount.toFixed(2) : (amount || '').toString().trim();
  if (!str) return 0n;

  const parts = str.split('.');
  const whole = parts[0].replace(/[^0-9-]/g, '') || '0';
  let decimal = parts[1] || '00';
  if (decimal.length === 1) decimal += '0';
  if (decimal.length > 2) decimal = decimal.substring(0, 2);

  const sign = whole.startsWith('-') ? -1n : 1n;
  const cleanWhole = whole.replace('-', '');
  
  const total = (BigInt(cleanWhole) * 100n) + BigInt(decimal);
  return total * sign;
}

/**
 * Converts Paise (BigInt or number) to Rupee decimal representation string.
 * E.g. 124950n -> "1249.50"
 */
export function paiseToRupees(paise) {
  const p = typeof paise === 'number' ? BigInt(paise) : paise;
  const isNegative = p < 0n;
  const absP = isNegative ? -p : p;
  const whole = absP / 100n;
  const fraction = absP % 100n;
  const fractionStr = fraction < 10n ? `0${fraction}` : fraction.toString();
  return `${isNegative ? '-' : ''}${whole.toString()}.${fractionStr}`;
}

/**
 * Formats Paise into Indian Lakhs/Crores currency format (₹ 1,23,456.78)
 */
export function formatINR(paise) {
  if (paise === undefined || paise === null) return '₹ 0.00';
  const rupeeStr = paiseToRupees(paise);
  const parts = rupeeStr.split('.');
  let whole = parts[0];
  const decimal = parts[1];

  const isNeg = whole.startsWith('-');
  if (isNeg) whole = whole.substring(1);

  // Indian number grouping: last 3 digits, then groups of 2
  if (whole.length > 3) {
    const last3 = whole.substring(whole.length - 3);
    const rest = whole.substring(0, whole.length - 3);
    const formattedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    whole = `${formattedRest},${last3}`;
  }

  return `${isNeg ? '-' : ''}₹ ${whole}.${decimal}`;
}

