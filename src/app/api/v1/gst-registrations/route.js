// GET, POST /api/v1/gst-registrations
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { GSTRegistrationCreateSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, forbidden } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request);
    const { searchParams } = new URL(request.url);
    const legalEntityId = searchParams.get('legalEntityId');

    const registrations = await TenantStore.getGSTRegistrations(ctx.organizationId, legalEntityId);
    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canManageIntegrations');
    const body = await request.json();
    const validated = GSTRegistrationCreateSchema.parse(body);

    // Verify legalEntity belongs to organization
    const entity = await TenantStore.getLegalEntityById(ctx.organizationId, validated.legalEntityId);
    if (!entity) {
      throw forbidden('Legal entity does not belong to this organization');
    }

    const registration = await TenantStore.createGSTRegistration({
      organizationId: ctx.organizationId,
      legalEntityId: validated.legalEntityId,
      gstin: validated.gstin,
      stateCode: validated.stateCode,
      stateName: validated.stateName,
      registrationType: validated.registrationType
    });

    await TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'GST_REGISTRATION_CREATED',
      entityType: 'GST_REGISTRATION',
      entityId: registration.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: { gstin: registration.gstin, stateCode: registration.state_code }
    });

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
