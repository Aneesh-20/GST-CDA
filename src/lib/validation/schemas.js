// GST CDA - Zod API Request Schemas
import { z } from 'zod';

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const STATE_CODE_REGEX = /^[0-9]{2}$/;

// 1. Session & Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  organizationName: z.string().min(2, 'Organization name is required'),
  pan: z.string().regex(PAN_REGEX, 'Invalid PAN format (e.g. ABCDE1234F)'),
  gstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN format').optional(),
  stateCode: z.string().regex(STATE_CODE_REGEX, 'Invalid 2-digit state code').optional(),
  stateName: z.string().optional(),
  businessType: z.enum(['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'OTHER']).default('PROPRIETORSHIP')
});

export const SwitchOrganizationSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  gstRegistrationId: z.string().uuid('Invalid GST registration ID').optional()
});

export const InvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['OWNER', 'CA', 'ADMIN', 'KIOSK_OPERATOR', 'VIEWER']),
  message: z.string().max(250).optional()
});

// 2. Entities & GSTIN
export const LegalEntityCreateSchema = z.object({
  legalName: z.string().min(2, 'Legal name is required'),
  tradeName: z.string().optional(),
  pan: z.string().regex(PAN_REGEX, 'Invalid PAN format'),
  entityType: z.enum(['PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'OTHER']).default('PROPRIETORSHIP')
});

export const GSTRegistrationCreateSchema = z.object({
  legalEntityId: z.string().uuid('Invalid legal entity ID'),
  gstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN format'),
  stateCode: z.string().regex(STATE_CODE_REGEX, 'Invalid state code'),
  stateName: z.string().min(2, 'State name is required'),
  registrationType: z.enum(['REGULAR', 'COMPOSITION', 'SEZ']).default('REGULAR')
});

export const GSTRegistrationPatchSchema = z.object({
  stateName: z.string().min(2).optional(),
  registrationType: z.enum(['REGULAR', 'COMPOSITION', 'SEZ']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'CANCELLED']).optional()
});

// 3. Books & Invoices
export const SalesInvoiceCreateSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(32),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  partyName: z.string().min(1, 'Customer name is required'),
  partyGstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN').optional().nullable(),
  placeOfSupply: z.string().regex(STATE_CODE_REGEX, 'Invalid place of supply state code'),
  supplyType: z.enum(['INTRA', 'INTER']),
  taxablePaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)),
  ratePercent: z.number().refine(r => [0, 0.25, 3, 5, 12, 18, 28].includes(r), 'Invalid GST slab rate'),
  cgstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).default(0n),
  sgstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).default(0n),
  igstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).default(0n),
  totalPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)),
  status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).default('CONFIRMED')
});

export const PurchaseInvoiceCreateSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(32),
  invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  partyName: z.string().min(1, 'Supplier name is required'),
  partyGstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN').optional().nullable(),
  placeOfSupply: z.string().regex(STATE_CODE_REGEX, 'Invalid place of supply state code'),
  supplyType: z.enum(['INTRA', 'INTER']),
  taxablePaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)),
  ratePercent: z.number().refine(r => [0, 0.25, 3, 5, 12, 18, 28].includes(r), 'Invalid GST slab rate'),
  cgstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).default(0n),
  sgstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).default(0n),
  igstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).default(0n),
  totalPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)),
  itcEligibility: z.enum(['NEEDS_REVIEW', 'ELIGIBLE', 'INELIGIBLE', 'BLOCKED']).default('NEEDS_REVIEW'),
  status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).default('CONFIRMED')
});

export const InvoicePatchSchema = z.object({
  partyName: z.string().min(1).optional(),
  placeOfSupply: z.string().regex(STATE_CODE_REGEX).optional(),
  supplyType: z.enum(['INTRA', 'INTER']).optional(),
  taxablePaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).optional(),
  ratePercent: z.number().refine(r => [0, 0.25, 3, 5, 12, 18, 28].includes(r)).optional(),
  cgstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).optional(),
  sgstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).optional(),
  igstPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).optional(),
  totalPaise: z.union([z.string(), z.number(), z.bigint()]).transform(v => BigInt(v)).optional(),
  status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED']).optional(),
  itcEligibility: z.enum(['NEEDS_REVIEW', 'ELIGIBLE', 'INELIGIBLE', 'BLOCKED']).optional()
});

// 4. Reconciliation & Exceptions
export const ReconciliationRunSchema = z.object({
  periodKey: z.string().regex(/^\d{4}-\d{2}$/, 'Period key must be YYYY-MM'),
  ruleVersion: z.string().default('v1.0.0')
});

export const ExceptionActionSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'RESOLVE']),
  notes: z.string().max(500).optional()
});

// 5. Filings
export const PrepareReturnSchema = z.object({
  periodKey: z.string().regex(/^\d{4}-\d{2}$/, 'Period key must be YYYY-MM'),
  returnType: z.enum(['GSTR-1', 'GSTR-3B', 'GSTR-9'])
});

export const ApproveReturnSchema = z.object({
  periodKey: z.string().regex(/^\d{4}-\d{2}$/, 'Period key must be YYYY-MM'),
  returnType: z.enum(['GSTR-1', 'GSTR-3B', 'GSTR-9']),
  declarationAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the statutory declaration to authorize filing' })
  })
});

export const FilingSubmitSchema = z.object({
  periodKey: z.string().regex(/^\d{4}-\d{2}$/, 'Period key must be YYYY-MM'),
  returnType: z.enum(['GSTR-1', 'GSTR-3B', 'GSTR-9']),
  idempotencyKey: z.string().uuid('Idempotency key must be a valid UUIDv4'),
  authMethod: z.enum(['OTP', 'EVC', 'DSC']).default('OTP'),
  authCode: z.string().min(4, 'Auth verification code is required')
});

