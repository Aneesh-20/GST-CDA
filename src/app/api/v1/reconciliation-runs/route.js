// POST /api/v1/reconciliation-runs - 2B / Books Ingestion & Matching Engine
import { NextResponse } from 'next/server.js';
import { ReconciliationRunSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canPrepareDrafts');
    const body = await request.json();
    const validated = ReconciliationRunSchema.parse(body);

    const gstRegistrationId = ctx.gstRegistrationId;
    if (!gstRegistrationId) {
      throw badRequest('Active GST registration required for reconciliation');
    }

    const run = TenantStore.createReconciliationRun({
      organizationId: ctx.organizationId,
      gstRegistrationId,
      periodKey: validated.periodKey,
      ruleVersion: validated.ruleVersion
    });

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'RECONCILIATION_RUN_COMPLETED',
      entityType: 'RECONCILIATION_RUN',
      entityId: run.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {
        period: validated.periodKey,
        matched: run.matched_count,
        mismatched: run.mismatched_count
      }
    });

    return NextResponse.json({
      success: true,
      run: {
        id: run.id,
        periodKey: run.period_key,
        ruleVersion: run.rule_version,
        matchedCount: run.matched_count,
        mismatchedCount: run.mismatched_count,
        missingIn2BCount: run.missing_in_2b_count,
        missingInBooksCount: run.missing_in_books_count,
        status: run.status,
        createdAt: run.created_at
      }
    }, { status: 201 });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
