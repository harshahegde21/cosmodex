"use client";

import { Flame, Rocket, Code2, CheckCircle2, Award, Star, Zap, Shield } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string | null;
  earnedAt: string | null;
}

interface AchievementsProps {
  badges?: Badge[];
}

// Map badge names to icons and colors
function getBadgeStyle(name: string): { icon: typeof Flame; color: string } {
  const lower = name.toLowerCase();
  if (lower.includes('streak') || lower.includes('fire')) return { icon: Flame, color: '#9333EA' };
  if (lower.includes('first') || lower.includes('start')) return { icon: Rocket, color: '#3B82F6' };
  if (lower.includes('code') || lower.includes('problem') || lower.includes('solv')) return { icon: Code2, color: '#10B981' };
  if (lower.includes('star') || lower.includes('gold')) return { icon: Star, color: '#FFD700' };
  if (lower.includes('shield') || lower.includes('rank')) return { icon: Shield, color: '#CD7F32' };
  if (lower.includes('zap') || lower.includes('speed')) return { icon: Zap, color: '#E873C3' };
  return { icon: Award, color: '#06B6D4' };
}

export default function Achievements({ badges = [] }: AchievementsProps) {
  return (
    <section className="cosmo-glass-panel p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-bold font-display text-white tracking-wide">Achievements</h2>
        {badges.length > 0 && (
          <span className="text-xs font-bold text-white/50 bg-white/5 px-2 py-1 rounded-md border border-white/10">
            {badges.length} earned
          </span>
        )}
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Award size={20} className="text-white/20" />
          </div>
          <p className="text-white/50 font-medium text-sm">No achievements yet.</p>
          <p className="text-white/30 text-xs mt-1">Complete lessons and challenges to earn badges!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const { icon: Icon, color } = getBadgeStyle(badge.name);
            return (
              <div
                key={badge.id}
                className="relative flex items-center bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/15 hover:bg-white/8 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mr-4"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon size={20} color={color} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{badge.name}</h3>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">
                    {badge.description ?? 'Achievement unlocked'}
                  </p>
                </div>

                <div className="shrink-0 ml-3">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/30">
                    <CheckCircle2 size={12} className="text-[#10B981]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
