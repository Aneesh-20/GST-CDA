// GET /api/v1/filings/:id - Filing Status & Provenance Receipt
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../../lib/security/context.js';
import { createProblemResponse, notFound } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';

export async function GET(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const filing = TenantStore.getFilingAttemptById(ctx.organizationId, id);
    if (!filing) {
      throw notFound('Filing record not found in this organization');
    }

    return NextResponse.json({
      success: true,
      filing: {
        id: filing.id,
        arn: filing.arn,
        status: filing.status,
        returnType: filing.return_type,
        periodKey: filing.period_key,
        payloadHash: filing.payload_hash,
        responseHash: filing.response_hash,
        authorizedBy: filing.authorized_by,
        createdAt: filing.created_at
      }
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
