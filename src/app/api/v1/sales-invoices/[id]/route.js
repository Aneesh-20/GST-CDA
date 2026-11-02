// GET, PATCH, DELETE /api/v1/sales-invoices/:id
import { NextResponse } from 'next/server.js';
import { InvoicePatchSchema } from '../../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../../lib/security/context.js';
import { createProblemResponse, notFound, conflict, preconditionFailed } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';

export async function GET(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const invoice = TenantStore.getSalesInvoiceById(ctx.organizationId, id);
    if (!invoice) {
      throw notFound('Sales invoice not found in this organization');
    }

    return NextResponse.json({
      data: serializeInvoice(invoice)
    }, {
      headers: {
        'ETag': `"${invoice.version}"`
      }
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function PATCH(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Check If-Match header for optimistic concurrency control
    const ifMatch = request.headers.get('if-match');
    let expectedVersion = null;
    if (ifMatch) {
      const match = ifMatch.replace(/["']/g, '').trim();
      const parsed = parseInt(match, 10);
      if (!isNaN(parsed)) {
        expectedVersion = parsed;
      }
    }

    const body = await request.json();
    const validated = InvoicePatchSchema.parse(body);

    const result = TenantStore.updateSalesInvoice(ctx.organizationId, id, expectedVersion, validated);
    if (result.notFound) {
      throw notFound('Sales invoice not found in this organization');
    }
    if (result.conflict) {
      throw preconditionFailed(`Invoice has been modified by another operation (current version: ${result.currentVersion})`);
    }

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'SALES_INVOICE_UPDATED',
      entityType: 'SALES_INVOICE',
      entityId: id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {
        newVersion: result.invoice.version
      }
    });

    return NextResponse.json({
      success: true,
      data: serializeInvoice(result.invoice)
    }, {
      headers: {
        'ETag': `"${result.invoice.version}"`
      }
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function DELETE(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deleted = TenantStore.deleteSalesInvoice(ctx.organizationId, id);
    if (!deleted) {
      throw notFound('Sales invoice not found in this organization');
    }

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'SALES_INVOICE_DELETED',
      entityType: 'SALES_INVOICE',
      entityId: id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {}
    });

    return NextResponse.json({ success: true, message: 'Sales invoice deleted' });
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
