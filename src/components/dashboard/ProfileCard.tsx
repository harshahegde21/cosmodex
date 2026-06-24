"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Flame, Shield, Award } from "lucide-react";

const stats = [
  { icon: Star, label: "TOTAL XP", value: "1,240", color: "text-[#FFD700]", glowColor: "rgba(255,215,0,0.6)" },
  { icon: Flame, label: "DAY STREAK", value: "7", color: "text-orange-500", glowColor: "rgba(249,115,22,0.6)" },
  { icon: Shield, label: "RANK", value: "Bronze", color: "text-[#CD7F32]", glowColor: "rgba(205,127,50,0.6)" },
  { icon: Award, label: "BADGES", value: "3", color: "text-cyan-400", glowColor: "rgba(34,211,238,0.6)" },
];

export default function ProfileCard() {
  return (
    <div className="cosmo-glass-panel p-6 border border-white/10">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full border-2 border-[#E873C3] overflow-hidden bg-gradient-to-br from-[#E873C3] to-[#8D37D6] flex items-center justify-center shadow-[0_0_20px_rgba(232,115,195,0.3)]">
            <Image
              src="/images/mascot.png"
              alt="User avatar"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-white truncate text-xl">
            priyanshu
          </p>
          <div className="mt-1">
            <span className="inline-flex items-center text-[#E873C3] font-bold text-xs px-3 py-1 rounded-full bg-[#E873C3]/10 border border-[#E873C3]/20">
              Level 1
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-6 pt-5 border-t border-white/10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Current Progress</p>
            <p className="text-sm font-medium text-white/80">
              <span className="text-white font-bold">1,240</span> / 2,000 ✦
            </p>
          </div>
          <p className="text-sm font-medium text-white/60 mb-0.5">to Level 2</p>
        </div>
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#E873C3] shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            style={{ width: "62%" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5"
          >
            <div className={`${s.color} mt-0.5`} style={{ filter: `drop-shadow(0 0 8px ${s.glowColor})` }}>
              <s.icon size={18} fill="currentColor" />
            </div>
            <div>
              <p className="font-bold text-white text-xl leading-none">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/profile"
        id="profile-view"
        className="cosmo-btn-secondary w-full py-3.5 rounded-xl text-sm font-bold text-white text-center mt-6"
      >
        View Profile
      </Link>
    </div>
  );
}
