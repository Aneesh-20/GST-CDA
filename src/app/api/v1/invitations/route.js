// POST /api/v1/invitations - Invite Team Member / CA
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { InvitationSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canManageTeam');
    const body = await request.json();
    const validated = InvitationSchema.parse(body);

    const invitation = await TenantStore.createInvitation({
      organizationId: ctx.organizationId,
      email: validated.email,
      role: validated.role,
      invitedBy: ctx.userId
    });

    await TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'INVITATION_CREATED',
      entityType: 'INVITATION',
      entityId: invitation.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {
        invitedEmail: validated.email,
        role: validated.role
      }
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        token: invitation.token
      }
    }, { status: 201 });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
