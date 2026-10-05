import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Verifies a password against either Django's pbkdf2_sha256 hash or standard bcrypt.
 */
export function verifyPassword(plainPassword, storedHash) {
  if (!storedHash || !plainPassword) return false;

  // Check if it's a Django pbkdf2_sha256 hash
  if (storedHash.startsWith('pbkdf2_sha256$')) {
    try {
      const parts = storedHash.split('$');
      if (parts.length === 4) {
        const iterations = parseInt(parts[1], 10);
        const salt = parts[2];
        const expectedHash = parts[3];

        const derivedKey = crypto
          .pbkdf2Sync(plainPassword, salt, iterations, 32, 'sha256')
          .toString('base64');

        return derivedKey === expectedHash;
      }
    } catch (e) {
      console.error('Error verifying pbkdf2 password:', e);
      return false;
    }
  }

  // Check if it's a bcrypt hash
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    try {
      return bcrypt.compareSync(plainPassword, storedHash);
    } catch (e) {
      console.error('Error verifying bcrypt password:', e);
      return false;
    }
  }

  // Fallback direct match (not recommended for production, but graceful)
  return plainPassword === storedHash;
}

/**
 * Hashes a password using bcrypt.
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10);
}
