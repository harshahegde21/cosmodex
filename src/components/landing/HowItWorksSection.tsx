"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Server A runs s.call",
    description:
      "An admin or user on Server A initiates a call using the s.call command. The bot registers the intent and broadcasts a call request across the network.",
    code: "/s.call @ServerB #general",
    accent: "#ff2d78",
    accentRgb: "255,45,120",
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 14l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Server B runs s.call",
    description:
      "Server B receives the incoming call notification. A user accepts with s.call and the connection is established between both servers.",
    code: "/s.call accept",
    accent: "#9b30ff",
    accentRgb: "155,48,255",
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 14h20M14 4l10 10-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Messages relay both ways",
    description:
      "Once connected, all messages flow bidirectionally. Each message carries the sender's server identity, making conversations clear and contextual.",
    code: "// Messages relay in real-time",
    accent: "#c084fc",
    accentRgb: "192,132,252",
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 10h20M4 18h20M10 4l-6 10 6 10M18 4l6 10-6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const diagramRef = useRef<HTMLDivElement>(null);
  const diagramInView = useInView(diagramRef, { once: true, margin: "-60px" });

  return (
    <section
      id="how-it-works"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        background: "rgba(5,5,8,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Subtle tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,45,120,0.028) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div className="badge" style={{ marginBottom: "22px" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            How It Works
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
            <span style={{ color: "rgba(240,230,255,0.9)" }}>Three steps to</span>
            <br />
            <span className="gradient-text-reverse">cosmic connection.</span>
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
            Simple commands, powerful results. Get two servers talking in under a minute.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "20px",
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.85,
                delay: i * 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="step-card"
            >
              {/* Step number + icon row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `rgba(${step.accentRgb}, 0.1)`,
                    border: `1px solid rgba(${step.accentRgb}, 0.25)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.accent,
                    flexShrink: 0,
                    boxShadow: `0 4px 16px rgba(${step.accentRgb}, 0.12)`,
                  }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontSize: "52px",
                    fontWeight: 700,
                    color: `rgba(${step.accentRgb}, 0.18)`,
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    fontFamily: "var(--font-display), sans-serif",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "21px",
                  fontWeight: 700,
                  color: "rgba(240,230,255,0.95)",
                  marginBottom: "12px",
                  letterSpacing: "0.025em",
                  lineHeight: 1.18,
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14.5px",
                  color: "rgba(240,230,255,0.48)",
                  lineHeight: 1.65,
                  marginBottom: "20px",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                }}
              >
                {step.description}
              </p>

              {/* Code snippet */}
              <div
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: `1px solid rgba(${step.accentRgb}, 0.18)`,
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontFamily: "var(--font-mono), 'Fira Code', monospace",
                  fontSize: "12.5px",
                  color: step.accent,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "rgba(240,230,255,0.18)" }}>$</span>
                {step.code}
                <span
                  style={{
                    marginLeft: "auto",
                    width: "5px",
                    height: "13px",
                    background: step.accent,
                    borderRadius: "1px",
                    animation: "blink 1.2s step-end infinite",
                    opacity: 0.8,
                  }}
                />
              </div>

              {/* Arrow between steps (mobile) */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    color: "rgba(240,230,255,0.12)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="M10 4v12M4 10l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Visual relay diagram */}
        <motion.div
          ref={diagramRef}
          initial={{ opacity: 0, y: 40 }}
          animate={diagramInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: "72px",
            padding: "clamp(32px, 5vw, 56px)",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(155,48,255,0.055) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Server A */}
          <ServerNode label="Server A" color="#ff2d78" colorRgb="255,45,120" />

          {/* Connection line with bidirectional dots */}
          <div
            style={{
              flex: 1,
              minWidth: "100px",
              maxWidth: "280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              padding: "0 20px",
            }}
          >
            {/* Top line (A→B) */}
            <div style={{ width: "100%", position: "relative", height: "2px" }}>
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(90deg, #ff2d78, #9b30ff)",
                  borderRadius: "1px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#c084fc",
                  boxShadow: "0 0 10px #c084fc",
                  animation: "travel-right 1.8s linear infinite",
                }}
              />
            </div>

            <span
              style={{
                fontSize: "10px",
                color: "rgba(240,230,255,0.28)",
                fontFamily: "var(--font-mono), 'Fira Code', monospace",
                letterSpacing: "0.06em",
                textAlign: "center",
              }}
            >
              RELAY ACTIVE
            </span>

            {/* Bottom line (B→A) */}
            <div style={{ width: "100%", position: "relative", height: "2px" }}>
              <div
                style={{
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(90deg, #9b30ff, #ff2d78)",
                  borderRadius: "1px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ff6ba8",
                  boxShadow: "0 0 10px #ff6ba8",
                  animation: "travel-left 1.8s linear infinite 0.9s",
                }}
              />
            </div>
          </div>

          {/* Server B */}
          <ServerNode label="Server B" color="#9b30ff" colorRgb="155,48,255" />

          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 0; }
            }
            @keyframes travel-right {
              0% { left: 0%; }
              100% { left: 100%; }
            }
            @keyframes travel-left {
              0% { right: 0%; left: auto; }
              100% { right: 100%; left: auto; }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
}

function ServerNode({
  label,
  color,
  colorRgb,
}: {
  label: string;
  color: string;
  colorRgb: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "76px",
          height: "76px",
          borderRadius: "18px",
          background: `rgba(${colorRgb}, 0.1)`,
          border: `1.5px solid rgba(${colorRgb}, 0.35)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 30px rgba(${colorRgb}, 0.18)`,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <rect x="4" y="8" width="28" height="20" rx="4" stroke={color} strokeWidth="1.5" />
          <path d="M12 16h12M12 20h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="27" cy="12" r="2" fill={color} />
        </svg>
      </div>
      <div
        style={{
          padding: "5px 16px",
          borderRadius: "100px",
          background: `rgba(${colorRgb}, 0.09)`,
          border: `1px solid rgba(${colorRgb}, 0.22)`,
          fontSize: "12px",
          fontWeight: 600,
          color: color,
          fontFamily: "var(--font-mono), 'Fira Code', monospace",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
