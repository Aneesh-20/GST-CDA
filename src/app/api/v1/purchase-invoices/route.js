// GET, POST /api/v1/purchase-invoices - Purchase Books & ITC Register
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { PurchaseInvoiceCreateSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const status = searchParams.get('status');
    const gstRegistrationId = searchParams.get('gstRegistrationId') || ctx.gstRegistrationId;

    const result = await TenantStore.getPurchaseInvoices(ctx.organizationId, {
      gstRegistrationId,
      cursor,
      limit,
      status
    });

    return NextResponse.json({
      data: result.items.map(serializeInvoice),
      pagination: {
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
        limit
      }
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const body = await request.json();
    const validated = PurchaseInvoiceCreateSchema.parse(body);

    const gstRegistrationId = ctx.gstRegistrationId;
    if (!gstRegistrationId) {
      throw badRequest('No active GST registration in current session');
    }

    const invoice = await TenantStore.createPurchaseInvoice({
      organizationId: ctx.organizationId,
      legalEntityId: ctx.legalEntityId,
      gstRegistrationId,
      returnPeriodKey: '2026-09',
      invoiceNumber: validated.invoiceNumber,
      invoiceDate: validated.invoiceDate,
      partyName: validated.partyName,
      partyGstin: validated.partyGstin,
      placeOfSupply: validated.placeOfSupply,
      supplyType: validated.supplyType,
      taxablePaise: validated.taxablePaise,
      ratePercent: validated.ratePercent,
      cgstPaise: validated.cgstPaise,
      sgstPaise: validated.sgstPaise,
      igstPaise: validated.igstPaise,
      totalPaise: validated.totalPaise,
      itcEligibility: validated.itcEligibility, // defaults to 'NEEDS_REVIEW'
      status: validated.status
    });

    await TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'PURCHASE_INVOICE_CREATED',
      entityType: 'PURCHASE_INVOICE',
      entityId: invoice.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {
        invoiceNumber: invoice.invoiceNumber,
        totalPaise: invoice.totalPaise.toString()
      }
    });

    return NextResponse.json({
      success: true,
      data: serializeInvoice(invoice)
    }, {
      status: 201,
      headers: {
        'ETag': `"${invoice.version}"`
      }
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

function serializeInvoice(inv) {
  return {
    ...inv,
    taxablePaise: inv.taxablePaise.toString(),
    cgstPaise: inv.cgstPaise.toString(),
    sgstPaise: inv.sgstPaise.toString(),
    igstPaise: inv.igstPaise.toString(),
    totalPaise: inv.totalPaise.toString()
  };
}
