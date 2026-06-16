"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Flame, Shield, Award, Edit2 } from "lucide-react";

const stats = [
  { icon: Star, label: "Total XP", value: "1,240", color: "text-xp-gold" },
  { icon: Flame, label: "Day Streak", value: "7", color: "text-streak" },
  { icon: Shield, label: "Rank", value: "Bronze", color: "text-text-secondary" },
  { icon: Award, label: "Badges", value: "3", color: "text-badge" },
];

export default function ProfileCard() {
  return (
    <div className="bento-card-interactive p-6 flex flex-col gap-6 h-full group">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern-sm opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Avatar + name */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-300">
          <div className="w-14 h-14 rounded-full border-2 border-accent/60 overflow-hidden shadow-glow">
            <Image
              src="/images/mascot.png"
              alt="User avatar"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-[#1A1835] shadow-[0_0_8px_rgba(61,203,127,0.5)]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-text-primary truncate text-lg tracking-tight">
              @priyanshu
            </p>
            <button
              id="profile-edit"
              aria-label="Edit profile"
              className="text-text-muted hover:text-accent-bright transition-colors duration-150 shrink-0"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="badge bg-accent/20 border border-accent/30 text-accent-bright text-xs px-2.5 py-0.5 shadow-[inset_0_0_10px_rgba(158,0,246,0.2)]">
              Level 1
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/5 relative z-10" />

      {/* XP progress */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex justify-between text-xs tracking-wide">
          <span className="text-text-secondary font-bold">XP to Level 2</span>
          <span className="text-xp-gold font-black drop-shadow-[0_0_8px_rgba(245,200,66,0.4)]">1,240 / 2,000</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-pill overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          <div className="h-full rounded-pill bg-accent-gradient shadow-[0_0_10px_rgba(158,0,246,0.6)] relative overflow-hidden" style={{ width: "62%" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1.5 bg-white/[0.02] rounded-xl p-3 border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group/stat"
          >
            <div className="flex items-center gap-2">
              <s.icon size={14} className={`${s.color} drop-shadow-md group-hover/stat:scale-110 transition-transform`} />
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
            </div>
            <p className={`font-black text-xl leading-none ${s.color} drop-shadow-lg`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* View profile CTA */}
      <Link
        href="#"
        id="profile-view"
        className="mt-auto relative z-10 w-full py-3 rounded-lg text-xs font-bold text-text-secondary hover:text-text-primary bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-center transition-all duration-300"
      >
        View Profile
      </Link>
    </div>
  );
}
