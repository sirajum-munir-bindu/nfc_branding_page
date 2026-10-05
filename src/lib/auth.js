import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'tapcard-jwt-secret-key-prod-super-secure-2026-auth';
const ACCESS_EXPIRY = '7d';
const REFRESH_EXPIRY = '30d';

export function signTokens(user) {
  const payload = {
    userId: Number(user.id),
    email: user.email,
    role: user.role,
    isStaff: user.isStaff,
    isSuperuser: user.isSuperuser,
  };

  const access = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refresh = jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });

  return { access, refresh };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extracts and authenticates the user from Next.js Request headers.
 */
export async function getAuthUser(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isStaff: true,
        isSuperuser: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      ...user,
      id: Number(user.id),
      full_name: `${user.firstName} ${user.lastName}`.trim() || user.email.split('@')[0],
      is_staff: user.isStaff,
      is_superuser: user.isSuperuser,
    };
  } catch (error) {
    console.error('getAuthUser error:', error);
    return null;
  }
}

/**
 * Ensures user is authenticated and is an Admin or Staff.
 */
export async function requireAdmin(request) {
  const user = await getAuthUser(request);
  if (!user) {
    return { error: 'Authentication credentials were not provided.', status: 401 };
  }

  const isAdminOrStaff = user.isStaff || user.isSuperuser || ['ADMIN', 'STAFF'].includes(user.role);
  if (!isAdminOrStaff) {
    return { error: 'You do not have permission to perform this action.', status: 403 };
  }

  return { user };
}
