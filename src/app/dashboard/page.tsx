import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import Navbar from "@/components/navbar/Navbar";
import DashboardBackground from "@/components/dashboard/DashboardBackground";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import GetStartedCard from "@/components/dashboard/GetStartedCard";
import Achievements from "@/components/dashboard/Achievements";
import ProfileCard from "@/components/dashboard/ProfileCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CrewPromoCard from "@/components/dashboard/CrewPromoCard";
import Footer from "@/components/dashboard/Footer";

const SESSION_COOKIE = 'cosmo_session';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  let username = 'Explorer';
  let level = 1;
  let xpTotal = 0;
  let avatarId: string | null = null;
  let experienceLevel: string | null = 'Beginner';
  let userId: string | null = null;

  if (session?.value) {
    try {
      const user = JSON.parse(session.value);
      username = user.username || username;
      level = user.level ?? level;
      xpTotal = user.xpTotal ?? xpTotal;
      avatarId = user.avatarId || null;
      experienceLevel = user.experienceLevel || experienceLevel;
      userId = user.userId || null;
    } catch (e) {
      console.error('Error parsing session cookie:', e);
    }
  }

  // Fetch dynamic data server-side in parallel
  let streak = 0;
  let badgeCount = 0;
  let badges: Array<{ id: string; name: string; description: string | null; earnedAt: string | null }> = [];
  let activities: Array<{ id: string; type: string; label: string; timestamp: string; xp?: number }> = [];
  let enrollments: Array<{
    id: string;
    languageName: string;
    languageCode: string;
    iconUrl: string | null;
    currentModuleTitle: string | null;
  }> = [];

  if (userId) {
    try {
      const [arenaStats, userBadges, recentProgress, userEnrollments] = await Promise.all([
        prisma.arena_stats.findUnique({
          where: { user_id: userId },
          select: { current_streak: true, total_xp: true, total_solved: true },
        }),
        prisma.user_badges.findMany({
          where: { user_id: userId },
          include: {
            badges: { select: { name: true, description: true, badge_type: true } },
          },
          orderBy: { earned_at: 'desc' },
          take: 10,
        }),
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
          take: 8,
        }),
        prisma.enrollments.findMany({
          where: { user_id: userId, is_active: true },
          include: {
            languages: { select: { id: true, name: true, code: true, icon_url: true } },
            modules: { select: { title: true } },
          },
          orderBy: { enrolled_at: 'desc' },
          take: 5,
        }),
      ]);

      streak = arenaStats?.current_streak ?? 0;
      badgeCount = userBadges.length;

      badges = userBadges.map((ub) => ({
        id: ub.id,
        name: ub.badges.name,
        description: ub.badges.description ?? null,
        earnedAt: ub.earned_at?.toISOString() ?? null,
      }));

      // Build activity feed
      const activityList: typeof activities = [];
      for (const p of recentProgress.slice(0, 5)) {
        activityList.push({
          id: p.id,
          type: 'lesson',
          label: `Completed ${p.modules?.title ?? 'a lesson'} in ${p.modules?.languages?.name ?? 'a course'}`,
          timestamp: p.completed_at?.toISOString() ?? new Date().toISOString(),
          xp: p.xp_earned ?? 0,
        });
      }
      for (const ub of userBadges.slice(0, 3)) {
        activityList.push({
          id: ub.id,
          type: 'badge',
          label: `Earned badge: ${ub.badges.name}`,
          timestamp: ub.earned_at?.toISOString() ?? new Date().toISOString(),
        });
      }
      activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      activities = activityList.slice(0, 8);

      enrollments = userEnrollments.map((e) => ({
        id: e.id,
        languageName: e.languages.name,
        languageCode: e.languages.code,
        iconUrl: e.languages.icon_url ?? null,
        currentModuleTitle: e.modules?.title ?? null,
      }));
    } catch (e) {
      console.error('[dashboard] Failed to fetch user stats:', e);
    }
  }

  return (
    <div className="min-h-screen bg-[#080312] flex flex-col relative overflow-x-hidden">
      <Navbar />
      <DashboardBackground />

      <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-8 pt-24 relative flex-1 z-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <WelcomeBanner username={username} />
            <GetStartedCard enrollments={enrollments} />
            <Achievements badges={badges} />
            
            {/* Subscription Promo inside left column to avoid empty space */}
            <CrewPromoCard />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ProfileCard 
              username={username}
              level={level}
              xpTotal={xpTotal}
              avatarId={avatarId}
              experienceLevel={experienceLevel}
              streak={streak}
              badgeCount={badgeCount}
            />
            <ActivityFeed activities={activities} />
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
