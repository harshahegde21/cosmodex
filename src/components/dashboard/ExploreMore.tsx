"use client";

import Link from "next/link";
import {
  Layers,
  Rocket,
  Flame,
  Code2,
  ChevronRight,
} from "lucide-react";

const items = [
  {
    id: "explore-challenge-packs",
    icon: Layers,
    title: "Challenge Packs",
    desc: "Practice with bite-sized code challenges.",
    iconBg: "bg-xp-gold/10",
    iconColor: "text-xp-gold",
    href: "#",
  },
  {
    id: "explore-tutorials",
    icon: Rocket,
    title: "Project Tutorials",
    desc: "Fun, step-by-step projects from beginner to advanced.",
    iconBg: "bg-accent/10",
    iconColor: "text-accent-bright",
    href: "#",
  },
  {
    id: "explore-30nites",
    icon: Flame,
    title: "#30NitesOfCode",
    desc: "Commit to 30 days of learning — raise a virtual pet!",
    iconBg: "bg-streak/10",
    iconColor: "text-streak",
    href: "#",
  },
  {
    id: "explore-builds",
    icon: Code2,
    title: "Builds",
    desc: "Create and share code snippets directly in the browser.",
    iconBg: "bg-badge/10",
    iconColor: "text-badge",
    href: "#",
  },
];

export default function ExploreMore() {
  return (
    <section id="explore" className="h-full flex flex-col">
      {/* Heading */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-black text-text-primary tracking-tight">Explore More</h2>
        <Link
          href="#"
          id="explore-see-all"
          className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors duration-300 flex items-center gap-0.5 group/link"
        >
          See all <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 2×2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {items.map((item) => (
          <Link
            key={item.id}
            id={item.id}
            href={item.href}
            className="bento-card-interactive group/card flex items-center gap-5 p-6 h-full"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-pattern-sm opacity-10 pointer-events-none mix-blend-overlay" />
            
            {/* Hover glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[30px] opacity-0 group-hover/card:opacity-20 transition-opacity duration-500 pointer-events-none ${item.iconBg.replace('bg-', 'bg-')}`} />

            {/* Premium Icon Container */}
            <div className={`relative z-10 shrink-0 w-14 h-14 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center transition-all duration-300 group-hover/card:scale-110 shadow-inset group-hover/card:border-white/20`}>
              <item.icon size={24} className={`${item.iconColor} drop-shadow-glow`} />
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex-1 min-w-0">
              <p className="font-bold text-white text-base leading-snug group-hover/card:text-accent-bright transition-colors">
                {item.title}
              </p>
              <p className="text-[13px] text-text-secondary mt-1.5 leading-relaxed group-hover/card:text-text-secondary/80">
                {item.desc}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight
              size={18}
              className={`relative z-10 shrink-0 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-1 transition-all duration-300 ${item.iconColor}`}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
