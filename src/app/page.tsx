import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CoursesSection from "@/components/landing/CoursesSection";
import BattleArenaSection from "@/components/landing/BattleArenaSection";
import LevelUpSection from "@/components/landing/LevelUpSection";
import JoinClubSection from "@/components/landing/JoinClubSection";
import DevsSection from "@/components/landing/DevsSection";
import Footer from "@/components/landing/Footer";
import ScrollAnimation from "@/components/landing/ScrollAnimation";
import SmoothScroll from "@/components/landing/SmoothScroll";
import ClickParticles from "@/components/landing/ClickParticles";

export default function Home() {
  return (
    <main
      style={{
        background: "#050508",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/*
       * Layer order (z-index):
       *   0   — #050508 body background
       *   1   — ScrollAnimation canvas (fixed, 240-frame scroll animation)
       *   2   — ScrollAnimation vignette overlay (fixed)
       *   3   — All page sections (scroll normally, semi-transparent)
       *   3   — RisingStars canvas (within JoinClub + Devs sections)
       *   50  — Navbar pill
       *   200 — Loading screen (inside ScrollAnimation)
       *  9999 — ClickParticles canvas (fixed, pointer-events: none)
       */}

      {/* Scroll-driven 240-frame animation — fixed behind all content */}
      <ScrollAnimation />

      {/* Lenis smooth scroll (expo ease-out, duration 1.4s) */}
      <SmoothScroll />

      {/* Navigation — Learn / Practice / Pricing / Sign Up */}
      <Navbar />

      {/* Click particle burst effect */}
      <ClickParticles />

      {/*
       * ── ANIMATION ZONE ───────────────────────────────────────────────
       * Sections with semi-transparent backgrounds so the scroll animation
       * bleeds through underneath. The animation canvas fades out after
       * the last section in ANIMATION_SECTION_IDS in ScrollAnimation.tsx.
       */}
      <HeroSection />
      <CoursesSection />
      <BattleArenaSection />
      <LevelUpSection />

      {/*
       * ── SOLID SECTIONS ───────────────────────────────────────────────
       * JoinClub, Devs, and Footer sit after the animation zone and use
       * more opaque backgrounds for readability.
       */}
      <JoinClubSection />
      <DevsSection />

      <div style={{ position: "relative", zIndex: 3, background: "#050508" }}>
        <Footer />
      </div>
    </main>
  );
}
