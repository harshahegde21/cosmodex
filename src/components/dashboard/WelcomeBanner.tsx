"use client";

import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import { Typewriter } from "./Typewriter";
import { Rocket, ArrowRight } from "lucide-react";

export default function WelcomeBanner() {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/Animations/package-lock.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading Lottie animation:", err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number; pulse: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        const flicker = p.opacity + Math.sin(p.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 51, 255, ${flicker})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 51, 255, ${flicker * 0.15})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const messages = [
    "Welcome back, @priyanshu! We missed you!",
    "Welcome back! Let's get it.",
    "Hello @priyanshu! Do I smell... coffee?",
  ];

  return (
    <div className="w-full h-full flex flex-col items-start gap-5 relative">
      <div className="w-full flex justify-start items-center gap-4 relative z-20">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 animate-float">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl scale-125 animate-pulse-slow" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mascot-transparent.gif"
            alt="Cosmodex Mascot"
            className="relative object-contain w-full h-full drop-shadow-xl"
          />
        </div>

        <div className="relative flex-1 max-w-2xl group/bubble">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-accent/40 via-accent-bright/20 to-accent/40 opacity-60 group-hover/bubble:opacity-100 transition-opacity duration-500 blur-[0.5px]" />
          <div className="relative bg-[#141220]/90 backdrop-blur-xl rounded-2xl px-5 py-3.5 shadow-lg">
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-[#141220] border-l border-b border-accent/20 rotate-45 z-[-1]" />
            <div className="flex items-center gap-2.5">
              <span className="text-sm sm:text-[15px] text-text-secondary font-mono">
                <Typewriter messages={messages} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full rounded-[24px] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0A2E] via-[#150B28] to-[#0D0618]" />

        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-accent/25 rounded-full blur-[100px] group-hover:translate-x-10 transition-transform duration-[2s]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[#4B0082]/30 rounded-full blur-[80px] group-hover:-translate-x-8 transition-transform duration-[2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-accent-bright/10 rounded-full blur-[120px]" />
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-20 mix-blend-overlay pointer-events-none" />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        />

        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-bright/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="absolute inset-0 rounded-[24px] border border-white/[0.06] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-12 sm:px-10 sm:py-16">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-accent/15 blur-2xl scale-[2] animate-pulse-slow" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(158,0,246,0.15)]">
              {animationData ? (
                <Lottie animationData={animationData} loop={true} className="w-12 h-12 sm:w-14 sm:h-14" />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bg-elevated rounded-full animate-pulse" />
              )}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight mb-3 text-accent-bright font-ayaha tracking-wide">
            {"Welcome to CosmoDex".split(" ").map((word, wordIdx, wordsArr) => {
              const prevCharsCount = wordsArr.slice(0, wordIdx).join("").length;
              return (
                <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.3em] last:mr-0">
                  {word.split("").map((char, i) => (
                    <span
                      key={i}
                      className="inline-block animate-write-letter"
                      style={{ animationDelay: `${0.2 + (prevCharsCount + i) * 0.08}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>

          <p className="text-text-secondary text-sm sm:text-[15px] mb-8 max-w-lg leading-relaxed">
            Your coding journey awaits&mdash;but first let&apos;s find something to learn.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[
              { label: "Active Streak", value: "7 Days", color: "text-streak", glow: "rgba(255,107,53,0.15)" },
              { label: "Total XP", value: "1,240", color: "text-xp-gold", glow: "rgba(245,200,66,0.15)" },
              { label: "Courses", value: "3 Active", color: "text-badge", glow: "rgba(78,205,196,0.15)" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300"
                style={{ boxShadow: `0 0 20px ${stat.glow}` }}
              >
                <span className={`text-xs font-black ${stat.color}`}>{stat.value}</span>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#"
              id="welcome-get-started"
              className="group/btn relative inline-flex items-center gap-2 bg-accent hover:bg-accent-bright text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_25px_rgba(158,0,246,0.35)] hover:shadow-[0_0_40px_rgba(184,51,255,0.5)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <Rocket size={16} className="relative z-10" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight size={14} className="relative z-10 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
            </Link>

            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.2] text-text-secondary hover:text-white font-bold px-6 py-3 rounded-xl transition-all duration-300"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
