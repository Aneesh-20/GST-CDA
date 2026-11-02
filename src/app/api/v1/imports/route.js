// POST /api/v1/imports - Asynchronous Ingestion Job Submission
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const body = await request.json();
    const { entityType = 'SALES', filename = 'import.xlsx' } = body;

    const job = await TenantStore.createImportJob({
      organizationId: ctx.organizationId,
      entityType,
      filename
    });

    await TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'IMPORT_JOB_CREATED',
      entityType: 'IMPORT_JOB',
      entityId: job.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: { filename, entityType }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status,
      totalRows: job.total_rows,
      validRows: job.valid_rows,
      errorRows: job.error_rows,
      createdAt: job.created_at
    }, { status: 202 });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
