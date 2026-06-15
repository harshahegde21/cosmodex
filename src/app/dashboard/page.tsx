import Navbar from "@/components/navbar/Navbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import ProfileCard from "@/components/dashboard/ProfileCard";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import CrewPromoCard from "@/components/dashboard/CrewPromoCard";
import ExploreMore from "@/components/dashboard/ExploreMore";
import TutorialCards from "@/components/dashboard/TutorialCards";
import InviteFriend from "@/components/dashboard/InviteFriend";
import Footer from "@/components/dashboard/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <Navbar />

      {/* ── Page container ── */}
      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-8 pt-20 relative flex-1">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
          {/* Welcome Banner: Top wide feature (Main Content) */}
          <div className="lg:col-span-2 xl:col-span-3">
            <WelcomeBanner />
          </div>

          {/* Profile Card: Top right (Sidebar) */}
          <div className="lg:col-span-1 xl:col-span-1">
            <ProfileCard />
          </div>

          {/* Tutorial Cards: Main Content */}
          <div className="lg:col-span-2 xl:col-span-3 flex flex-col">
            <TutorialCards />
          </div>

          {/* Upcoming Events: Sidebar */}
          <div className="lg:col-span-1 xl:col-span-1 flex flex-col">
            <UpcomingEvents />
          </div>

          {/* Explore More: Main Content */}
          <div className="lg:col-span-2 xl:col-span-3 flex flex-col">
            <ExploreMore />
          </div>

          {/* Invite Friend: Sidebar */}
          <div className="lg:col-span-1 xl:col-span-1 flex flex-col">
            <InviteFriend />
          </div>

          {/* Crew Promo (Subscription): Full width at the bottom */}
          <div className="lg:col-span-3 xl:col-span-4 flex flex-col">
            <CrewPromoCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
