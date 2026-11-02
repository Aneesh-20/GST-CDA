// GET /api/v1/me - Authenticated Principal & Active Scope
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';
import { ROLE_PERMISSIONS } from '../../../../../packages/authz/roles.ts';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request);
    
    // Fetch all organizations the user is a member of
    const memberships = TenantStore.getUserMemberships(ctx.userId);
    const registrations = TenantStore.getGSTRegistrations(ctx.organizationId);

    return NextResponse.json({
      user: {
        id: ctx.userId,
        email: ctx.email,
        name: ctx.name
      },
      activeScope: {
        organizationId: ctx.organizationId,
        organizationName: ctx.organization.name,
        organizationSlug: ctx.organization.slug,
        role: ctx.role,
        permissions: ROLE_PERMISSIONS[ctx.role],
        activeLegalEntityId: ctx.legalEntityId,
        activeRegistrationId: ctx.gstRegistrationId,
        activeRegistration: ctx.activeRegistration,
        availableRegistrations: registrations
      },
      memberships: memberships.map(m => ({
        organizationId: m.organization_id,
        organizationName: m.organization_name,
        organizationSlug: m.organization_slug,
        role: m.role,
        status: m.status
      }))
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
