import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/passwords';
import { signTokens } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Both email and password are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email.trim(), mode: 'insensitive' },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'User account is disabled.' },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const isAdminOrStaff =
      user.isStaff || user.isSuperuser || ['ADMIN', 'STAFF'].includes(user.role);
    if (!isAdminOrStaff) {
      return NextResponse.json(
        { error: 'Access restricted to administrators only.' },
        { status: 403 }
      );
    }

    // Update lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = signTokens(user);

    const userData = {
      id: Number(user.id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`.trim() || user.email.split('@')[0],
      isStaff: user.isStaff,
      isSuperuser: user.isSuperuser,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      tokens,
    });

    // Set secure cookie for server components and protected navigation
    response.cookies.set({
      name: 'tapcard_admin_token',
      value: tokens.access,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
