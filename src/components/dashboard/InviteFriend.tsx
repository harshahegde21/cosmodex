"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

export default function InviteFriend() {
  const [copied, setCopied] = useState(false);
  const referralCode = "COSMO-ASTRO42";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bento-card-interactive p-6 flex flex-col items-center justify-between gap-4 h-full group overflow-hidden relative text-center">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-success/20 transition-all duration-500" />
      
      {/* Top: Title & Text */}
      <div className="relative z-10 w-full mt-2">
        <h3 className="font-black text-text-primary text-2xl tracking-tight">Invite a Friend</h3>
        <p className="text-sm text-text-secondary mt-1 font-bold">Both earn <span className="text-xp-gold drop-shadow-[0_0_8px_rgba(245,200,66,0.5)]">100 XP</span> bonus!</p>
      </div>

      {/* Middle: Centered Lottie Animation */}
      <div className="w-full flex-1 min-h-[100px] shrink-0 flex items-center justify-center relative z-10 my-2">
        <div className="w-full h-full pointer-events-none flex items-center justify-center scale-[1.4] origin-center">
          <DotLottiePlayer
            src="/Animations/Refer_earn.lottie"
            autoplay
            loop
          />
        </div>
      </div>

      {/* Bottom: Referral code */}
      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 group/code hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 relative overflow-hidden w-full max-w-[280px] z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-success/0 via-success/5 to-success/0 opacity-0 group-hover/code:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <code className="flex-1 text-base font-black text-text-primary tracking-widest drop-shadow-sm relative z-10 text-center whitespace-nowrap">
          {referralCode}
        </code>
        <button
          id="invite-copy"
          onClick={handleCopy}
          aria-label="Copy referral code"
          className="shrink-0 w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-success transition-all duration-300 relative z-10"
        >
          {copied ? (
            <Check size={20} className="text-success drop-shadow-glow scale-in" />
          ) : (
            <Copy size={20} className="group-hover/code:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}
