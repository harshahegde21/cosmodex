"use client";

export default function WelcomeBanner() {
  return (
    <div className="flex items-center gap-6 relative z-20">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 animate-float">
        <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-125 animate-pulse-slow" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/mascot-transparent.gif"
          alt="Cosmodex Mascot"
          className="relative object-contain w-full h-full drop-shadow-xl"
        />
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl sm:text-4xl font-display font-normal text-white mb-1 tracking-wider flex items-center gap-2">
          Welcome back, priyanshu! <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-white/50 font-medium">
          Ready to continue your coding journey?
        </p>
      </div>
    </div>
  );
}
