// GET, PUT /api/business - Tenant-Scoped Business Profile
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../lib/security/errors.js';
import { TenantStore } from '../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    
    const entities = await TenantStore.getLegalEntities(ctx.organizationId);
    const entity = entities[0];
    const registrations = await TenantStore.getGSTRegistrations(ctx.organizationId);
    const registration = registrations[0];

    const business = {
      id: entity?.id || ctx.organizationId,
      legalName: entity?.legal_name || ctx.organization.name,
      tradeName: entity?.trade_name || ctx.organization.name,
      gstin: registration?.gstin || '',
      pan: entity?.pan || '',
      stateCode: registration?.state_code || '',
      stateName: registration?.state_name || '',
      businessType: entity?.entity_type || 'PROPRIETORSHIP',
      returnPeriod: '2026-09'
    };

    return NextResponse.json({ success: true, business });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}

export async function PUT(request) {
  try {
    const ctx = await requireAuthContext(request, 'canManageIntegrations');
    const body = await request.json();
    const { business } = body;

    if (!business) {
      throw badRequest('business data is required');
    }

    if (ctx.gstRegistrationId && business.stateName) {
      await TenantStore.updateGSTRegistration(ctx.organizationId, ctx.gstRegistrationId, {
        stateName: business.stateName
      });
    }

    return NextResponse.json({ success: true, business });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
