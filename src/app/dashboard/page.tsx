import { cookies } from 'next/headers';
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

  let username = 'priyanshu';
  let level = 1;
  let xpTotal = 1240;
  let avatarId: string | null = null;
  let experienceLevel: string | null = 'Beginner';

  if (session?.value) {
    try {
      const user = JSON.parse(session.value);
      username = user.username || username;
      level = user.level ?? level;
      xpTotal = user.xpTotal ?? xpTotal;
      avatarId = user.avatarId || null;
      experienceLevel = user.experienceLevel || experienceLevel;
    } catch (e) {
      console.error('Error parsing session cookie:', e);
    }
  }

  return (
    <div className="min-h-screen bg-[#080312] flex flex-col relative overflow-x-hidden">
      <DashboardBackground />

      <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-8 pt-24 relative flex-1 z-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <WelcomeBanner username={username} />
            <GetStartedCard />
            <Achievements />
            
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
            />
            <ActivityFeed />
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
