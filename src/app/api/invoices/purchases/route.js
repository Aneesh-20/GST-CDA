// GET, POST, DELETE /api/invoices/purchases - Scoped by Session Tenant
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, badRequest, notFound } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const result = await TenantStore.getPurchaseInvoices(ctx.organizationId, {
      gstRegistrationId: ctx.gstRegistrationId,
      limit: 100
    });

    return NextResponse.json({
      success: true,
      purchases: result.items.map(p => ({
        id: p.id,
        invoiceNumber: p.invoiceNumber,
        date: p.invoiceDate,
        partyName: p.partyName,
        partyGstin: p.partyGstin,
        placeOfSupply: p.placeOfSupply,
        supplyType: p.supplyType,
        taxablePaise: p.taxablePaise.toString(),
        ratePercent: p.ratePercent,
        cgstPaise: p.cgstPaise.toString(),
        sgstPaise: p.sgstPaise.toString(),
        igstPaise: p.igstPaise.toString(),
        totalPaise: p.totalPaise.toString(),
        itcEligibility: p.itcEligibility,
        status: p.status,
        version: p.version
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
      await TenantStore.createPurchaseInvoice({
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
        itcEligibility: inv.itcEligibility || inv.itc_eligibility || 'NEEDS_REVIEW',
        status: inv.status || 'CONFIRMED'
      });
    }

    const updated = (await TenantStore.getPurchaseInvoices(ctx.organizationId, { limit: 100 })).items;
    return NextResponse.json({ success: true, purchases: updated });
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

    const deleted = await TenantStore.deletePurchaseInvoice(ctx.organizationId, invoiceId);
    if (!deleted) {
      throw notFound('Invoice not found');
    }

    const updated = (await TenantStore.getPurchaseInvoices(ctx.organizationId, { limit: 100 })).items;
    return NextResponse.json({ success: true, purchases: updated });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
