import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { verifyPassword, hashPassword } from '@/lib/passwords';

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const oldPassword = (body.old_password || '').trim();
    const newPassword = (body.new_password || '').trim();
    const confirmPassword = (body.confirm_password || '').trim();

    if (!oldPassword) {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
    }

    // Fetch stored password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: BigInt(user.id) },
    });

    if (!dbUser || !verifyPassword(oldPassword, dbUser.password)) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    if (!newPassword) {
      return NextResponse.json({ error: 'New password is required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: BigInt(user.id) },
      data: { password: newHash },
    });

    return NextResponse.json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
