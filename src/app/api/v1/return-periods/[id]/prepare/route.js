// POST /api/v1/return-periods/:id/prepare - Prepare GSTR-1 / GSTR-3B Summary Draft
import { NextResponse } from 'next/server.js';
import { PrepareReturnSchema } from '../../../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../../lib/services/tenantStore.js';

export async function POST(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canPrepareDrafts');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json().catch(() => ({}));
    const validated = PrepareReturnSchema.parse({
      periodKey: body.periodKey || id,
      returnType: body.returnType || 'GSTR-3B'
    });

    const salesResult = TenantStore.getSalesInvoices(ctx.organizationId, {
      gstRegistrationId: ctx.gstRegistrationId,
      limit: 1000
    });

    const purchasesResult = TenantStore.getPurchaseInvoices(ctx.organizationId, {
      gstRegistrationId: ctx.gstRegistrationId,
      limit: 1000
    });

    let totalTaxableSales = 0n;
    let totalTaxLiability = 0n;
    for (const s of salesResult.items) {
      totalTaxableSales += s.taxablePaise;
      totalTaxLiability += s.cgstPaise + s.sgstPaise + s.igstPaise;
    }

    let totalItcClaimed = 0n;
    for (const p of purchasesResult.items) {
      if (p.itcEligibility === 'ELIGIBLE') {
        totalItcClaimed += p.cgstPaise + p.sgstPaise + p.igstPaise;
      }
    }

    const netPayable = totalTaxLiability > totalItcClaimed ? totalTaxLiability - totalItcClaimed : 0n;

    const draft = {
      periodKey: validated.periodKey,
      returnType: validated.returnType,
      status: 'PREPARED',
      taxableSalesPaise: totalTaxableSales.toString(),
      taxLiabilityPaise: totalTaxLiability.toString(),
      itcClaimedPaise: totalItcClaimed.toString(),
      netPayablePaise: netPayable.toString(),
      salesInvoiceCount: salesResult.items.length,
      purchaseInvoiceCount: purchasesResult.items.length,
      calculatedAt: new Date().toISOString()
    };

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'RETURN_DRAFT_PREPARED',
      entityType: validated.returnType,
      entityId: validated.periodKey,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: draft
    });

    return NextResponse.json({
      success: true,
      draft
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
