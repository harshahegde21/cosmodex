"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  BookOpen,
  Code2,
  Hammer,
  Users,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Learn",
    icon: BookOpen,
    href: "#",
    isMegaMenu: true,
  },
  {
    label: "Practice",
    icon: Code2,
    href: "#",
  },
  { label: "Battle", icon: Hammer, href: "/battle" },
  { label: "Leaderboard", icon: Users, href: "/leaderboard" },
];

interface UserSession {
  id: string;
  username: string;
  email: string;
  avatarId?: string | null;
  xpTotal?: number;
  level?: number;
  role?: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/8 bg-white/5 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between px-6 sm:px-10 gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Cosmodex logo"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <span className="font-lato font-black text-xl text-text-primary tracking-wide">
            CosmoDex
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.href && item.href !== "#" ? (
                <Link href={item.href} className="nav-link group flex items-center gap-1.5">
                  <item.icon size={15} className="opacity-70 group-hover:opacity-100" />
                  {item.label}
                  {item.isMegaMenu && (
                    <ChevronDown
                      size={13}
                      className={`ml-0.5 transition-transform duration-150 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
              ) : (
                <button className="nav-link group flex items-center gap-1.5">
                  <item.icon size={15} className="opacity-70 group-hover:opacity-100" />
                  {item.label}
                  {item.isMegaMenu && (
                    <ChevronDown
                      size={13}
                      className={`ml-0.5 transition-transform duration-150 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              )}

              {item.isMegaMenu && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#050508] py-5 px-6 animate-fade-in flex flex-col gap-5 rounded-xl border border-[#E873C3]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8),_0_0_20px_rgba(232,115,195,0.15)]">
                  <h4 className="text-[11px] font-bold text-[#E873C3] uppercase tracking-widest">Recommended</h4>

                  <Link href="#" className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-lg bg-[#2e1065]/50 shrink-0 border border-[#8b5cf6]/30 overflow-hidden flex items-center justify-center">
                      <BookOpen size={24} className="text-[#8b5cf6]" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-[#E873C3] transition-colors">Python</h5>
                      <p className="text-xs text-white/60 mt-1 leading-snug">Learn the basics of programming with beginner-friendly exercises.</p>
                    </div>
                  </Link>

                  <Link href="#" className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 shrink-0 border border-blue-500/30 overflow-hidden flex items-center justify-center">
                      <Code2 size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-[#E873C3] transition-colors">GitHub Copilot</h5>
                      <p className="text-xs text-white/60 mt-1 leading-snug">Learn how to use GitHub Copilot which helps you write code faster and with less effort.</p>
                    </div>
                  </Link>

                  <Link href="/learn" className="mt-2 w-full py-2 bg-[#E873C3]/10 border border-[#E873C3]/30 text-[#E873C3] text-center text-xs font-bold rounded-md hover:bg-[#E873C3]/20 transition-colors shadow-[0_0_15px_rgba(232,115,195,0.15)]">
                    All Courses &gt;
                  </Link>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2">

          {/* Avatar */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 pr-1 py-1">
              <span className="text-sm font-bold text-white/80 hidden sm:inline-block">
                {user.username}
              </span>
              <div className="w-7 h-7 rounded-full bg-bg-elevated border border-[#E873C3] overflow-hidden flex items-center justify-center shadow-[0_0_10px_rgba(232,115,195,0.3)]">
                <Image
                  src="/images/mascot.png"
                  alt="avatar"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-medium overflow-hidden flex items-center justify-center opacity-40">
              <Image
                src="/images/mascot.png"
                alt="avatar"
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
          )}

          {/* Join Crew CTA or Log out */}
          {user ? (
            <button
              onClick={handleLogout}
              className="dashboard-btn-secondary inline-flex items-center px-4 py-1.5 text-sm h-9 border border-white/10 hover:bg-white/5 text-white/90 rounded-md font-bold transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              Log out
            </button>
          ) : (
            <Link href="/onboarding" id="navbar-join-crew" className="dashboard-btn-primary hidden sm:inline-flex px-4 py-1.5 text-sm h-9">
              Join Crew
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="btn-icon md:hidden focus-ring"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-surface px-4 py-3 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href || "#"} className="nav-link w-full">
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border-subtle">
            {user ? (
              <button
                onClick={handleLogout}
                className="btn-secondary w-full justify-center py-2.5 border border-white/10 hover:bg-white/5 text-white/90 rounded-md text-sm font-bold flex"
              >
                Log out
              </button>
            ) : (
              <Link href="/onboarding" className="btn-primary w-full justify-center">
                Join Crew
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
