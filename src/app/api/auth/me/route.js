import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
