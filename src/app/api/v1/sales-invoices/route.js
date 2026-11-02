// GET, POST /api/v1/sales-invoices - Sales Books Management
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { SalesInvoiceCreateSchema } from '../../../../lib/validation/schemas.js';
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

    const result = await TenantStore.getSalesInvoices(ctx.organizationId, {
      gstRegistrationId,
      cursor,
      limit,
      status
    });

    const serializedItems = result.items.map(serializeInvoice);

    return NextResponse.json({
      data: serializedItems,
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
    const validated = SalesInvoiceCreateSchema.parse(body);

    const gstRegistrationId = ctx.gstRegistrationId;
    if (!gstRegistrationId) {
      throw badRequest('No active GST registration in current session');
    }

    const invoice = await TenantStore.createSalesInvoice({
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
      status: validated.status
    });

    await TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'SALES_INVOICE_CREATED',
      entityType: 'SALES_INVOICE',
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
