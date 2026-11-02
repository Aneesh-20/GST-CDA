// GET, POST, DELETE /api/invoices/sales - Scoped by Session Tenant
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, badRequest, notFound } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const result = await TenantStore.getSalesInvoices(ctx.organizationId, {
      gstRegistrationId: ctx.gstRegistrationId,
      limit: 100
    });

    return NextResponse.json({
      success: true,
      sales: result.items.map(s => ({
        id: s.id,
        invoiceNumber: s.invoiceNumber,
        date: s.invoiceDate,
        partyName: s.partyName,
        partyGstin: s.partyGstin,
        placeOfSupply: s.placeOfSupply,
        supplyType: s.supplyType,
        taxablePaise: s.taxablePaise.toString(),
        ratePercent: s.ratePercent,
        cgstPaise: s.cgstPaise.toString(),
        sgstPaise: s.sgstPaise.toString(),
        igstPaise: s.igstPaise.toString(),
        totalPaise: s.totalPaise.toString(),
        status: s.status,
        version: s.version
      }))
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const body = await request.json();
    const { invoice, invoices } = body;

    const list = Array.isArray(invoices) ? invoices : (invoice ? [invoice] : []);
    if (list.length === 0) {
      throw badRequest('invoice or invoices array is required');
    }

    for (const inv of list) {
      await TenantStore.createSalesInvoice({
        organizationId: ctx.organizationId,
        legalEntityId: ctx.legalEntityId,
        gstRegistrationId: ctx.gstRegistrationId,
        returnPeriodKey: '2026-09',
        invoiceNumber: inv.invoiceNumber || inv.invoice_number,
        invoiceDate: inv.date || inv.invoiceDate,
        partyName: inv.partyName || inv.party_name,
        partyGstin: inv.partyGstin || inv.party_gstin,
        placeOfSupply: inv.placeOfSupply || inv.place_of_supply || '33',
        supplyType: inv.supplyType || inv.supply_type || 'INTRA',
        taxablePaise: BigInt(inv.taxablePaise || inv.taxable_paise || 0),
        ratePercent: Number(inv.ratePercent ?? inv.rate_percent ?? 18),
        cgstPaise: BigInt(inv.cgstPaise || inv.cgst_paise || 0),
        sgstPaise: BigInt(inv.sgstPaise || inv.sgst_paise || 0),
        igstPaise: BigInt(inv.igstPaise || inv.igst_paise || 0),
        totalPaise: BigInt(inv.totalPaise || inv.total_paise || 0),
        status: inv.status || 'CONFIRMED'
      });
    }

    const updated = (await TenantStore.getSalesInvoices(ctx.organizationId, { limit: 100 })).items;
    return NextResponse.json({ success: true, sales: updated });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function DELETE(request) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      throw badRequest('id parameter is required');
    }

    const deleted = await TenantStore.deleteSalesInvoice(ctx.organizationId, invoiceId);
    if (!deleted) {
      throw notFound('Invoice not found');
    }

    const updated = (await TenantStore.getSalesInvoices(ctx.organizationId, { limit: 100 })).items;
    return NextResponse.json({ success: true, sales: updated });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
