import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  
  response.cookies.set({
    name: 'tapcard_admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: 'birthday_admin_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
