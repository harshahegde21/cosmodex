"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 15a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 14v6M14 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Cross-Server Calls",
    description:
      "Initiate voice calls between completely different Discord servers. Your bot acts as the bridge, relaying audio in real time across the cosmos.",
    accent: "#ff2d78",
    accentRgb: "255,45,120",
    tag: "Core",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Webhook Identity",
    description:
      "Each server gets a unique webhook identity. Messages arrive with the correct server branding, avatar, and name — no confusion, ever.",
    accent: "#9b30ff",
    accentRgb: "155,48,255",
    tag: "Identity",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Replies That Travel",
    description:
      "Reply to a message on Server A and it appears as a threaded reply on Server B. Context travels with the conversation, always.",
    accent: "#c084fc",
    accentRgb: "192,132,252",
    tag: "Messaging",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Friend Requests",
    description:
      "Servers can send and accept friend requests to establish trusted communication channels before any calls are made.",
    accent: "#ff6ba8",
    accentRgb: "255,107,168",
    tag: "Social",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Skip & Hang Up",
    description:
      "Users can skip incoming calls or hang up at any time. Full call control with intuitive commands that feel natural.",
    accent: "#ff2d78",
    accentRgb: "255,45,120",
    tag: "Control",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Admin Block-List",
    description:
      "Server admins can block specific servers or users from initiating calls. Full moderation control at your fingertips.",
    accent: "#9b30ff",
    accentRgb: "155,48,255",
    tag: "Safety",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        background: "rgba(5,5,8,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Subtle radial tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "700px",
          background:
            "radial-gradient(ellipse, rgba(155,48,255,0.045) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div className="badge" style={{ marginBottom: "22px" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="currentColor" />
            </svg>
            Features
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
            <span className="gradient-text">Everything you need</span>
            <br />
            <span style={{ color: "rgba(240,230,255,0.88)" }}>
              to connect the cosmos.
            </span>
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
            Six powerful features that make cross-server communication feel like magic.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="feature-card"
            >
              {/* Icon */}
              <div
                className="feature-icon"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "13px",
                  background: `rgba(${feature.accentRgb}, 0.1)`,
                  border: `1px solid rgba(${feature.accentRgb}, 0.2)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: feature.accent,
                  boxShadow: `0 4px 16px rgba(${feature.accentRgb}, 0.12)`,
                }}
              >
                {feature.icon}
              </div>

              {/* Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "3px 10px",
                  borderRadius: "100px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  background: `rgba(${feature.accentRgb}, 0.1)`,
                  color: feature.accent,
                  marginBottom: "12px",
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                {feature.tag}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "rgba(240,230,255,0.95)",
                  marginBottom: "10px",
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14.5px",
                  color: "rgba(240,230,255,0.48)",
                  lineHeight: 1.65,
                  fontFamily: "var(--font-body), sans-serif",
                }}
              >
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="card-accent-line"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(${feature.accentRgb}, 0.4), transparent)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
