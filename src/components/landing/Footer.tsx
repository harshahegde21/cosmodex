"use client";

import RisingStars from "@/components/landing/RisingStars";

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "52px 0 36px",
        overflow: "hidden",
      }}
    >
      {/* Rising stars — very subtle in footer */}
      <RisingStars count={40} intensity={0.4} />
      <div className="container-custom">
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "32px",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "260px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                marginBottom: "14px",
              }}
            >
              {/* Logo icon matching navbar */}
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="5.5" fill="url(#footer-logo-grad)" />
                <ellipse
                  cx="14"
                  cy="14"
                  rx="12"
                  ry="5"
                  stroke="url(#footer-ring-grad)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeDasharray="3 2"
                />
                <circle cx="22.5" cy="10.5" r="2" fill="#ff6ba8" opacity="0.9" />
                <circle cx="12.5" cy="12.5" r="1.5" fill="white" opacity="0.35" />
                <defs>
                  <radialGradient id="footer-logo-grad" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#ff6ba8" />
                    <stop offset="100%" stopColor="#7c22ff" />
                  </radialGradient>
                  <linearGradient id="footer-ring-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff2d78" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#c084fc" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#9b30ff" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  fontFamily: "var(--font-display), 'Space Grotesk', sans-serif",
                }}
              >
                CosmoDeX
              </span>
            </div>
            <p
              style={{
                fontSize: "13.5px",
                color: "rgba(240,230,255,0.32)",
                lineHeight: 1.65,
                fontFamily: "var(--font-body), sans-serif",
              }}
            >
              Start your coding expedition. Learn, battle, and level up
              through the cosmos.
            </p>
          </div>

          {/* Links columns */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              flexWrap: "wrap",
            }}
          >
            <FooterColumn
              title="Learn"
              links={["Courses", "Battle Arena", "Leaderboard", "Changelog"]}
            />
            <FooterColumn
              title="Community"
              links={["Join the Crew", "Discord", "Forum", "Support"]}
            />
            <FooterColumn
              title="Legal"
              links={["Privacy Policy", "Terms of Service", "Cookie Policy"]}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: "24px" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: "12.5px",
              color: "rgba(240,230,255,0.22)",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            © 2026 CosmoDeX. Built with ✦ for the cosmos.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Discord */}
            <SocialButton
              label="Discord"
              hoverColor="rgba(255,45,120,0.12)"
              hoverBorder="rgba(255,45,120,0.3)"
              hoverText="#ff2d78"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M16.942 1.556a16.3 16.3 0 00-4.126-1.3 12.04 12.04 0 00-.529 1.1 15.175 15.175 0 00-4.573 0 11.585 11.585 0 00-.535-1.1 16.274 16.274 0 00-4.129 1.3A17.392 17.392 0 00.182 13.218a15.785 15.785 0 004.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 01-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0010.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 001.084 1.785 16.46 16.46 0 005.064-2.595 17.286 17.286 0 00-2.973-11.59z" />
              </svg>
            </SocialButton>

            {/* GitHub */}
            <SocialButton
              label="GitHub"
              hoverColor="rgba(155,48,255,0.12)"
              hoverBorder="rgba(155,48,255,0.3)"
              hoverText="#9b30ff"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </SocialButton>

            <div
              style={{
                fontSize: "11.5px",
                color: "rgba(240,230,255,0.18)",
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.04em",
                marginLeft: "4px",
              }}
            >
              v1.0.0-beta
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "rgba(240,230,255,0.35)",
          marginBottom: "4px",
          fontFamily: "var(--font-display), sans-serif",
        }}
      >
        {title}
      </div>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          style={{
            fontSize: "13.5px",
            color: "rgba(240,230,255,0.42)",
            textDecoration: "none",
            transition: "color 0.18s ease",
            fontFamily: "var(--font-body), sans-serif",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(240,230,255,0.82)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "rgba(240,230,255,0.42)")
          }
        >
          {link}
        </a>
      ))}
    </div>
  );
}

function SocialButton({
  children,
  label,
  hoverColor,
  hoverBorder,
  hoverText,
}: {
  children: React.ReactNode;
  label: string;
  hoverColor: string;
  hoverBorder: string;
  hoverText: string;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "9px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(240,230,255,0.45)",
        transition: "all 0.2s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = hoverColor;
        el.style.borderColor = hoverBorder;
        el.style.color = hoverText;
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.04)";
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.color = "rgba(240,230,255,0.45)";
        el.style.transform = "translateY(0)";
      }}
    >
      {children}
    </a>
  );
}
