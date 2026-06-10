"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RisingStars from "@/components/landing/RisingStars";

const devs = [
  {
    name: "Amey Vaidya",
    role: "intern lol",
    color: "#ff2d78",
    rgb: "255,45,120",
    github: "https://github.com/ameyvaidya44",
    initials: "AV",
    gradient: "linear-gradient(135deg, #ff2d78, #c084fc)",
  },
  {
    name: "Nova Coder",
    role: "Frontend Engineer",
    color: "#9b30ff",
    rgb: "155,48,255",
    github: "#",
    initials: "NC",
    gradient: "linear-gradient(135deg, #9b30ff, #ff6ba8)",
  },
  {
    name: "Star Dev",
    role: "Backend Engineer",
    color: "#c084fc",
    rgb: "192,132,252",
    github: "#",
    initials: "SD",
    gradient: "linear-gradient(135deg, #c084fc, #ff2d78)",
  },
  {
    name: "Orbit X",
    role: "Design & UX",
    color: "#ff6ba8",
    rgb: "255,107,168",
    github: "#",
    initials: "OX",
    gradient: "linear-gradient(135deg, #ff6ba8, #9b30ff)",
  },
];

export default function DevsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="our-devs"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        overflow: "hidden",
      }}
    >
      {/* Dark + blur overlay — sits above the scroll animation canvas but below RisingStars */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "rgba(5,5,8,0.82)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      {/* Rising stars background — above the blur overlay */}
      <RisingStars count={60} intensity={0.6} style={{ zIndex: 1 }} />
      {/* Radial tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,45,120,0.03) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref} style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="badge" style={{ marginBottom: "22px" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="currentColor" />
            </svg>
            Team
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 58px)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              lineHeight: 1.15,
              marginBottom: "18px",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            <span style={{ color: "rgba(240,230,255,0.9)" }}>Meet</span>{" "}
            <span style={{ color: "#ffffff" }}>Our Devs.</span>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(240,230,255,0.48)",
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.65,
              fontFamily: "var(--font-body), 'Fira Code', monospace",
            }}
          >
            The crew behind the cosmos. Passionate builders making learning
            feel like an adventure.
          </p>
        </motion.div>

        {/* Dev cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
          className="devs-grid"
        >
          {devs.map((dev, i) => (
            <motion.a
              key={dev.name}
              href={dev.github}
              target={dev.github !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "32px 24px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `rgba(${dev.rgb}, 0.3)`;
                el.style.background = `rgba(${dev.rgb}, 0.04)`;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = `0 24px 64px rgba(${dev.rgb}, 0.12), 0 4px 16px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.06)";
                el.style.background = "rgba(255,255,255,0.02)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: dev.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  boxShadow: `0 0 28px rgba(${dev.rgb}, 0.3)`,
                  border: `2px solid rgba(${dev.rgb}, 0.3)`,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "var(--font-body), 'Fira Code', monospace",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {dev.initials}
                </span>
              </div>

              {/* Name */}
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "rgba(240,230,255,0.92)",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                  letterSpacing: "-0.02em",
                  marginBottom: "6px",
                  textAlign: "center",
                }}
              >
                {dev.name}
              </div>

              {/* Role */}
              <div
                style={{
                  fontSize: "12.5px",
                  color: dev.color,
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                  fontWeight: 500,
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                {dev.role}
              </div>

              {/* GitHub icon */}
              {dev.github !== "#" && (
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: `rgba(${dev.rgb}, 0.08)`,
                    border: `1px solid rgba(${dev.rgb}, 0.18)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: dev.color,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              )}

              {/* Bottom accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "24px",
                  right: "24px",
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, rgba(${dev.rgb}, 0.4), transparent)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                className="dev-accent-line"
              />
            </motion.a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .devs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .devs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
