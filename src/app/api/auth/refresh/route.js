import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signTokens } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { refresh } = body;

    if (!refresh) {
      return NextResponse.json({ error: 'Refresh token is required.' }, { status: 400 });
    }

    const decoded = verifyToken(refresh);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'User not found or inactive.' }, { status: 401 });
    }

    const tokens = signTokens(user);
    return NextResponse.json({ access: tokens.access });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
