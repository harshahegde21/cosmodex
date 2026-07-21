import { NextRequest, NextResponse } from 'next/server';

const BATTLE_URL = process.env.BATTLE_ARENA_URL || 'http://localhost:3001';
const SESSION_COOKIE = 'cosmo_session';

export async function POST(req: NextRequest) {
  // Verify the caller is authenticated
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(`${BATTLE_URL}/api/room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Battle Arena backend unreachable' }, { status: 503 });
  }
}
