// POST, GET /api/auth - PERMANENTLY DECOMMISSIONED
// Legacy unauthenticated auth bootstrap has been removed to enforce strict authentication boundaries.
import { ApiError, createProblemResponse } from '../../../lib/security/errors.js';

export async function POST(request) {
  return createProblemResponse(
    new ApiError(
      410,
      'Endpoint Decommissioned',
      'The legacy /api/auth endpoint has been permanently removed. Authenticate via POST /api/v1/auth/login or register via POST /api/v1/auth/signup.',
      'urn:problem:endpoint-decommissioned'
    ),
    request
  );
}

export async function GET(request) {
  return POST(request);
}
