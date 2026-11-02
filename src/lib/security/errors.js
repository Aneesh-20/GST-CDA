// RFC 9457 Compliant Problem Details for HTTP APIs
import { NextResponse } from './response.js';
import crypto from 'node:crypto';

export class ApiError extends Error {
  constructor(status, title, detail, type = 'about:blank', invalidParams = null) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.type = type;
    this.invalidParams = invalidParams;
  }
}

export function createProblemResponse(error, req = null) {
  const correlationId = (req && req.headers?.get?.('x-correlation-id')) || crypto.randomUUID();
  
  let status = 500;
  let title = 'Internal Server Error';
  let detail = 'An unexpected error occurred. Please contact support with the correlation ID.';
  let type = 'urn:problem:internal-server-error';
  let invalidParams = undefined;

  if (error instanceof ApiError) {
    status = error.status;
    title = error.title;
    detail = error.detail;
    type = error.type;
    invalidParams = error.invalidParams;
  } else if (error?.name === 'ZodError') {
    status = 422;
    title = 'Validation Failed';
    detail = 'The request payload failed schema validation.';
    type = 'urn:problem:validation-error';
    invalidParams = error.issues?.map(issue => ({
      name: issue.path.join('.'),
      reason: issue.message,
      code: issue.code
    }));
  } else if (error?.message) {
    // Redact any potential SQL/stack strings
    const safeMsg = error.message.replace(/(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|TABLE)/gi, '[REDACTED]');
    detail = safeMsg;
  }

  const problemBody = {
    type,
    title,
    status,
    detail,
    instance: req ? new URL(req.url).pathname : undefined,
    correlationId,
    timestamp: new Date().toISOString(),
    ...(invalidParams ? { invalidParams } : {})
  };

  return NextResponse.json(problemBody, {
    status,
    headers: {
      'Content-Type': 'application/problem+json',
      'X-Correlation-ID': correlationId
    }
  });
}

export function badRequest(detail, invalidParams = null) {
  return new ApiError(400, 'Bad Request', detail, 'urn:problem:bad-request', invalidParams);
}

export function unauthorized(detail = 'Authentication required') {
  return new ApiError(401, 'Unauthorized', detail, 'urn:problem:unauthorized');
}

export function forbidden(detail = 'You do not have permission to access this resource') {
  return new ApiError(403, 'Forbidden', detail, 'urn:problem:forbidden');
}

export function notFound(detail = 'Resource not found') {
  return new ApiError(404, 'Not Found', detail, 'urn:problem:not-found');
}

export function conflict(detail = 'Resource already exists or optimistic concurrency lock conflict') {
  return new ApiError(409, 'Conflict', detail, 'urn:problem:conflict');
}

export function preconditionFailed(detail = 'If-Match header precondition failed') {
  return new ApiError(412, 'Precondition Failed', detail, 'urn:problem:precondition-failed');
}

export function unprocessable(detail, invalidParams = null) {
  return new ApiError(422, 'Unprocessable Entity', detail, 'urn:problem:validation-error', invalidParams);
}
