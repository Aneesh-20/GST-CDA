// GST CDA - Deterministic Tax Calculation Engine

export const VALID_GST_RATES = [0, 0.25, 3, 5, 12, 18, 28];

export function isValidGSTRate(rate) {
  return VALID_GST_RATES.some(validRate => Math.abs(validRate - rate) < 0.001);
}

export function calculateLineTax(taxablePaise, ratePercent, supplyType) {
  if (taxablePaise < 0n) {
    throw new Error('Taxable amount cannot be negative');
  }

  if (!isValidGSTRate(ratePercent)) {
    throw new Error(`Invalid GST rate ${ratePercent}%. Must be one of: ${VALID_GST_RATES.join(', ')}%`);
  }

  if (ratePercent === 0) {
    return {
      ratePercent: 0,
      taxablePaise,
      cgstPaise: 0n,
      sgstPaise: 0n,
      igstPaise: 0n,
      totalPaise: taxablePaise,
    };
  }

  if (supplyType === 'INTRA') {
    // Intra-State: Split into equal CGST and SGST
    const basisPointsHalf = BigInt(Math.round((ratePercent / 2) * 10000));
    const cgst = (taxablePaise * basisPointsHalf + 500000n) / 1000000n; // Half-up rounding
    const sgst = cgst;

    return {
      ratePercent,
      taxablePaise,
      cgstPaise: cgst,
      sgstPaise: sgst,
      igstPaise: 0n,
      totalPaise: taxablePaise + cgst + sgst,
    };
  } else {
    // Inter-State: 100% IGST
    const basisPoints = BigInt(Math.round(ratePercent * 10000));
    const igst = (taxablePaise * basisPoints + 500000n) / 1000000n; // Half-up rounding

    return {
      ratePercent,
      taxablePaise,
      cgstPaise: 0n,
      sgstPaise: 0n,
      igstPaise: igst,
      totalPaise: taxablePaise + igst,
    };
  }
}

