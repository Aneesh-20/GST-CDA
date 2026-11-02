// CSRF Validation for State-Mutating Requests
import { forbidden } from './errors.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function validateCsrf(request) {
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return; // Safe method, no CSRF check needed
  }

  // If request uses Bearer token, it is not vulnerable to ambient credential (cookie) CSRF
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return;
  }

  const cookieHeader = request.headers.get('cookie') || '';
  if (!cookieHeader.includes('gst_cda_session=')) {
    return; // Not using cookie authentication
  }

  // For cookie-authenticated mutations, check Sec-Fetch-Site or Origin
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && (secFetchSite === 'cross-site')) {
    throw forbidden('Cross-site request forgery protection rejected this request');
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        throw forbidden('Origin mismatch: Cross-site request rejected');
      }
    } catch {
      throw forbidden('Malformed request origin');
    }
  }
}
