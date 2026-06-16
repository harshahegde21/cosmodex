"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Link from "next/link";
import { Typewriter } from "./Typewriter";

export default function WelcomeBanner() {
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    fetch("/Animations/package-lock.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading Lottie animation:", err));
  }, []);

  const messages = [
    "Welcome back, @priyanshu! We missed you!",
    "Welcome back! Let's get it.",
    "Hello @priyanshu! Do I smell... coffee?",
  ];

  return (
    <div className="w-full flex flex-col items-start gap-4 relative">

      {/* ── Top Area: Mascot & Personalized Speech Bubble ── */}
      <div className="w-full flex justify-start items-center gap-4 relative z-20">
        {/* Mascot */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 drop-shadow-xl animate-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mascot-transparent.gif"
            alt="Cosmodex Mascot"
            className="object-contain w-full h-full"
          />
        </div>

        {/* Speech Bubble pointing left to Mascot */}
        <div className="relative bg-[#1A1B23] border border-white/5 rounded-xl p-3 sm:px-5 shadow-lg w-full max-w-2xl">
          {/* Left Arrow */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-[#1A1B23] border-l border-b border-white/5 rotate-45 z-[-1]" />

          <div className="text-sm sm:text-[15px] text-text-secondary font-mono flex items-center">
            <span className="inline-block">
              <Typewriter messages={messages} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Area: Main Welcome Card ── */}
      <div className="relative bento-card w-full flex flex-col items-center text-center p-10 sm:p-14 z-10 group">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-overlay pointer-events-none rounded-[32px]" />

        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Lottie Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 drop-shadow-glow">
            {animationData ? (
              <Lottie animationData={animationData} loop={true} />
            ) : (
              <div className="w-full h-full bg-bg-elevated rounded-full animate-pulse" />
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-tight mb-4 drop-shadow-lg text-accent-bright font-ayaha tracking-wide">
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

          <p className="text-text-secondary text-sm sm:text-[15px] mb-8 max-w-lg">
            Your coding journey awaits-but first let&apos;s find something to learn.
          </p>

          <Link
            href="#"
            id="welcome-get-started"
            className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-bold px-8 py-2.5 rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
