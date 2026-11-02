// POST /api/v1/filings - Idempotent Statutory Return Filing
import { NextResponse } from 'next/server.js';
import { FilingSubmitSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, badRequest } from '../../../../lib/security/errors.js';
import { TenantStore } from '../../../../lib/services/tenantStore.js';

export async function POST(request) {
  try {
    const ctx = await requireAuthContext(request, 'canAuthorizeFiling');
    const body = await request.json();
    const validated = FilingSubmitSchema.parse(body);

    const gstRegistrationId = ctx.gstRegistrationId;
    if (!gstRegistrationId) {
      throw badRequest('Active GST registration required for filing submission');
    }

    const { isDuplicate, filing } = TenantStore.createFilingAttempt({
      organizationId: ctx.organizationId,
      gstRegistrationId,
      periodKey: validated.periodKey,
      returnType: validated.returnType,
      idempotencyKey: validated.idempotencyKey,
      authorizedBy: ctx.userId
    });

    if (!isDuplicate) {
      TenantStore.appendAuditEvent({
        organizationId: ctx.organizationId,
        actorId: ctx.userId,
        action: 'FILING_SUBMITTED',
        entityType: validated.returnType,
        entityId: filing.id,
        correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
        metadata: {
          arn: filing.arn,
          idempotencyKey: validated.idempotencyKey,
          payloadHash: filing.payload_hash
        }
      });
    }

    return NextResponse.json({
      success: true,
      isDuplicateReplay: isDuplicate,
      filing: {
        id: filing.id,
        arn: filing.arn,
        status: filing.status,
        returnType: filing.return_type,
        periodKey: filing.period_key,
        payloadHash: filing.payload_hash,
        responseHash: filing.response_hash,
        createdAt: filing.created_at
      }
    }, {
      status: isDuplicate ? 200 : 201
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
