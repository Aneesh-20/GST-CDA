// GET, PATCH /api/v1/gst-registrations/:id
import { NextResponse } from 'next/server.js';
import { GSTRegistrationPatchSchema } from '../../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../../lib/security/context.js';
import { createProblemResponse, notFound } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';

export async function GET(request, { params }) {
  try {
    const ctx = await requireAuthContext(request);
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const registration = TenantStore.getGSTRegistrationById(ctx.organizationId, id);
    if (!registration) {
      throw notFound('GST registration not found in this organization');
    }

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function PATCH(request, { params }) {
  try {
    const ctx = await requireAuthContext(request, 'canManageIntegrations');
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const validated = GSTRegistrationPatchSchema.parse(body);

    const updated = TenantStore.updateGSTRegistration(ctx.organizationId, id, validated);
    if (!updated) {
      throw notFound('GST registration not found in this organization');
    }

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'GST_REGISTRATION_UPDATED',
      entityType: 'GST_REGISTRATION',
      entityId: id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: validated
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
