// GST CDA - Security Context & BFF Policy Enforcement
import crypto from 'node:crypto';
import { getSessionFromRequest } from './session.js';
import { unauthorized, forbidden } from './errors.js';
import { validateCsrf } from './csrf.js';
import { TenantStore, withTenantContext } from '../services/tenantStore.js';
import { hasPermission } from '../../../packages/authz/roles.js';

export async function requireAuthContext(request, requiredPermission = null) {
  // Enforce CSRF protection for state-mutating requests
  validateCsrf(request);

  const session = await getSessionFromRequest(request);
  if (!session || !session.userId || !session.organizationId) {
    throw unauthorized('Valid session or bearer token required to access this API');
  }

  // Verify membership and active status in organization
  const membership = await TenantStore.getMembership(session.organizationId, session.userId);
  if (!membership || membership.status !== 'ACTIVE') {
    throw forbidden('User is not an active member of the requested organization');
  }

  const role = membership.role;

  // Check role-based permission if specified
  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    throw forbidden(`Role ${role} does not have permission '${requiredPermission}'`);
  }

  // Get active organization
  const organization = await TenantStore.getOrganizationById(session.organizationId);
  if (!organization || !organization.is_active) {
    throw forbidden('Organization is inactive or suspended');
  }

  // Resolve default or active GST registration if available
  let activeRegistration = null;
  if (session.gstRegistrationId) {
    activeRegistration = await TenantStore.getGSTRegistrationById(session.organizationId, session.gstRegistrationId);
  } else {
    const regs = await TenantStore.getGSTRegistrations(session.organizationId);
    if (regs.length > 0) {
      activeRegistration = regs[0];
    }
  }

  let activeLegalEntity = null;
  if (activeRegistration) {
    activeLegalEntity = await TenantStore.getLegalEntityById(session.organizationId, activeRegistration.legal_entity_id);
  } else {
    const entities = await TenantStore.getLegalEntities(session.organizationId);
    if (entities.length > 0) {
      activeLegalEntity = entities[0];
    }
  }

  const correlationId = request.headers.get('x-correlation-id') || crypto.randomUUID();

  return {
    userId: session.userId,
    organizationId: session.organizationId,
    legalEntityId: activeLegalEntity?.id || null,
    gstRegistrationId: activeRegistration?.id || null,
    role,
    email: session.email,
    name: session.name,
    organization,
    activeRegistration,
    activeLegalEntity,
    correlationId,
    
    // Scoped executor that wraps DB calls in transaction/tenant context
    runScoped(fn) {
      return withTenantContext(session.organizationId, fn);
    }
  };
}
