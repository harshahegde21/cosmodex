import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const SESSION_COOKIE = 'cosmo_session';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let userId: string;
    try {
      const session = JSON.parse(sessionCookie.value);
      userId = session.userId;
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'No user ID in session' }, { status: 401 });
    }

    // Fetch all data in parallel
    const [arenaStats, userBadges, recentProgress, enrollments] = await Promise.all([
      // Arena stats: streak, total XP, problems solved
      prisma.arena_stats.findUnique({
        where: { user_id: userId },
        select: {
          current_streak: true,
          best_streak: true,
          total_xp: true,
          total_solved: true,
          last_played_at: true,
        },
      }),

      // User badges
      prisma.user_badges.findMany({
        where: { user_id: userId },
        include: {
          badges: {
            select: {
              name: true,
              description: true,
              badge_type: true,
              section: true,
            },
          },
        },
        orderBy: { earned_at: 'desc' },
        take: 10,
      }),

      // Recent progress (completed lessons)
      prisma.progress.findMany({
        where: { user_id: userId, is_correct: true },
        include: {
          modules: {
            select: {
              title: true,
              languages: { select: { name: true } },
            },
          },
        },
        orderBy: { completed_at: 'desc' },
        take: 10,
      }),

      // Enrollments with current language & module
      prisma.enrollments.findMany({
        where: { user_id: userId, is_active: true },
        include: {
          languages: { select: { id: true, name: true, code: true, icon_url: true } },
          modules: { select: { id: true, title: true, description: true } },
        },
        orderBy: { enrolled_at: 'desc' },
        take: 5,
      }),
    ]);

    // Build activity feed from progress + badge events
    type ActivityItem = {
      id: string;
      type: 'lesson' | 'badge' | 'xp';
      label: string;
      timestamp: string;
      xp?: number;
    };
    const activities: ActivityItem[] = [];

    // Add recent progress items
    for (const p of recentProgress.slice(0, 5)) {
      activities.push({
        id: p.id,
        type: 'lesson',
        label: `Completed ${p.modules?.title ?? 'a lesson'} in ${p.modules?.languages?.name ?? 'a course'}`,
        timestamp: p.completed_at?.toISOString() ?? new Date().toISOString(),
        xp: p.xp_earned ?? 0,
      });
    }

    // Add badge earned events
    for (const ub of userBadges.slice(0, 3)) {
      activities.push({
        id: ub.id,
        type: 'badge',
        label: `Earned badge: ${ub.badges.name}`,
        timestamp: ub.earned_at?.toISOString() ?? new Date().toISOString(),
      });
    }

    // Sort by timestamp desc
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      streak: arenaStats?.current_streak ?? 0,
      bestStreak: arenaStats?.best_streak ?? 0,
      arenaXp: arenaStats?.total_xp ?? 0,
      totalSolved: arenaStats?.total_solved ?? 0,
      badgeCount: userBadges.length,
      badges: userBadges.map((ub) => ({
        id: ub.id,
        name: ub.badges.name,
        description: ub.badges.description,
        type: ub.badges.badge_type,
        section: ub.badges.section,
        earnedAt: ub.earned_at?.toISOString() ?? null,
      })),
      activities: activities.slice(0, 8),
      enrollments: enrollments.map((e) => ({
        id: e.id,
        languageId: e.languages.id,
        languageName: e.languages.name,
        languageCode: e.languages.code,
        iconUrl: e.languages.icon_url,
        currentModuleTitle: e.modules?.title ?? null,
        enrolledAt: e.enrolled_at?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    console.error('[user/stats] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
