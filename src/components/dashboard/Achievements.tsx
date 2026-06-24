"use client";

import { Flame, Rocket, Code2, CheckCircle2 } from "lucide-react";

export default function Achievements() {
  const achievements = [
    {
      id: "7-day-streak",
      title: "7 Day Streak",
      desc: "Keep it up!",
      icon: Flame,
      color: "#9333EA",
      status: "Completed",
    },
    {
      id: "first-steps",
      title: "First Steps",
      desc: "Complete your first lesson",
      icon: Rocket,
      color: "#3B82F6",
      status: "Completed",
    },
    {
      id: "problem-solver",
      title: "Problem Solver",
      desc: "Solve 10 problems",
      icon: Code2,
      color: "#10B981",
      status: "6/10",
      progress: 60,
    },
  ];

  return (
    <section className="cosmo-glass-panel p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-bold font-display text-white tracking-wide">Achievements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {achievements.map((item) => {
          const Icon = item.icon;
          const isCompleted = item.status === "Completed";
          return (
            <div
              key={item.id}
              className="relative flex items-center bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/15 hover:bg-white/8 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mr-4"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <Icon size={20} color={item.color} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                <p className="text-[11px] text-white/50 truncate mt-0.5">{item.desc}</p>
              </div>

              <div className="shrink-0 ml-3">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/30">
                    <CheckCircle2 size={12} className="text-[#10B981]" />
                  </div>
                ) : (
                  <div className="text-xs font-bold text-white/70 bg-white/5 px-2 py-1 rounded-md">
                    {item.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
