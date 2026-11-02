// Secure Session Management with Boot-Time Secret, Database Persistence & Revocation
import crypto from 'node:crypto';
import { TenantStore } from '../services/tenantStore.js';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSessionSecret() {
  if (process.env.SESSION_SECRET) {
    if (process.env.SESSION_SECRET.length < 32) {
      throw new Error('SESSION_SECRET must be at least 32 characters long');
    }
    return process.env.SESSION_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY ERROR: SESSION_SECRET environment variable is mandatory in production');
  }
  // Secure ephemeral boot-time secret for development/tests (never hard-coded)
  if (!globalThis.__GST_CDA_DEV_SECRET) {
    globalThis.__GST_CDA_DEV_SECRET = crypto.randomBytes(32).toString('hex');
  }
  return globalThis.__GST_CDA_DEV_SECRET;
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function signToken(payload) {
  const secret = getSessionSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${hmac}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const secret = getSessionSecret();
  const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  
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

export async function createSession({ userId, organizationId, legalEntityId, gstRegistrationId, role, email, name }) {
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
  const tokenHash = hashToken(token);

  // Persist session to database
  await TenantStore.saveSessionRecord({
    id: sessionId,
    userId,
    organizationId,
    tokenHash,
    role,
    expiresAt: new Date(expiresAt).toISOString()
  });

  return { sessionId, token, expiresAt, sessionData };
}

export async function getSession(token) {
  const payload = verifyToken(token);
  if (!payload || !payload.sessionId) return null;

  const tokenHash = hashToken(token);
  // Verify with database record for active & unrevoked status
  const record = await TenantStore.getSessionRecordByTokenHash(tokenHash);
  if (!record) return null;

  if (new Date(record.expires_at).getTime() < Date.now()) {
    await TenantStore.revokeSession(record.id);
    return null;
  }

  return {
    ...payload,
    role: record.role,
    organizationId: record.organization_id
  };
}

export async function rotateSession(currentSessionId, updates = {}) {
  const existingRecord = await TenantStore.getSessionRecordById(currentSessionId);
  if (!existingRecord) return null;

  // Revoke current session
  await TenantStore.revokeSession(currentSessionId);

  // Issue new rotated session
  return createSession({
    userId: existingRecord.user_id,
    organizationId: updates.organizationId || existingRecord.organization_id,
    legalEntityId: updates.legalEntityId || null,
    gstRegistrationId: updates.gstRegistrationId || null,
    role: updates.role || existingRecord.role,
    email: updates.email || existingRecord.email,
    name: updates.name || existingRecord.name
  });
}

export async function destroySession(sessionId) {
  if (sessionId) {
    await TenantStore.revokeSession(sessionId);
  }
}

export async function getSessionFromRequest(request) {
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
