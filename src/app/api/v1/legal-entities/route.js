// GET, POST /api/v1/legal-entities - Legal Entity CRUD
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { LegalEntityCreateSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, forbidden } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request);
    const entities = await TenantStore.getLegalEntities(ctx.organizationId);
    return NextResponse.json({ success: true, entities });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canManageTeam');
    const body = await request.json();
    const validated = LegalEntityCreateSchema.parse(body);

    const entity = await TenantStore.createLegalEntity({
      organizationId: ctx.organizationId,
      legalName: validated.legalName,
      tradeName: validated.tradeName,
      pan: validated.pan,
      entityType: validated.entityType
    });

    await TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'LEGAL_ENTITY_CREATED',
      entityType: 'LEGAL_ENTITY',
      entityId: entity.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: { pan: entity.pan, legalName: entity.legalName }
    });

    return NextResponse.json({ success: true, entity }, { status: 201 });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
