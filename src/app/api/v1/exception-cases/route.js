// GET /api/v1/exception-cases - Work Queue for Reconciliation Mismatches
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const cases = await TenantStore.getExceptionCases(ctx.organizationId, status);
    return NextResponse.json({
      success: true,
      cases: cases.map(c => ({
        id: c.id,
        reconciliationRunId: c.reconciliation_run_id,
        invoiceNumber: c.invoice_number,
        partyName: c.party_name,
        differencePaise: c.difference_paise,
        exceptionType: c.exception_type,
        status: c.status,
        assignedTo: c.assigned_to,
        notes: c.resolution_notes,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }))
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
