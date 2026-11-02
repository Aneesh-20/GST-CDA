// POST /api/v1/filings - Statutory Return Filing State Machine (No Fake ARNs, GSP Guard)
import crypto from 'node:crypto';
import { NextResponse } from 'next/server.js';
import { FilingSubmitSchema } from '../../../../lib/validation/schemas.js';
import { requireAuthContext } from '../../../../lib/security/context.js';
import { createProblemResponse, badRequest, ApiError } from '../../../../lib/security/errors.js';
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

    const isProduction = process.env.NODE_ENV === 'production';
    const isMockProvider = process.env.MOCK_FILING_PROVIDER === 'true' && !isProduction;

    // In production without live GSP integration, fail closed
    if (!isMockProvider && (!process.env.GSP_CLIENT_ID || !process.env.GSP_CLIENT_SECRET)) {
      throw new ApiError(
        503,
        'GSP Gateway Unavailable',
        'Direct GSTN submission is unavailable: statutory GSP certification and sandbox credentials are not configured.',
        'urn:problem:gsp-unavailable'
      );
    }

    // Idempotent attempt submission
    // State machine: DRAFT -> PREPARED -> AUTHORIZED -> SUBMISSION_PENDING -> SUBMITTED
    // Statutory ARN cannot be synthesized locally; status remains SUBMITTED with provider tracking ID
    const providerTrackingId = isMockProvider
      ? `mock_submission_${crypto.randomUUID()}`
      : `gsp_job_${crypto.randomUUID()}`;

    const { isDuplicate, filing } = await TenantStore.createFilingAttempt({
      organizationId: ctx.organizationId,
      gstRegistrationId,
      periodKey: validated.periodKey,
      returnType: validated.returnType,
      idempotencyKey: validated.idempotencyKey,
      providerTrackingId,
      status: 'SUBMITTED', // Statutory status: submitted to gateway, awaiting GSTN portal acknowledgement
      arn: null, // Never synthesize a fake ARN locally
      authorizedBy: ctx.userId
    });

    if (!isDuplicate) {
      await TenantStore.appendAuditEvent({
        organizationId: ctx.organizationId,
        actorId: ctx.userId,
        action: 'FILING_SUBMISSION_QUEUED',
        entityType: validated.returnType,
        entityId: filing.id,
        correlationId: request.headers.get('x-correlation-id') || crypto.randomUUID(),
        metadata: {
          providerTrackingId: filing.provider_tracking_id,
          idempotencyKey: validated.idempotencyKey,
          payloadHash: filing.payload_hash,
          isMockProvider
        }
      });
    }

    return NextResponse.json({
      success: true,
      isDuplicateReplay: isDuplicate,
      filing: {
        id: filing.id,
        status: filing.status,
        providerTrackingId: filing.provider_tracking_id,
        arn: filing.arn, // null until real GSTN ARN is confirmed via callback
        returnType: filing.return_type,
        periodKey: filing.period_key,
        payloadHash: filing.payload_hash,
        isMockProvider,
        createdAt: filing.created_at
      }
    }, {
      status: isDuplicate ? 200 : 202
    });
  } catch (error) {
    return createProblemResponse(error, request);
  }
}
