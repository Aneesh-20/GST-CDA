// Secure Session Management with HMAC-SHA256 Token Signing
import crypto from 'node:crypto';

// In production, loaded from process.env.SESSION_SECRET. A fallback is provided for development.
const SESSION_SECRET = process.env.SESSION_SECRET || 'gst-cda-secure-session-hmac-secret-change-in-prod-9472301';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory session cache / fast lookup (persisted in DB as well)
const activeSessions = new Map();

export function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${hmac}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedHmac);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export function createSession({ userId, organizationId, legalEntityId, gstRegistrationId, role, email, name }) {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_MS;

  const sessionData = {
    sessionId,
    userId,
    organizationId,
    legalEntityId: legalEntityId || null,
    gstRegistrationId: gstRegistrationId || null,
    role,
    email,
    name,
    exp: expiresAt,
    createdAt: Date.now()
  };

  const token = signToken(sessionData);
  activeSessions.set(sessionId, sessionData);

  return { sessionId, token, expiresAt, sessionData };
}

export function getSession(token) {
  const payload = verifyToken(token);
  if (!payload) return null;
  
  // Verify with in-memory or session record
  const cached = activeSessions.get(payload.sessionId);
  if (cached && cached.exp < Date.now()) {
    activeSessions.delete(payload.sessionId);
    return null;
  }
  return cached || payload;
}

export function updateSessionScope(sessionId, updates) {
  const existing = activeSessions.get(sessionId);
  if (!existing) return null;
  
  const updated = {
    ...existing,
    ...updates,
    exp: Date.now() + SESSION_TTL_MS
  };
  
  activeSessions.set(sessionId, updated);
  return {
    token: signToken(updated),
    sessionData: updated
  };
}

export function destroySession(sessionId) {
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
}

export function getSessionFromRequest(request) {
  // Check Authorization Bearer header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    return getSession(token);
  }

  // Check Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const sessionToken = cookies['gst_cda_session'];
  if (sessionToken) {
    return getSession(sessionToken);
  }

  return null;
}
