"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

// Generate stable star positions using useMemo (avoids hydration mismatch)
function useStableStars(count: number) {
  return useMemo(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed + 1) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      size: rng(i * 3) * 2.5 + 0.5,
      color:
        i % 4 === 0
          ? "#ff2d78"
          : i % 4 === 1
          ? "#9b30ff"
          : i % 4 === 2
          ? "#c084fc"
          : "white",
      top: rng(i * 7) * 100,
      left: rng(i * 11) * 100,
      opacity: rng(i * 13) * 0.5 + 0.15,
      duration: rng(i * 17) * 3 + 2,
      delay: rng(i * 19) * 3,
    }));
  }, [count]);
}

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const stars = useStableStars(24);

  return (
    <section
      id="cta"
      className="section-padding"
      style={{ position: "relative", zIndex: 2 }}
    >
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            borderRadius: "28px",
            overflow: "hidden",
            padding: "clamp(52px, 8vw, 100px) clamp(32px, 6vw, 80px)",
            textAlign: "center",
          }}
        >
          {/* Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,45,120,0.11) 0%, rgba(5,5,8,0.82) 40%, rgba(155,48,255,0.11) 100%)",
              zIndex: 0,
            }}
          />

          {/* Border gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "28px",
              padding: "1px",
              background:
                "linear-gradient(135deg, rgba(255,45,120,0.45), rgba(155,48,255,0.45))",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              zIndex: 0,
            }}
          />

          {/* Glow orbs */}
          <div
            style={{
              position: "absolute",
              top: "-120px",
              left: "-120px",
              width: "440px",
              height: "440px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,45,120,0.14) 0%, transparent 70%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-120px",
              right: "-120px",
              width: "440px",
              height: "440px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(155,48,255,0.14) 0%, transparent 70%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          {/* Stable star decorations */}
          {stars.map((star, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: "50%",
                background: star.color,
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
                animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.2,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "22px",
                background: "linear-gradient(135deg, #ff2d78, #9b30ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 36px",
                boxShadow:
                  "0 0 40px rgba(255,45,120,0.5), 0 0 80px rgba(155,48,255,0.25)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <path
                  d="M18 4C10.268 4 4 10.268 4 18s6.268 14 14 14 14-6.268 14-14S25.732 4 18 4z"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 18c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="18" cy="18" r="2.5" fill="white" />
                <path
                  d="M18 8v2M18 26v2M8 18h2M26 18h2"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "clamp(34px, 5.5vw, 64px)",
                fontWeight: 700,
                letterSpacing: "0.03em",
                lineHeight: 1.15,
                marginBottom: "20px",
                fontFamily: "var(--font-display), sans-serif",
              }}
            >
              <span className="gradient-text-white">
                Ready to connect
                <br />
                the cosmos?
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: "17px",
                color: "rgba(240,230,255,0.52)",
                maxWidth: "460px",
                margin: "0 auto 44px",
                lineHeight: 1.68,
                fontFamily: "var(--font-body), 'Fira Code', monospace",
              }}
            >
              Invite CosmoDeX to your Discord server and start making
              cross-server calls in under 60 seconds.{" "}
              <span style={{ color: "rgba(240,230,255,0.78)" }}>Free forever.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="#"
                className="btn-primary"
                style={{ fontSize: "15.5px", padding: "15px 32px" }}
                id="cta-invite-btn"
              >
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M16.942 1.556a16.3 16.3 0 00-4.126-1.3 12.04 12.04 0 00-.529 1.1 15.175 15.175 0 00-4.573 0 11.585 11.585 0 00-.535-1.1 16.274 16.274 0 00-4.129 1.3A17.392 17.392 0 00.182 13.218a15.785 15.785 0 004.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 01-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0010.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 001.084 1.785 16.46 16.46 0 005.064-2.595 17.286 17.286 0 00-2.973-11.59z"
                      fill="currentColor"
                    />
                  </svg>
                  Invite to Discord
                </span>
              </a>
              <a
                href="#"
                className="btn-secondary"
                style={{ fontSize: "15.5px", padding: "14px 32px" }}
                id="cta-docs-btn"
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M14 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6 6h6M6 9h6M6 12h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  View Docs
                </span>
              </a>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.7 }}
              style={{
                marginTop: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "10K+", label: "Servers" },
                { value: "99.9%", label: "Uptime" },
                { value: "< 50ms", label: "Latency" },
              ].map((stat, i) => (
                <>
                  <div
                    key={stat.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      padding: "8px 20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        background: "linear-gradient(135deg, #ff2d78, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontFamily: "var(--font-display), sans-serif",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(240,230,255,0.32)",
                        fontWeight: 600,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-body), 'Fira Code', monospace",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      key={`sep-${i}`}
                      style={{
                        width: "1px",
                        height: "32px",
                        background: "rgba(255,255,255,0.07)",
                      }}
                    />
                  )}
                </>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.4); }
        }
      `}</style>
    </section>
  );
}
