// GST CDA - Deterministic Tax Calculation Engine
// Complies with Section 9 of System Specification: Exact minor unit arithmetic and reproducible traces.

import { CalculationTrace, SupplyType } from '../domain/types';

export const VALID_GST_RATES = [0, 0.25, 3, 5, 12, 18, 28] as const;
export type ValidGSTRate = typeof VALID_GST_RATES[number];

export interface LineItemTaxInput {
  taxablePaise: bigint;
  ratePercent: number;
}

export interface LineItemTaxOutput {
  ratePercent: number;
  taxablePaise: bigint;
  cgstPaise: bigint;
  sgstPaise: bigint;
  igstPaise: bigint;
  totalPaise: bigint;
}

export interface InvoiceTaxCalculationInput {
  supplierStateCode: string;
  placeOfSupplyStateCode: string;
  lines: LineItemTaxInput[];
  ruleVersion?: string;
}

export interface InvoiceTaxCalculationResult {
  supplyType: SupplyType;
  supplierStateCode: string;
  placeOfSupplyStateCode: string;
  totalTaxablePaise: bigint;
  totalCgstPaise: bigint;
  totalSgstPaise: bigint;
  totalIgstPaise: bigint;
  grandTotalPaise: bigint;
  lineOutputs: LineItemTaxOutput[];
  trace: CalculationTrace[];
}

/**
 * Validates whether the given rate is a statutory GST slab
 */
export function isValidGSTRate(rate: number): boolean {
  return VALID_GST_RATES.some(validRate => Math.abs(validRate - rate) < 0.001);
}

/**
 * Computes deterministic taxes for an invoice line item
 */
export function calculateLineTax(
  taxablePaise: bigint,
  ratePercent: number,
  supplyType: SupplyType
): LineItemTaxOutput {
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
    // Multiply by (ratePercent * 100) / 2 / 10000 = ratePercent / 200
    // To ensure exact integer math: (taxablePaise * BigInt(Math.round(ratePercent * 1000))) / 200000n
    const basisPointsHalf = BigInt(Math.round((ratePercent / 2) * 10000));
    const cgst = (taxablePaise * basisPointsHalf + 500000n) / 1000000n; // Half-up rounding
    const sgst = cgst; // Under Indian GST law, CGST & SGST must be equal for intra-state

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

/**
 * Calculates complete invoice taxes with traces
 */
export function calculateInvoiceTaxes(
  input: InvoiceTaxCalculationInput
): InvoiceTaxCalculationResult {
  const { supplierStateCode, placeOfSupplyStateCode, lines } = input;
  const ruleVersion = input.ruleVersion || '2026.1-CGST-ACT';

  const cleanSupplier = supplierStateCode.trim().padStart(2, '0');
  const cleanPOS = placeOfSupplyStateCode.trim().padStart(2, '0');

  const supplyType: SupplyType = cleanSupplier === cleanPOS ? 'INTRA' : 'INTER';

  let totalTaxable = 0n;
  let totalCgst = 0n;
  let totalSgst = 0n;
  let totalIgst = 0n;

  const lineOutputs: LineItemTaxOutput[] = [];
  const traces: CalculationTrace[] = [];

  for (const line of lines) {
    const output = calculateLineTax(line.taxablePaise, line.ratePercent, supplyType);
    lineOutputs.push(output);

    totalTaxable += output.taxablePaise;
    totalCgst += output.cgstPaise;
    totalSgst += output.sgstPaise;
    totalIgst += output.igstPaise;

    traces.push({
      supplierStateCode: cleanSupplier,
      placeOfSupplyStateCode: cleanPOS,
      supplyType,
      rateAppliedPercent: line.ratePercent,
      taxableAmountPaise: line.taxablePaise,
      cgstPaise: output.cgstPaise,
      sgstPaise: output.sgstPaise,
      igstPaise: output.igstPaise,
      totalPaise: output.totalPaise,
      ruleVersion,
      timestamp: new Date().toISOString(),
    });
  }

  const grandTotalPaise = totalTaxable + totalCgst + totalSgst + totalIgst;

  return {
    supplyType,
    supplierStateCode: cleanSupplier,
    placeOfSupplyStateCode: cleanPOS,
    totalTaxablePaise: totalTaxable,
    totalCgstPaise: totalCgst,
    totalSgstPaise: totalSgst,
    totalIgstPaise: totalIgst,
    grandTotalPaise,
    lineOutputs,
    trace: traces,
  };
}
