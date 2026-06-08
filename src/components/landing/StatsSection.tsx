"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    value: 10000,
    suffix: "+",
    label: "Servers Connected",
    description: "Discord servers using CosmoDeX",
    color: "#ff2d78",
    rgb: "255,45,120",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Reliable infrastructure, always on",
    color: "#9b30ff",
    rgb: "155,48,255",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: 50,
    suffix: "ms",
    label: "Avg Latency",
    description: "Lightning-fast message relay",
    color: "#c084fc",
    rgb: "192,132,252",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    value: 500000,
    suffix: "+",
    label: "Messages Relayed",
    description: "Conversations bridged across servers",
    color: "#ff6ba8",
    rgb: "255,107,168",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="stats-section"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "72px 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(5,5,8,0.45)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      {/* Gradient tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,45,120,0.03) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="stat-card"
              style={{
                /* @ts-expect-error CSS custom property */
                "--stat-color": `rgba(${stat.rgb}, 0.4)`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: `rgba(${stat.rgb}, 0.1)`,
                  border: `1px solid rgba(${stat.rgb}, 0.2)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  margin: "0 auto 16px",
                }}
              >
                {stat.icon}
              </div>

              {/* Value */}
              <div
                style={{
                  fontSize: "clamp(34px, 4.5vw, 50px)",
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  marginBottom: "8px",
                  background: `linear-gradient(135deg, ${stat.color} 0%, #fff 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "rgba(240,230,255,0.82)",
                  marginBottom: "4px",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                  letterSpacing: "-0.01em",
                }}
              >
                {stat.label}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: "12.5px",
                  color: "rgba(240,230,255,0.33)",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                }}
              >
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
