// POST /api/v1/session/switch-organization - Scope Switcher
import { NextResponse } from 'next/server.js';
import { SwitchOrganizationSchema } from '../../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../../lib/security/context.js';
import { createProblemResponse, forbidden } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';
import { updateSessionScope, getSessionFromRequest } from '../../../../../lib/security/session.js';

export async function POST(request) {
  try {
    const rawSession = getSessionFromRequest(request);
    if (!rawSession) {
      throw forbidden('Active session required');
    }

    const body = await request.json();
    const { organizationId, gstRegistrationId } = SwitchOrganizationSchema.parse(body);

    // Verify user membership in the target organization
    const membership = TenantStore.getMembership(organizationId, rawSession.userId);
    if (!membership || membership.status !== 'ACTIVE') {
      throw forbidden('You are not a member of the requested organization');
    }

    // Verify registration belongs to target organization if provided
    let validRegId = null;
    if (gstRegistrationId) {
      const reg = TenantStore.getGSTRegistrationById(organizationId, gstRegistrationId);
      if (!reg) {
        throw forbidden('GST registration does not belong to the target organization');
      }
      validRegId = reg.id;
    } else {
      const regs = TenantStore.getGSTRegistrations(organizationId);
      if (regs.length > 0) {
        validRegId = regs[0].id;
      }
    }

    const { token, sessionData } = updateSessionScope(rawSession.sessionId, {
      organizationId,
      gstRegistrationId: validRegId,
      role: membership.role
    });

    const response = NextResponse.json({
      success: true,
      token,
      activeScope: {
        organizationId,
        role: membership.role,
        gstRegistrationId: validRegId
      }
    });

    response.cookies.set('gst_cda_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60
    });

    return response;
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
