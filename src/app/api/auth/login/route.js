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
        { non_field_errors: ['Both email and password are required.'] },
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
        { non_field_errors: ['Invalid email or password.'] },
        { status: 400 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { non_field_errors: ['User account is disabled.'] },
        { status: 400 }
      );
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { non_field_errors: ['Invalid email or password.'] },
        { status: 400 }
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
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      role: user.role,
      full_name: `${user.firstName} ${user.lastName}`.trim() || user.email.split('@')[0],
      is_staff: user.isStaff,
      is_superuser: user.isSuperuser,
      created_at: user.createdAt,
    };

    return NextResponse.json({
      user: userData,
      tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
