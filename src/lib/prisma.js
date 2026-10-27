import { PrismaClient } from '@prisma/client';

// Polyfill BigInt serialization for Next.js JSON responses
if (typeof BigInt !== 'undefined' && !BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () {
    return Number(this);
  };
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });

if (!globalForPrisma.prismaLoggerAttached) {
  prisma.$on?.('error', (e) => {
    // Ignore transient pooler closed socket reconnects from Neon
    if (e?.message && e.message.includes('kind: Closed')) return;
    console.error('prisma:error', e?.message || e);
  });
  prisma.$on?.('warn', (e) => {
    console.warn('prisma:warn', e?.message || e);
  });
  globalForPrisma.prismaLoggerAttached = true;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
