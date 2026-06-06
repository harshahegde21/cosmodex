"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Learn",    href: "#courses"      },
  { label: "Practice", href: "#battle-arena" },
  { label: "Pricing",  href: "#pricing"      },
];

function LogoIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="5.5" fill="url(#nb-lg)" />
      <ellipse cx="14" cy="14" rx="12" ry="5" stroke="url(#nb-lr)"
        strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
      <circle cx="22.5" cy="10.5" r="2" fill="#ff6ba8" opacity="0.9" />
      <circle cx="12.5" cy="12.5" r="1.5" fill="white" opacity="0.35" />
      <defs>
        <radialGradient id="nb-lg" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ff6ba8" />
          <stop offset="100%" stopColor="#7c22ff" />
        </radialGradient>
        <linearGradient id="nb-lr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ff2d78" stopOpacity="0.8" />
          <stop offset="50%"  stopColor="#c084fc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#9b30ff" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [visible,      setVisible]      = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [logoHovered,  setLogoHovered]  = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight; // hero is 100vh
      const past = window.scrollY > heroHeight * 0.75; // start appearing at 75% of hero
      setScrolled(window.scrollY > 60);
      setVisible(past);
    };
    // Run once on mount so state is correct on first paint
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const go = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  /* ─── shared pill style ─────────────────────────────────────────────── */
  const pillStyle: React.CSSProperties = {
    height:           scrolled ? "54px" : "60px",
    borderRadius:     "100px",
    background:       scrolled ? "rgba(5,5,8,0.88)" : "rgba(5,5,8,0.55)",
    backdropFilter:   "blur(28px) saturate(1.6)",
    WebkitBackdropFilter: "blur(28px) saturate(1.6)",
    border:           scrolled ? "1px solid rgba(255,255,255,0.11)" : "1px solid rgba(255,255,255,0.07)",
    boxShadow:        scrolled
      ? "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
      : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
    transition:       "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    display:          "flex",
    alignItems:       "center",
    padding:          "0 20px 0 24px",
    gap:              "0",
  };

  return (
    <>
      {/* ── Navbar pill ─────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: visible ? 1 : 0,
          y:       visible ? 0 : -50,
          pointerEvents: visible ? "auto" : "none",
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
        style={{
          position:  "fixed",
          top:       scrolled ? "12px" : "20px",
          left:      isMobile ? "16px" : "0",
          right:     isMobile ? "16px" : "0",
          marginLeft:  "auto",
          marginRight: "auto",
          transform: "none",
          zIndex:    50,
          width:     isMobile ? "calc(100vw - 32px)" : "fit-content",
          minWidth:  isMobile ? "auto" : "580px",
          transition: "top 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={pillStyle}>

          {/* ── Logo ── */}
          <a
            href="#"
            onClick={(e) => go(e, "#hero")}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            style={{ display: "flex", alignItems: "center", gap: "8px",
                     textDecoration: "none", flexShrink: 0 }}
            aria-label="CosmoDeX home"
          >
            <motion.span
              animate={{ rotate: logoHovered ? 360 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex" }}
            >
              <LogoIcon />
            </motion.span>
            <span style={{
              fontWeight: 700, fontSize: "16px", letterSpacing: "-0.03em",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}>
              CosmoDeX
            </span>
          </a>

          {/* ── Separator ── */}
          {!isMobile && (
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)",
                          margin: "0 16px", flexShrink: 0 }} />
          )}

          {/* ── Nav links (desktop) ── */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1,
                          justifyContent: "center" }}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  style={{
                    padding: "7px 13px", borderRadius: "100px",
                    fontSize: "14px", fontWeight: 500,
                    color: "rgba(240,230,255,0.6)",
                    textDecoration: "none", whiteSpace: "nowrap",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.color = "#fff";
                    t.style.background = "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.color = "rgba(240,230,255,0.6)";
                    t.style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* ── Spacer pushes CTA to right on desktop ── */}
          {!isMobile && (
            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.08)",
                          margin: "0 16px", flexShrink: 0 }} />
          )}

          {/* ── CTA (desktop) ── */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <a
                href="#signup"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "8px 18px", borderRadius: "100px",
                  fontSize: "14px", fontWeight: 600, color: "#fff",
                  background: "linear-gradient(135deg,#ff2d78,#9b30ff)",
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget as HTMLElement;
                  t.style.transform = "translateY(-1px)";
                  t.style.boxShadow = "0 6px 22px rgba(255,45,120,0.45)";
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget as HTMLElement;
                  t.style.transform = "translateY(0)";
                  t.style.boxShadow = "none";
                }}
              >
                Sign Up
              </a>
            </div>
          )}

          {/* ── Hamburger (mobile) ── */}
          {isMobile && (
            <>
              {/* push hamburger to right */}
              <div style={{ flex: 1 }} />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                style={{
                  width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer",
                  background: menuOpen ? "rgba(255,45,120,0.12)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${menuOpen ? "rgba(255,45,120,0.3)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: "5px", padding: 0,
                  transition: "all 0.22s ease",
                }}
              >
                {[
                  menuOpen ? "rotate(45deg) translate(4.5px,4.5px)"  : "none",
                  "none",
                  menuOpen ? "rotate(-45deg) translate(4.5px,-4.5px)" : "none",
                ].map((transform, i) => (
                  <span key={i} style={{
                    display: "block", width: "15px", height: "1.5px",
                    background: "rgba(240,230,255,0.85)", borderRadius: "1px",
                    transition: "all 0.28s ease",
                    transform,
                    opacity: i === 1 && menuOpen ? 0 : 1,
                  }} />
                ))}
              </button>
            </>
          )}

        </div>
      </motion.nav>

      {/* ── Mobile dropdown ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{    opacity: 0, y: -8,   scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "fixed", top: "84px", left: "50%",
                transform: "translateX(-50%)",
                width: "min(calc(100vw - 32px), 360px)",
                zIndex: 49,
                background: "rgba(5,5,8,0.95)",
                backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "20px", padding: "10px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={(e) => go(e, link.href)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 14px", borderRadius: "12px",
                    fontSize: "15px", fontWeight: 500,
                    color: "rgba(240,230,255,0.72)", textDecoration: "none",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.background = "rgba(255,255,255,0.05)";
                    t.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget as HTMLElement;
                    t.style.background = "transparent";
                    t.style.color = "rgba(240,230,255,0.72)";
                  }}
                >
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#ff2d78,#9b30ff)", flexShrink: 0 }} />
                  {link.label}
                </motion.a>
              ))}

              <div style={{ height: "1px", margin: "8px 0",
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)" }} />

              <a
                href="#signup"
                style={{
                  display: "flex", justifyContent: "center",
                  padding: "12px", borderRadius: "12px",
                  fontSize: "15px", fontWeight: 600, color: "#fff",
                  background: "linear-gradient(135deg,#ff2d78,#9b30ff)",
                  textDecoration: "none",
                }}
              >
                ✦ Sign Up Free
              </a>
            </motion.div>

            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 48,
                background: "rgba(0,0,0,0.35)" }}
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
