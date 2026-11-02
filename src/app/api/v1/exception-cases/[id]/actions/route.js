// POST /api/v1/exception-cases/:id/actions - Resolve / Accept Exception Case
import { NextResponse } from 'next/server.js';
import { ExceptionActionSchema } from '../../../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../../../lib/security/context.js';
import { createProblemResponse, notFound } from '../../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../../lib/services/tenantStore.js';

export async function POST(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canEditInvoices');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const validated = ExceptionActionSchema.parse(body);

    const updated = TenantStore.updateExceptionCase(ctx.organizationId, id, validated);
    if (!updated) {
      throw notFound('Exception case not found in this organization');
    }

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: `EXCEPTION_CASE_${validated.action}ED`,
      entityType: 'EXCEPTION_CASE',
      entityId: id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {
        action: validated.action,
        status: updated.status
      }
    });

    return NextResponse.json({
      success: true,
      case: updated
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
