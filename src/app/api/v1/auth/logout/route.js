// POST /api/v1/auth/logout - Terminate Session
import { NextResponse } from 'next/server.js';
import { getSessionFromRequest, destroySession } from '../../../../../lib/security/session.js';

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (session?.sessionId) {
    destroySession(session.sessionId);
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('gst_cda_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  return response;
}
