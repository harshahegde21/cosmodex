"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const helpCommands = [
  {
    command: "/s.call",
    description: "Initiate or accept a cross-server call",
    usage: "/s.call @server #channel",
    category: "Calls",
    color: "#ff2d78",
    rgb: "255,45,120",
  },
  {
    command: "/s.hangup",
    description: "End the current active call",
    usage: "/s.hangup",
    category: "Calls",
    color: "#ff2d78",
    rgb: "255,45,120",
  },
  {
    command: "/s.skip",
    description: "Skip an incoming call request",
    usage: "/s.skip",
    category: "Calls",
    color: "#ff6ba8",
    rgb: "255,107,168",
  },
  {
    command: "/s.friend",
    description: "Send a friend request to another server",
    usage: "/s.friend @server",
    category: "Social",
    color: "#9b30ff",
    rgb: "155,48,255",
  },
  {
    command: "/s.accept",
    description: "Accept a pending friend request",
    usage: "/s.accept @server",
    category: "Social",
    color: "#9b30ff",
    rgb: "155,48,255",
  },
  {
    command: "/s.block",
    description: "Block a server from contacting you",
    usage: "/s.block @server",
    category: "Admin",
    color: "#c084fc",
    rgb: "192,132,252",
  },
  {
    command: "/s.unblock",
    description: "Remove a server from your block list",
    usage: "/s.unblock @server",
    category: "Admin",
    color: "#c084fc",
    rgb: "192,132,252",
  },
  {
    command: "/s.help",
    description: "Display all available commands",
    usage: "/s.help",
    category: "Info",
    color: "#ff2d78",
    rgb: "255,45,120",
  },
];

const categories = ["All", "Calls", "Social", "Admin", "Info"];

export default function CommandsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCommand, setHoveredCommand] = useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? helpCommands
      : helpCommands.filter((c) => c.category === activeCategory);

  return (
    <section
      id="commands"
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
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(255,45,120,0.035) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
          className="commands-grid"
        >
          {/* Left: s.help visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="badge" style={{ marginBottom: "22px" }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 5v4M6 3.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Commands
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 50px)",
                fontWeight: 700,
                letterSpacing: "0.03em",
                lineHeight: 1.15,
                marginBottom: "16px",
                fontFamily: "var(--font-display)",
              }}
            >
              <span style={{ color: "rgba(240,230,255,0.9)" }}>Everything at</span>
              <br />
              <span className="gradient-text">your fingertips.</span>
            </h2>
            <p
              style={{
                fontSize: "15.5px",
                color: "rgba(240,230,255,0.48)",
                lineHeight: 1.65,
                marginBottom: "32px",
                maxWidth: "360px",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
              }}
            >
              Simple slash commands that feel natural. No complex setup, no
              configuration files — just type and connect.
            </p>

            {/* Discord terminal mockup */}
            <div
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              }}
            >
              {/* Terminal header */}
              <div
                style={{
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ display: "flex", gap: "5px" }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div
                      key={c}
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: c,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "11.5px",
                    color: "rgba(240,230,255,0.28)",
                    fontFamily: "var(--font-mono), 'Fira Code', monospace",
                  }}
                >
                  Discord — #general
                </span>
              </div>

              {/* Command output */}
              <div style={{ padding: "18px 20px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono), 'Fira Code', monospace",
                    fontSize: "12.5px",
                    lineHeight: 1.8,
                  }}
                >
                  <div style={{ color: "rgba(240,230,255,0.35)", marginBottom: "10px" }}>
                    <span style={{ color: "#ff6ba8", fontWeight: 600 }}>you</span>
                    <span style={{ color: "rgba(240,230,255,0.18)" }}>
                      {" "}— Today at 3:14 PM
                    </span>
                  </div>
                  <div
                    style={{
                      color: "#c084fc",
                      marginBottom: "14px",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    /s.help
                  </div>
                  <div
                    style={{
                      background: "rgba(155,48,255,0.07)",
                      border: "1px solid rgba(155,48,255,0.18)",
                      borderLeft: "3px solid #9b30ff",
                      borderRadius: "8px",
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        color: "#9b30ff",
                        fontWeight: 700,
                        marginBottom: "10px",
                        fontSize: "13px",
                      }}
                    >
                      🚀 CosmoDeX Commands
                    </div>
                    {helpCommands.slice(0, 4).map((cmd) => (
                      <div
                        key={cmd.command}
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginBottom: "7px",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            color: cmd.color,
                            minWidth: "86px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {cmd.command}
                        </span>
                        <span
                          style={{ color: "rgba(240,230,255,0.38)", fontSize: "11.5px" }}
                        >
                          {cmd.description}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        color: "rgba(240,230,255,0.22)",
                        fontSize: "11px",
                        marginTop: "8px",
                        fontStyle: "italic",
                      }}
                    >
                      +{helpCommands.length - 4} more commands...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Command list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category filter */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "100px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                    background:
                      activeCategory === cat
                        ? "linear-gradient(135deg, #ff2d78, #9b30ff)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      activeCategory === cat
                        ? "1px solid transparent"
                        : "1px solid rgba(255,255,255,0.07)",
                    color:
                      activeCategory === cat ? "white" : "rgba(240,230,255,0.48)",
                    boxShadow:
                      activeCategory === cat
                        ? "0 4px 18px rgba(255,45,120,0.28)"
                        : "none",
                    transform: activeCategory === cat ? "scale(1.02)" : "scale(1)",
                    fontFamily: "var(--font-body), 'Fira Code', monospace",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Commands list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <AnimatePresence mode="popLayout">
                {filtered.map((cmd, i) => (
                  <motion.div
                    key={cmd.command}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, delay: i * 0.04 }}
                    onMouseEnter={() => setHoveredCommand(cmd.command)}
                    onMouseLeave={() => setHoveredCommand(null)}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background:
                        hoveredCommand === cmd.command
                          ? `rgba(${cmd.rgb}, 0.06)`
                          : "rgba(255,255,255,0.02)",
                      border: `1px solid ${
                        hoveredCommand === cmd.command
                          ? `rgba(${cmd.rgb}, 0.28)`
                          : "rgba(255,255,255,0.05)"
                      }`,
                      borderLeft: `3px solid ${
                        hoveredCommand === cmd.command
                          ? cmd.color
                          : "transparent"
                      }`,
                      cursor: "default",
                      transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    {/* Command name */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono), 'Fira Code', monospace",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: cmd.color,
                        minWidth: "95px",
                        flexShrink: 0,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {cmd.command}
                    </div>

                    {/* Description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13.5px",
                          color:
                            hoveredCommand === cmd.command
                              ? "rgba(240,230,255,0.88)"
                              : "rgba(240,230,255,0.65)",
                          marginBottom: "2px",
                          transition: "color 0.2s ease",
                          fontFamily: "var(--font-body), 'Fira Code', monospace",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {cmd.description}
                      </div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          color: "rgba(240,230,255,0.28)",
                          fontFamily: "var(--font-mono), 'Fira Code', monospace",
                        }}
                      >
                        {cmd.usage}
                      </div>
                    </div>

                    {/* Category badge */}
                    <div
                      style={{
                        padding: "3px 10px",
                        borderRadius: "100px",
                        fontSize: "10px",
                        fontWeight: 700,
                        background: `rgba(${cmd.rgb}, 0.1)`,
                        color: cmd.color,
                        flexShrink: 0,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-body), 'Fira Code', monospace",
                      }}
                    >
                      {cmd.category}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .commands-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
