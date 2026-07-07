import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import ProfileContent from './ProfileContent';

const SESSION_COOKIE = 'cosmo_session';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  // Default fallback values
  let userId: string | null = null;
  let username = 'Explorer';
  let email = '';
  let createdAt: string | null = null;
  let interests: string[] = [];
  let xpTotal = 0;
  let level = 1;
  let experienceLevel: string | null = 'Beginner';
  let streak = 0;
  let badgeCount = 0;
  let badges: Array<{ id: string; name: string; description: string | null; earnedAt: string | null }> = [];

  if (session?.value) {
    try {
      const parsed = JSON.parse(session.value);
      userId = parsed.userId || null;
      username = parsed.username || username;
      email = parsed.email || '';
      createdAt = parsed.createdAt || null;
      interests = parsed.interests || [];
      xpTotal = parsed.xpTotal ?? xpTotal;
      level = parsed.level ?? level;
      experienceLevel = parsed.experienceLevel || experienceLevel;
    } catch (e) {
      console.error('[profile] Error parsing session cookie:', e);
    }
  }

  // Fetch live data from DB
  if (userId) {
    try {
      const [dbUser, arenaStats, userBadges] = await Promise.all([
        prisma.users.findUnique({
          where: { id: userId },
          select: {
            username: true,
            email: true,
            interests: true,
            xp_total: true,
            level: true,
            experience_level: true,
            created_at: true,
          },
        }),
        prisma.arena_stats.findUnique({
          where: { user_id: userId },
          select: { current_streak: true },
        }),
        prisma.user_badges.findMany({
          where: { user_id: userId },
          include: { badges: { select: { name: true, description: true } } },
          orderBy: { earned_at: 'desc' },
          take: 20,
        }),
      ]);

      if (dbUser) {
        username = dbUser.username;
        email = dbUser.email;
        interests = dbUser.interests ?? [];
        xpTotal = dbUser.xp_total ?? 0;
        level = dbUser.level ?? 1;
        experienceLevel = dbUser.experience_level ?? 'Beginner';
        createdAt = dbUser.created_at?.toISOString() ?? createdAt;
      }

      streak = arenaStats?.current_streak ?? 0;
      badgeCount = userBadges.length;
      badges = userBadges.map((ub) => ({
        id: ub.id,
        name: ub.badges.name,
        description: ub.badges.description ?? null,
        earnedAt: ub.earned_at?.toISOString() ?? null,
      }));
    } catch (e) {
      console.error('[profile] Failed to fetch DB data:', e);
    }
  }

  // Compute star points (simplified: xpTotal / 13 rounded)
  const starPoints = Math.floor(xpTotal / 13);
  // Rank threshold toward next tier
  const rankThreshold = 200;

  return (
    <ProfileContent
      userId={userId}
      username={username}
      email={email}
      createdAt={createdAt}
      interests={interests}
      xpTotal={xpTotal}
      level={level}
      experienceLevel={experienceLevel}
      streak={streak}
      badgeCount={badgeCount}
      badges={badges}
      starPoints={starPoints}
      rankThreshold={rankThreshold}
    />
  );
}