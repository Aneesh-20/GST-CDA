// POST /api/v1/auth/signup - Secure User & Organization Onboarding
import { NextResponse } from 'next/server.js';
import { SignupSchema } from '../../../../../lib/validation/schemas.js';
import { createProblemResponse, conflict } from '../../../../../lib/security/errors.js';
import { TenantStore } from '../../../../../lib/services/tenantStore.js';
import { createSession } from '../../../../../lib/security/session.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const validated = SignupSchema.parse(body);

    const existingUser = TenantStore.getUserByEmail(validated.email);
    if (existingUser) {
      throw conflict('An account with this email address already exists');
    }

    // 1. Create User
    const user = TenantStore.createUser({
      email: validated.email,
      password: validated.password,
      fullName: validated.fullName,
      phone: validated.phone || null
    });

    // 2. Create Organization
    const slug = validated.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    const organization = TenantStore.createOrganization({
      name: validated.organizationName,
      slug: uniqueSlug,
      plan: 'STANDARD'
    });

    // 3. Bind User as OWNER
    const membership = TenantStore.createMembership({
      organizationId: organization.id,
      userId: user.id,
      role: 'OWNER',
      status: 'ACTIVE'
    });

    // 4. Create Legal Entity
    const legalEntity = TenantStore.createLegalEntity({
      organizationId: organization.id,
      legalName: validated.organizationName,
      tradeName: validated.organizationName,
      pan: validated.pan,
      entityType: validated.businessType,
      isDemo: false
    });

    // 5. Create GST Registration if GSTIN provided
    let gstRegistration = null;
    if (validated.gstin) {
      gstRegistration = TenantStore.createGSTRegistration({
        organizationId: organization.id,
        legalEntityId: legalEntity.id,
        gstin: validated.gstin,
        stateCode: validated.stateCode || validated.gstin.substring(0, 2),
        stateName: validated.stateName || 'Registered State',
        registrationType: 'REGULAR'
      });
    }

    // 6. Create Session
    const { token, expiresAt } = createSession({
      userId: user.id,
      organizationId: organization.id,
      legalEntityId: legalEntity.id,
      gstRegistrationId: gstRegistration?.id || null,
      role: 'OWNER',
      email: user.email,
      name: user.fullName
    });

    // 7. Audit log
    TenantStore.appendAuditEvent({
      organizationId: organization.id,
      actorId: user.id,
      action: 'ORGANIZATION_CREATED',
      entityType: 'ORGANIZATION',
      entityId: organization.id,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: {
        organizationName: organization.name,
        pan: legalEntity.pan,
        gstin: gstRegistration?.gstin || null
      }
    });

    const response = NextResponse.json({
      success: true,
      token,
      expiresAt: new Date(expiresAt).toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      },
      gstRegistration
    }, { status: 201 });

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
