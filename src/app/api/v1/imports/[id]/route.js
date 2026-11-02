// GET /api/v1/imports/:id
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../../lib/security/context.js';
import { createProblemResponse, notFound } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';

export async function GET(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const job = TenantStore.getImportJobById(ctx.organizationId, id);
    if (!job) {
      throw notFound('Import job not found in this organization');
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        entityType: job.entity_type,
        filename: job.filename,
        status: job.status,
        totalRows: job.total_rows,
        validRows: job.valid_rows,
        errorRows: job.error_rows,
        createdAt: job.created_at
      }
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
