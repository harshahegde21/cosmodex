"use client";

import { Trophy, Flame, CheckCircle2, Award, Zap } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  label: string;
  timestamp: string;
  xp?: number;
}

interface ActivityFeedProps {
  activities?: Activity[];
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'badge':
      return { Icon: Award, bg: 'bg-[#FFD700]/20', border: 'border-[#FFD700]/30', color: 'text-[#FFD700]' };
    case 'xp':
      return { Icon: Zap, bg: 'bg-[#E873C3]/20', border: 'border-[#E873C3]/30', color: 'text-[#E873C3]' };
    case 'streak':
      return { Icon: Flame, bg: 'bg-[#FF4500]/20', border: 'border-[#FF4500]/30', color: 'text-[#FF4500]' };
    case 'lesson':
    default:
      return { Icon: CheckCircle2, bg: 'bg-[#10B981]/20', border: 'border-[#10B981]/30', color: 'text-[#10B981]' };
  }
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

export default function ActivityFeed({ activities = [] }: ActivityFeedProps) {
  return (
    <div className="cosmo-glass-panel p-6 border border-white/10 h-full">
      <h2 className="text-lg font-bold font-display text-white mb-6 tracking-wide">Activity Feed</h2>

      {activities.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Trophy size={20} className="text-white/20" />
          </div>
          <p className="text-white/50 font-medium text-sm">No activity yet.</p>
          <p className="text-white/30 text-xs mt-1">Start a lesson to see your progress here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activities.map((item) => {
            const { Icon, bg, border, color } = getActivityIcon(item.type);
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0 mt-1 border ${border}`}>
                  <Icon size={14} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-white/90 leading-snug">{item.label}</p>
                  {item.xp && item.xp > 0 && (
                    <p className="text-[11px] text-[#FFD700]/70 font-semibold mt-0.5">+{item.xp} XP</p>
                  )}
                  <p className="text-[12px] text-white/40 mt-1">{formatRelativeTime(item.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
