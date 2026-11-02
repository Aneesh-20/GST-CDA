// GET /api/v1/audit-events - Tamper-Evident SHA-256 Chained Audit Trail
import { NextResponse } from 'next/server.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function GET(request) {
  try {
    const ctx = await requireAuthContext(request, 'canViewReports');
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    const events = TenantStore.getAuditEvents(ctx.organizationId, limit);

    return NextResponse.json({
      success: true,
      events: events.map(e => ({
        id: e.id,
        actorId: e.actor_id,
        action: e.action,
        entityType: e.entity_type,
        entityId: e.entity_id,
        prevHash: e.prev_hash,
        eventHash: e.event_hash,
        correlationId: e.correlation_id,
        metadata: e.metadata,
        createdAt: e.created_at
      }))
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
