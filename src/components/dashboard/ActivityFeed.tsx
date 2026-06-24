"use client";

import { Trophy, Flame, CheckCircle2 } from "lucide-react";

export default function ActivityFeed() {
  return (
    <div className="cosmo-glass-panel p-6 border border-white/10 h-full">
      <h2 className="text-lg font-bold font-display text-white mb-6 tracking-wide">Activity Feed</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#E873C3]/20 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(232,115,195,0.3)] border border-[#E873C3]/30">
            <Trophy size={14} className="text-[#E873C3]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white/90">You earned 50 XP</p>
            <p className="text-[12px] text-white/40 mt-1">2h ago</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#FF4500]/20 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(255,69,0,0.3)] border border-[#FF4500]/30">
            <Flame size={14} className="text-[#FF4500]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white/90">7 Day Streak achieved!</p>
            <p className="text-[12px] text-white/40 mt-1">1d ago</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-[#10B981]/30">
            <CheckCircle2 size={14} className="text-[#10B981]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white/90">Completed Variables and Data Types</p>
            <p className="text-[12px] text-white/40 mt-1">2d ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
