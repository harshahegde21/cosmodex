import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/battle/leaderboard
 * Returns top 20 players by ELO from battle_user_stats joined with users.
 * Query: ?mode=code|mcq (default: code)
 */
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('mode') === 'mcq' ? 'mcq' : 'code';

  try {
    const stats = await prisma.battle_user_stats.findMany({
      orderBy: {
        [mode === 'mcq' ? 'mcq_elo_rating' : 'elo_rating']: 'desc',
      },
      take: 20,
      include: {
        users: {
          select: {
            username: true,
          },
        },
      },
    });

    const entries = stats.map((item, idx) => ({
      rank: idx + 1,
      userId: item.user_id,
      username: item.users?.username ?? 'Anonymous',
      elo: mode === 'mcq' ? item.mcq_elo_rating : item.elo_rating,
      wins: item.wins,
      losses: item.losses,
      draws: item.draws,
    }));

    return NextResponse.json(entries);
  } catch (err) {
    console.error('[battle/leaderboard]', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
