"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Flame, Shield, Award, Edit2 } from "lucide-react";

const stats = [
  { icon: Star, label: "Total XP", value: "1,240", color: "text-xp-gold", glow: "rgba(245,200,66,0.3)" },
  { icon: Flame, label: "Day Streak", value: "7", color: "text-streak", glow: "rgba(255,107,53,0.3)" },
  { icon: Shield, label: "Rank", value: "Bronze", color: "text-text-primary", glow: "rgba(255,255,255,0.2)" },
  { icon: Award, label: "Badges", value: "3", color: "text-badge", glow: "rgba(78,205,196,0.3)" },
];

export default function ProfileCard() {
  return (
    <div className="relative w-full h-full rounded-[24px] overflow-hidden group flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-[#161324] via-[#100D1C] to-[#0B0A10]" />

      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-accent/40 rounded-full blur-[80px] group-hover:bg-accent-bright/50 transition-colors duration-1000" />
        <div className="absolute bottom-0 -left-10 w-[150px] h-[150px] bg-blue-500/20 rounded-full blur-[60px]" />
      </div>

      <div className="absolute inset-0 bg-grid-pattern-sm opacity-[0.15] mix-blend-overlay pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="absolute inset-0 rounded-[24px] border border-white/[0.06] group-hover:border-white/[0.1] transition-colors duration-500 pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full flex-1 gap-6">
        
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500 ease-out">
            <div className="absolute inset-0 rounded-full bg-accent/30 blur-md scale-110 animate-pulse-slow" />
            <div className="relative w-16 h-16 rounded-full border-[2.5px] border-accent/80 overflow-hidden shadow-[0_0_15px_rgba(158,0,246,0.5)]">
              <Image
                src="/images/mascot.png"
                alt="User avatar"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0.5 w-4 h-4 rounded-full bg-success border-[2.5px] border-[#161324] shadow-[0_0_8px_rgba(61,203,127,0.6)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-black text-white truncate text-[22px] tracking-tight drop-shadow-sm">
                @priyanshu
              </p>
              <button
                id="profile-edit"
                aria-label="Edit profile"
                className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shrink-0"
              >
                <Edit2 size={13} />
              </button>
            </div>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center gap-1.5 bg-accent/[0.15] border border-accent/30 text-accent-bright font-bold text-xs px-3 py-1 rounded-full shadow-[inset_0_0_10px_rgba(158,0,246,0.2)]">
                Level 1
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-text-secondary text-xs font-bold uppercase tracking-wider">XP to Level 2</span>
            <span className="text-xp-gold font-black text-sm drop-shadow-[0_0_8px_rgba(245,200,66,0.4)]">
              1,240 <span className="text-text-muted font-bold">/ 2,000</span>
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#0B0A10] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] border border-white/[0.05]">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright shadow-[0_0_15px_rgba(158,0,246,0.8)] relative overflow-hidden" style={{ width: "62%" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 min-h-[160px]">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col justify-center gap-2 bg-white/[0.02] rounded-[16px] p-4 border border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 group/stat relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${s.glow} 0%, transparent 70%)` }}
              />
              
              <div className="relative z-10 flex items-center gap-2">
                <s.icon size={15} className={`${s.color} drop-shadow-md group-hover/stat:scale-110 transition-transform duration-300`} />
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
              </div>
              <p className={`relative z-10 font-black text-2xl leading-none ${s.color} drop-shadow-lg`}>{s.value}</p>
            </div>
          ))}
        </div>

        <Link
          href="#"
          id="profile-view"
          className="mt-2 w-full py-3.5 rounded-xl text-sm font-bold text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-center transition-all duration-300 shadow-sm"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
