import { NextRequest, NextResponse } from 'next/server';

const BATTLE_URL = process.env.BATTLE_ARENA_URL || 'http://localhost:3001';

export async function GET(req: NextRequest) {
  try {
    const difficulty = req.nextUrl.searchParams.get('difficulty');
    const url = new URL(`${BATTLE_URL}/api/problems`);
    if (difficulty) url.searchParams.set('difficulty', difficulty);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Battle Arena backend unreachable' }, { status: 503 });
  }
}
