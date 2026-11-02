// POST /api/v1/auth/login - Secure Session Authentication (HttpOnly Cookie, No Token Leak in JSON)
import { NextResponse } from 'next/server.js';
import { LoginSchema } from '../../../../../lib/validation/schemas.js';
import { createProblemResponse, unauthorized } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';
import { verifyPassword } from '../../../../../lib/security/password.js';
import { createSession } from '../../../../../lib/security/session.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const validated = LoginSchema.parse(body);

    const user = await TenantStore.getUserByEmail(validated.email);
    if (!user) {
      throw unauthorized('Invalid email or password');
    }

    const isValid = verifyPassword(validated.password, user.password_hash);
    if (!isValid) {
      throw unauthorized('Invalid email or password');
    }

    const memberships = await TenantStore.getUserMemberships(user.id);
    if (memberships.length === 0) {
      throw unauthorized('User has no active organization membership');
    }

    // Default to primary active membership
    const primaryMembership = memberships[0];
    const registrations = await TenantStore.getGSTRegistrations(primaryMembership.organization_id);
    const primaryRegistration = registrations.length > 0 ? registrations[0] : null;

    const { sessionId, token, expiresAt } = await createSession({
      userId: user.id,
      organizationId: primaryMembership.organization_id,
      legalEntityId: primaryRegistration?.legal_entity_id || null,
      gstRegistrationId: primaryRegistration?.id || null,
      role: primaryMembership.role,
      email: user.email,
      name: user.full_name
    });

    // Do NOT return raw bearer token in JSON body when using HttpOnly cookie!
    const response = NextResponse.json({
      success: true,
      expiresAt: new Date(expiresAt).toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name
      },
      activeScope: {
        organizationId: primaryMembership.organization_id,
        organizationName: primaryMembership.organization_name,
        role: primaryMembership.role,
        registrationId: primaryRegistration?.id || null
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
