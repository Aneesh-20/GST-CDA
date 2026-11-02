// POST /api/reset - Tenant Data Reset Guarded by Owner Permission & Confirmation
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../lib/security/errors.js';
import { TenantStore, getTenantDb } from '../../../lib/services/tenantStore.js';

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canManageTeam');
    const body = await request.json().catch(() => ({}));
    const { action, confirmation } = body;

    if (confirmation !== 'CONFIRM_RESET_TENANT_DATA') {
      throw badRequest("Explicit confirmation 'CONFIRM_RESET_TENANT_DATA' required for destructive reset operations");
    }

    const db = getTenantDb();
    
    // Scoped only to the caller's organizationId
    db.prepare(`DELETE FROM sales_invoices WHERE organization_id = ?`).run(ctx.organizationId);
    db.prepare(`DELETE FROM purchase_invoices WHERE organization_id = ?`).run(ctx.organizationId);
    db.prepare(`DELETE FROM exception_cases WHERE organization_id = ?`).run(ctx.organizationId);
    db.prepare(`DELETE FROM reconciliation_runs WHERE organization_id = ?`).run(ctx.organizationId);
    db.prepare(`DELETE FROM filing_attempts WHERE organization_id = ?`).run(ctx.organizationId);

    TenantStore.appendAuditEvent({
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action: 'TENANT_DATA_RESET',
      entityType: 'ORGANIZATION',
      entityId: ctx.organizationId,
      correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
      metadata: { action: action || 'clear' }
    });

    return NextResponse.json({
      success: true,
      message: 'Tenant invoices and compliance runs cleared successfully',
      salesCount: 0,
      purchasesCount: 0
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
