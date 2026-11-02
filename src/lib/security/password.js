// Secure Password Hashing using Node.js crypto (PBKDF2 with SHA-512)
import crypto from 'node:crypto';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = 'sha512';

export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password is required');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  
  const [salt, key] = parts;
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST);
  const keyBuffer = Buffer.from(key, 'hex');
  
  if (derivedKey.length !== keyBuffer.length) return false;
  return crypto.timingSafeEqual(derivedKey, keyBuffer);
}

