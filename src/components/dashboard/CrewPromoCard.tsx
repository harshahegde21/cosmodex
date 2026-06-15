"use client";

import { Users, Sparkles, ArrowRight, X } from "lucide-react";
import { useState } from "react";

export default function CrewPromoCard() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bento-card-interactive p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 justify-between relative group overflow-hidden h-full">
      {/* Background Glows & Gradients */}
      <div className="absolute inset-0 bg-accent-gradient opacity-10 mix-blend-overlay" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent-bright to-transparent opacity-80" />

      {/* Dismiss */}
      <button
        id="crew-promo-dismiss"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all duration-300 z-20 backdrop-blur-md border border-white/5"
      >
        <X size={14} />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start gap-4 flex-1">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-accent-bright/20 border border-accent-bright/30 flex items-center justify-center shadow-glow backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
            <Users size={22} className="text-white drop-shadow-md" />
          </div>
          <span className="badge bg-white/10 border border-white/20 text-white text-xs px-3 py-1 font-black tracking-widest shadow-sm">
            PRO
          </span>
        </div>

        <div>
          <h3 className="font-black text-white text-xl md:text-2xl leading-tight mb-2 drop-shadow-md">
            Get unlimited access to learning
          </h3>
          <p className="text-base text-white/80 leading-relaxed max-w-lg">
            Join a Crew to unlock all courses, get help from code experts, and access exclusive content.
          </p>

          {/* Perks */}
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "All courses & tracks unlocked",
              "Expert code reviews",
              "Exclusive crew challenges",
              "Priority live Q&A",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm text-white/90">
                <Sparkles size={14} className="text-xp-gold shrink-0 drop-shadow-sm" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 shrink-0 w-full md:w-auto mt-2 md:mt-0">
        <button
          id="crew-promo-learn-more"
          className="w-full md:w-auto px-8 py-4 bg-white text-bg-base font-black rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Learn More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
