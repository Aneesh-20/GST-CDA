// POST /api/reset - Tenant Data Reset Guarded by Owner Permission & Confirmation
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../lib/security/errors.js';
import { TenantStore } from '../../../lib/services/tenantStore.js';

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canManageTeam');
    const body = await request.json().catch(() => ({}));
    const { action, confirmation } = body;

    if (confirmation !== 'CONFIRM_RESET_TENANT_DATA') {
      throw badRequest("Explicit confirmation 'CONFIRM_RESET_TENANT_DATA' required for destructive reset operations");
    }

    const result = await TenantStore.resetTenantData({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      action: action || 'clear'
    });

    return NextResponse.json({
      success: true,
      message: 'Tenant invoices and compliance runs cleared successfully',
      salesCount: result.salesCount,
      purchasesCount: result.purchasesCount
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
