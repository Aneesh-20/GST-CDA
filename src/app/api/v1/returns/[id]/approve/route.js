// POST /api/v1/returns/:id/approve - Taxpayer Statutory Approval (Owner-Only)
import { NextResponse } from 'next/server.js';
import { ApproveReturnSchema } from '../../../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../../../lib/security/context.js';
import { createProblemResponse, forbidden } from '../../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../../lib/services/tenantStore.js';

export async function POST(request, { params }) {
  try {
    // Non-negotiable policy: CA cannot authorize without explicit Owner privilege
    const ctx = await requireAuthContext(request, 'canAuthorizeFiling');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const validated = ApproveReturnSchema.parse({
      periodKey: body.periodKey || id,
      returnType: body.returnType || 'GSTR-3B',
      declarationAccepted: body.declarationAccepted
    });

    const approval = {
      periodKey: validated.periodKey,
      returnType: validated.returnType,
      authorizedBy: ctx.userId,
      authorizedRole: ctx.role,
      approvalTimestamp: new Date().toISOString(),
      status: 'AUTHORIZED'
    };

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'RETURN_FILING_AUTHORIZED',
      entityType: validated.returnType,
      entityId: validated.periodKey,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: approval
    });

    return NextResponse.json({
      success: true,
      approval
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
