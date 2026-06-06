"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const milestones = [
  { level: 1,  label: "Explorer",    xp: 0,     color: "#40e0ff", rgb: "64,224,255"   },
  { level: 5,  label: "Navigator",   xp: 2500,  color: "#b06aff", rgb: "176,106,255"  },
  { level: 10, label: "Astronaut",   xp: 7500,  color: "#ff6ef7", rgb: "255,110,247"  },
  { level: 20, label: "Star Coder",  xp: 20000, color: "#ff4d8f", rgb: "255,77,143"   },
];

export default function LevelUpSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Simulated current progress
  const currentXP = 3200;
  const nextLevelXP = 7500;
  const progressPct = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <section
      id="level-up"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        background: "rgba(5,5,8,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Radial tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(155,48,255,0.04) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "72px" }}
        >
          <div className="badge" style={{ marginBottom: "22px" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="currentColor" />
            </svg>
            Progression
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 58px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              marginBottom: "18px",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            <span style={{ color: "rgba(240,230,255,0.9)" }}>Level Up Your</span>
            <br />
            <span style={{ color: "#ffffff" }}>Learning.</span>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(240,230,255,0.48)",
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 1.65,
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            Every lesson, challenge, and streak earns you ✦. Watch your rank
            climb as you conquer the cosmos.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "start",
          }}
          className="levelup-grid"
        >
          {/* Left: XP progress card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
              }}
            >
              {/* Level badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(255,45,120,0.15), rgba(155,48,255,0.15))",
                    border: "1px solid rgba(255,45,120,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 24px rgba(255,45,120,0.15)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      fontFamily: "var(--font-display), sans-serif",
                      color: "#ffffff",
                    }}
                  >
                    7
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "rgba(240,230,255,0.95)",
                      fontFamily: "var(--font-display), sans-serif",
                      letterSpacing: "-0.02em",
                      marginBottom: "4px",
                    }}
                  >
                    Navigator
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "rgba(240,230,255,0.35)",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} ✦
                  </div>
                </div>
              </div>

              {/* XP bar */}
              <div style={{ marginBottom: "28px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(240,230,255,0.35)",
                      fontFamily: "var(--font-display), sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    ✦ Progress
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#c084fc",
                      fontFamily: "var(--font-mono), monospace",
                      fontWeight: 600,
                    }}
                  >
                    {Math.round(progressPct)}%
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${progressPct}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #ff2d78, #c084fc, #9b30ff)",
                      borderRadius: "4px",
                      boxShadow: "0 0 12px rgba(255,45,120,0.5)",
                    }}
                  />
                </div>
              </div>

              {/* XP sources */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Lessons completed", xp: "+150 ✦", color: "#ff6ba8" },
                  { label: "Daily streak (7 days)", xp: "+350 ✦", color: "#c084fc" },
                  { label: "Battle challenge won", xp: "+850 ✦", color: "#9b30ff" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgba(240,230,255,0.58)",
                        fontFamily: "var(--font-body), sans-serif",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: item.color,
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                      }}
                    >
                      {item.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: milestone ladder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "rgba(240,230,255,0.28)",
                marginBottom: "8px",
                fontFamily: "var(--font-display), sans-serif",
              }}
            >
              Rank Milestones
            </div>
            {milestones.map((m, i) => {
              const reached = currentXP >= m.xp;
              return (
                <motion.div
                  key={m.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    opacity: reached ? 1 : 0.45,
                    borderRadius: "16px",
                    background: "rgba(0,0,0,0.45)",
                    border: reached
                      ? `1px solid rgba(${m.rgb}, 0.22)`
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: reached
                      ? `0 0 24px rgba(${m.rgb}, 0.08), 0 8px 32px rgba(0,0,0,0.3)`
                      : "0 4px 16px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: reached
                        ? `rgba(${m.rgb}, 0.12)`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${reached ? `rgba(${m.rgb}, 0.4)` : "rgba(255,255,255,0.06)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: reached ? `0 0 18px rgba(${m.rgb}, 0.25)` : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: reached ? m.color : "rgba(240,230,255,0.25)",
                        fontFamily: "var(--font-display), sans-serif",
                      }}
                    >
                      {m.level}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: reached ? "rgba(240,230,255,0.92)" : "rgba(240,230,255,0.35)",
                        fontFamily: "var(--font-display), sans-serif",
                        letterSpacing: "-0.01em",
                        marginBottom: "3px",
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "rgba(240,230,255,0.28)",
                        fontFamily: "var(--font-mono), monospace",
                      }}
                    >
                      {m.xp === 0 ? "Starting rank" : `${m.xp.toLocaleString()} ✦ required`}
                    </div>
                  </div>
                  {reached && (
                    <div
                      style={{
                        padding: "4px 10px",
                        borderRadius: "100px",
                        fontSize: "10px",
                        fontWeight: 700,
                        background: `rgba(${m.rgb}, 0.1)`,
                        color: m.color,
                        fontFamily: "var(--font-display), sans-serif",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      Reached
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .levelup-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
