"use client";

/**
 * HeroSection
 * -----------
 * Hero with cursor-driven parallax on UI elements.
 * The animation canvas is NOT affected (it's on its own fixed layer).
 * Only the text, badge, and buttons shift subtly with mouse movement.
 *
 * Parallax layers (deepest → shallowest):
 *   - Ambient glow orbs   → 10px max travel (slowest)
 *   - Headline            → 6px max travel
 *   - Description + CTAs  → 10px max travel (fastest, most reactive)
 *   - Badge               → 14px max travel
 */

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/** Lerp toward target each frame for smooth parallax */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HeroSection() {
  const mounted = true;
  const sectionRef = useRef<HTMLElement>(null);

  // Ref-driven parallax positions (avoid React re-renders for every mousemove)
  const mouseRef = useRef({ x: 0, y: 0 });      // normalised -1..1
  const currentRef = useRef({ x: 0, y: 0 });    // smoothed

  // DOM node refs for each parallax layer
  const orbTopRef = useRef<HTMLDivElement>(null);
  const orbBottomRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    // Normalise to -1..1 relative to section centre
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // RAF loop: lerp toward mouse position, apply transforms
  useEffect(() => {
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const target = mouseRef.current;
      const cur = currentRef.current;

      cur.x = lerp(cur.x, target.x, 0.06);
      cur.y = lerp(cur.y, target.y, 0.06);

      const x = cur.x;
      const y = cur.y;

      // Orbs (slowest)
      if (orbTopRef.current)
        orbTopRef.current.style.transform = `translate(${x * -12}px, ${y * -10}px)`;
      if (orbBottomRef.current)
        orbBottomRef.current.style.transform = `translate(${x * 10}px, ${y * 8}px)`;

      // Badge (most reactive)
      if (badgeRef.current)
        badgeRef.current.style.transform = `translate(${x * 14}px, ${y * 10}px)`;

      // Headline
      if (headlineRef.current)
        headlineRef.current.style.transform = `translate(${x * 6}px, ${y * 5}px)`;

      // Description + CTAs
      if (descRef.current)
        descRef.current.style.transform = `translate(${x * 9}px, ${y * 7}px)`;
      if (ctaRef.current)
        ctaRef.current.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100vh",
        zIndex: 3,
        overflow: "hidden",
        background: "rgba(5,5,8,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Ambient glow orbs — react to cursor (slowest layer) */}
      <div
        ref={orbTopRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,45,120,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      <div
        ref={orbBottomRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,48,255,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      {/* Hero content — vertically centred */}
      <div
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 48 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            padding: "0 24px",
            maxWidth: "860px",
            pointerEvents: "auto",
          }}
        >
          {/* ── Beta Badge ── */}
          <motion.div
            ref={badgeRef}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.85 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "7px 18px",
              borderRadius: "100px",
              background: "rgba(255,45,120,0.09)",
              border: "1px solid rgba(255,45,120,0.28)",
              marginBottom: "32px",
              willChange: "transform",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(255,45,120,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Pulsing dot */}
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#ff2d78",
                  boxShadow: "0 0 8px #ff2d78",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  inset: "-3px",
                  borderRadius: "50%",
                  background: "rgba(255,45,120,0.4)",
                  animation: "ping-slow 2s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#ff6ba8",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
                textRendering: "optimizeLegibility",
              }}
            >
              v1 Public Beta
            </span>
          </motion.div>

          {/* ── Headline ── */}
          <motion.h1
            ref={headlineRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 32 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(42px, 6.5vw, 80px)",
              fontWeight: 400,
              lineHeight: 1.12,
              letterSpacing: "0.04em",
              marginBottom: "24px",
              color: "#ffffff",
              willChange: "transform",
              fontFamily: "var(--font-display), sans-serif",
              textRendering: "optimizeLegibility",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            Start Your Coding
            <br />
            Expedition.
          </motion.h1>

          {/* ── Description ── */}
          <motion.p
            ref={descRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.9, delay: 0.70, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.7,
              color: "rgba(240,230,255,0.58)",
              maxWidth: "530px",
              margin: "0 auto 44px",
              fontWeight: 400,
              willChange: "transform",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
            }}
          >
            Learn to code through interactive courses, battle challenges, and
            level up your skills —{" "}
            <span style={{ color: "rgba(240,230,255,0.8)" }}>
              one expedition at a time.
            </span>
          </motion.p>

          {/* ── CTAs ── */}
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              willChange: "transform",
            }}
          >
            <a href="#signup" className="btn-primary" id="hero-cta-btn">
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z"
                    fill="currentColor"
                  />
                </svg>
                Get Started
              </span>
            </a>
          </motion.div>

          {/* ── Subtle trust line ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            style={{
              marginTop: "28px",
              fontSize: "12px",
              color: "rgba(240,230,255,0.28)",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
              letterSpacing: "0.04em",
              fontWeight: 400,
            }}
          >
            {/* Free to start · No credit card · Join thousands of learners */}
          </motion.p>
        </motion.div>

        {/* ── Scroll Indicator ── */}
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(240,230,255,0.25)",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
            }}
          >
            Scroll to explore
          </span>
          {/* Mouse icon */}
          <div
            style={{
              width: "22px",
              height: "36px",
              borderRadius: "11px",
              border: "1.5px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <div
              className="animate-scroll-bounce"
              style={{
                width: "3px",
                height: "7px",
                borderRadius: "1.5px",
                background: "linear-gradient(180deg, #ff2d78, #9b30ff)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
