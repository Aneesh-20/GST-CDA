// GET, POST /api/audit - Scoped by Session Tenant
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../lib/security/context.js';
import { createProblemResponse } from '../../../lib/security/errors.js';
import { TenantStore } from '../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const records = TenantStore.getAuditEvents(ctx.organizationId, 50);
    return NextResponse.json({ success: true, records });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canAuthorizeFiling');
    const body = await request.json();

    const record = TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: body.returnType ? `${body.returnType}_AUDIT_RECORD` : 'AUDIT_RECORD_CREATED',
      entityType: body.returnType || 'GSTR-3B',
      entityId: body.returnPeriod || '2026-09',
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: body
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
