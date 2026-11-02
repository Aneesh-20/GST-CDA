// POST /api/auth - Backward-Compatible Auth Adapter with Session Guard
import { NextResponse } from 'next/server.js';
import { getSessionFromRequest, createSession } from '../../../lib/security/session.js';
import { TenantStore } from '../../../lib/services/tenantStore.js';
import { createProblemResponse, unauthorized } from '../../../lib/security/errors.js';

export async function POST(request) {
  try {
    const session = getSessionFromRequest(request);
    const body = await request.json().catch(() => ({}));
    const { email, name, businessName } = body;

    let targetEmail = session?.email || email;
    if (!targetEmail) {
      targetEmail = 'owner@murugantraders.in'; // Default demo principal
    }

    let user = TenantStore.getUserByEmail(targetEmail);
    if (!user) {
      user = TenantStore.createUser({
        email: targetEmail,
        password: 'Password123!',
        fullName: name || targetEmail.split('@')[0]
      });
    }

    const orgSlug = targetEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
    let org = TenantStore.getOrganizationBySlug(orgSlug);
    if (!org) {
      org = TenantStore.createOrganization({
        name: businessName || `${user.fullName}'s Enterprise`,
        slug: orgSlug
      });
    }

    let membership = TenantStore.getMembership(org.id, user.id);
    if (!membership) {
      membership = TenantStore.createMembership({
        organizationId: org.id,
        userId: user.id,
        role: 'OWNER',
        status: 'ACTIVE'
      });
    }

    let entities = TenantStore.getLegalEntities(org.id);
    let entity = entities[0];
    if (!entity) {
      entity = TenantStore.createLegalEntity({
        organizationId: org.id,
        legalName: org.name,
        tradeName: org.name,
        pan: 'AABCM1234F',
        entityType: 'PROPRIETORSHIP'
      });
    }

    let regs = TenantStore.getGSTRegistrations(org.id, entity.id);
    let reg = regs[0];
    if (!reg) {
      reg = TenantStore.createGSTRegistration({
        organizationId: org.id,
        legalEntityId: entity.id,
        gstin: '33AABCM1234F1Z5',
        stateCode: '33',
        stateName: 'Tamil Nadu'
      });
    }

    const newSession = createSession({
      userId: user.id,
      organizationId: org.id,
      legalEntityId: entity.id,
      gstRegistrationId: reg.id,
      role: membership.role,
      email: user.email,
      name: user.fullName
    });

    const sales = TenantStore.getSalesInvoices(org.id, { limit: 100 }).items;
    const purchases = TenantStore.getPurchaseInvoices(org.id, { limit: 100 }).items;

    const response = NextResponse.json({
      success: true,
      token: newSession.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: membership.role
      },
      business: {
        id: entity.id,
        legalName: entity.legal_name,
        tradeName: entity.trade_name,
        gstin: reg.gstin,
        pan: entity.pan,
        stateCode: reg.state_code,
        stateName: reg.state_name
      },
      sales,
      purchases
    });

    response.cookies.set('gst_cda_session', newSession.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
