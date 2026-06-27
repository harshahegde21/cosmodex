import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'cosmo_session';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(SESSION_COOKIE);

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
