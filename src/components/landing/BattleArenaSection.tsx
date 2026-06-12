"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function BattleArenaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="battle-arena"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        background: "rgba(5,5,8,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Radial tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(255,45,120,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "96px",
            alignItems: "center",
          }}
          className="battle-grid"
        >
          {/* Left: content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="badge" style={{ marginBottom: "22px" }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="currentColor" />
              </svg>
              Battle Test Arena
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                letterSpacing: "0.03em",
                lineHeight: 1.15,
                marginBottom: "20px",
                fontFamily: "var(--font-display), sans-serif",
              }}
            >
              <span style={{ color: "rgba(240,230,255,0.9)" }}>Put your skills</span>
              <br />
              <span style={{ color: "#ffffff" }}>to the test.</span>
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(240,230,255,0.48)",
                lineHeight: 1.7,
                marginBottom: "36px",
                maxWidth: "400px",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
              }}
            >
              Compete in timed coding challenges, climb the leaderboard, and
              prove your mastery. Real problems. Real pressure. Real ✦.
            </p>


          </motion.div>

          {/* Right: arena visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              {/* Header bar */}
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: "#ff2d78",
                      boxShadow: "0 0 8px #ff2d78",
                      animation: "pulse-glow 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgba(240,230,255,0.6)",
                      fontFamily: "var(--font-mono), 'Fira Code', monospace",
                      letterSpacing: "0.04em",
                    }}
                  >
                    CHALLENGE #042 — ACTIVE
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#ff2d78",
                    fontFamily: "var(--font-mono), 'Fira Code', monospace",
                    fontWeight: 700,
                  }}
                >
                  04:32 left
                </span>
              </div>

              {/* Challenge content */}
              <div style={{ padding: "28px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(240,230,255,0.38)",
                    fontFamily: "var(--font-mono), 'Fira Code', monospace",
                    marginBottom: "12px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Problem
                </div>
                <p
                  style={{
                    fontSize: "14.5px",
                    color: "rgba(240,230,255,0.78)",
                    lineHeight: 1.65,
                    marginBottom: "20px",
                    fontFamily: "var(--font-body), 'Fira Code', monospace",
                  }}
                >
                  Given a list of integers, return the two numbers that add up to the target sum.
                </p>

                {/* Code block */}
                <div
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(155,48,255,0.2)",
                    borderLeft: "3px solid #9b30ff",
                    borderRadius: "10px",
                    padding: "16px",
                    fontFamily: "var(--font-mono), 'Fira Code', monospace",
                    fontSize: "12.5px",
                    lineHeight: 1.8,
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ color: "rgba(240,230,255,0.28)" }}># Your solution here</div>
                  <div style={{ color: "#c084fc" }}>def <span style={{ color: "#ff6ba8" }}>two_sum</span><span style={{ color: "rgba(240,230,255,0.6)" }}>(nums, target):</span></div>
                  <div style={{ color: "rgba(240,230,255,0.28)", paddingLeft: "20px" }}>...</div>
                  <div
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "14px",
                      background: "#ff2d78",
                      marginLeft: "20px",
                      animation: "cdx-blink 1.2s step-end infinite",
                      verticalAlign: "middle",
                    }}
                  />
                </div>

                {/* Leaderboard mini */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    { rank: "01", name: "nova_coder", xp: "+850 ✦", color: "#ff2d78" },
                    { rank: "02", name: "stardev_x", xp: "+720 ✦", color: "#9b30ff" },
                    { rank: "03", name: "you", xp: "solving...", color: "#c084fc" },
                  ].map((entry) => (
                    <div
                      key={entry.rank}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: entry.name === "you" ? `rgba(192,132,252,0.06)` : "rgba(255,255,255,0.02)",
                        border: entry.name === "you" ? "1px solid rgba(192,132,252,0.2)" : "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: entry.color,
                          fontFamily: "var(--font-mono), 'Fira Code', monospace",
                          minWidth: "20px",
                        }}
                      >
                        {entry.rank}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "13px",
                          color: entry.name === "you" ? "rgba(240,230,255,0.9)" : "rgba(240,230,255,0.55)",
                          fontFamily: "var(--font-body), 'Fira Code', monospace",
                          fontWeight: entry.name === "you" ? 600 : 400,
                        }}
                      >
                        {entry.name}
                      </span>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: entry.color,
                          fontFamily: "var(--font-mono), 'Fira Code', monospace",
                          fontWeight: 600,
                        }}
                      >
                        {entry.xp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .battle-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
        @keyframes cdx-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
