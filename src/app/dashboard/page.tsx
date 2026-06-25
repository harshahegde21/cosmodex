import DashboardBackground from "@/components/dashboard/DashboardBackground";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import GetStartedCard from "@/components/dashboard/GetStartedCard";
import Achievements from "@/components/dashboard/Achievements";
import ProfileCard from "@/components/dashboard/ProfileCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import CrewPromoCard from "@/components/dashboard/CrewPromoCard";
import Footer from "@/components/dashboard/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#080312] flex flex-col relative overflow-x-hidden">
      <DashboardBackground />

      <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-8 pt-24 relative flex-1 z-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <WelcomeBanner />
            <GetStartedCard />
            <Achievements />
            
            {/* Subscription Promo inside left column to avoid empty space */}
            <CrewPromoCard />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ProfileCard />
            <ActivityFeed />
          </div>

        </div>


      </main>

      <Footer />
    </div>
  );
}
