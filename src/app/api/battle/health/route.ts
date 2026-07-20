import { NextResponse } from 'next/server';

const BATTLE_URL = process.env.BATTLE_ARENA_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const res = await fetch(`${BATTLE_URL}/health`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { status: 'UNREACHABLE', services: { database: 'UNKNOWN', cache: 'UNKNOWN' } },
      { status: 503 }
    );
  }
}
