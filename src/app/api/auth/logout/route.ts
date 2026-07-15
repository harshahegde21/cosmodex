import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'cosmo_session';

const AUTH_COOKIES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'authjs.callback-url',
  '__Secure-authjs.callback-url',
  'next-auth.callback-url',
  '__Secure-next-auth.callback-url',
  'authjs.csrf-token',
  '__Secure-authjs.csrf-token',
  'next-auth.csrf-token',
  '__Secure-next-auth.csrf-token',
];

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  for (const cookieName of AUTH_COOKIES) {
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
  }

  return response;
}
