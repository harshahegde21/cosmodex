"use client";

/**
 * NavbarNew — adapted from the pasted shadcn/Radix design.
 * Works with the existing stack: Tailwind v4 + framer-motion + lucide-react.
 * No shadcn, no Radix, no extra installs needed.
 *
 * TO SWITCH BACK:  in page.tsx change
 *   import Navbar from "@/components/NavbarNew"
 *   → import Navbar from "@/components/NavbarOriginal"
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CodeIcon,
  GlobeIcon,
  LayersIcon,
  UserPlusIcon,
  Users,
  Star,
  FileText,
  Shield,
  RotateCcw,
  Handshake,
  Leaf,
  HelpCircle,
  BarChart,
  PlugIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  LucideIcon,
} from "lucide-react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const productLinks: LinkItem[] = [
  { title: "Website Builder",     href: "#", description: "Create responsive websites with ease",          icon: GlobeIcon    },
  { title: "Cloud Platform",      href: "#", description: "Deploy and scale apps in the cloud",            icon: LayersIcon   },
  { title: "Team Collaboration",  href: "#", description: "Tools to help your teams work better together", icon: UserPlusIcon },
  { title: "Analytics",           href: "#", description: "Track and analyze your website traffic",        icon: BarChart     },
  { title: "Integrations",        href: "#", description: "Connect your apps and services",                icon: PlugIcon     },
  { title: "API",                 href: "#", description: "Build custom integrations with our API",        icon: CodeIcon     },
];

const companyLinks: LinkItem[] = [
  { title: "About Us",       href: "#", description: "Learn more about our story and team",        icon: Users     },
  { title: "Customer Stories", href: "#", description: "See how we've helped our clients succeed", icon: Star      },
  { title: "Partnerships",   href: "#", description: "Collaborate with us for mutual growth",       icon: Handshake },
];

const companyLinks2: LinkItem[] = [
  { title: "Terms of Service", href: "#", icon: FileText  },
  { title: "Privacy Policy",   href: "#", icon: Shield    },
  { title: "Refund Policy",    href: "#", icon: RotateCcw },
  { title: "Blog",             href: "#", icon: Leaf      },
  { title: "Help Center",      href: "#", icon: HelpCircle },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

// ─── Dropdown menu (desktop) ──────────────────────────────────────────────────
function DropdownMenu({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          color: "rgba(240,230,255,0.65)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "all 0.18s ease",
          fontFamily: "var(--font-body), 'Fira Code', monospace",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#fff";
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "rgba(240,230,255,0.65)";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex" }}
        >
          <ChevronDownIcon size={13} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{    opacity: 0, y: -6, scale: 0.97  }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              background: "rgba(8,4,15,0.55)",
              backdropFilter: "blur(40px) saturate(2)",
              WebkitBackdropFilter: "blur(40px) saturate(2)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
              minWidth: "480px",
              overflow: "hidden",
            }}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Link card used inside dropdowns ─────────────────────────────────────────
function LinkCard({ title, description, icon: Icon, href }: LinkItem) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "10px",
        textDecoration: "none",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "rgba(240,230,255,0.7)",
        }}
      >
        <Icon size={16} />
      </div>
      <div>
        <div
          style={{
            fontSize: "13.5px",
            fontWeight: 600,
            color: "rgba(240,230,255,0.9)",
            fontFamily: "var(--font-body), 'Fira Code', monospace",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: "11.5px",
              color: "rgba(240,230,255,0.38)",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
              marginTop: "1px",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </a>
  );
}

// ─── Mobile menu (portal) ─────────────────────────────────────────────────────
function MobileMenu({
  open,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "fixed",
        inset: 0,
        top: "56px",
        zIndex: 49,
        background: "rgba(8,4,15,0.55)",
        backdropFilter: "blur(40px) saturate(2)",
        WebkitBackdropFilter: "blur(40px) saturate(2)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        padding: "20px 16px",
        gap: "8px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(240,230,255,0.28)",
          fontFamily: "var(--font-body), 'Fira Code', monospace",
          padding: "4px 8px",
        }}
      >
        Product
      </div>
      {productLinks.map((l) => (
        <LinkCard key={l.title} {...l} />
      ))}

      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(240,230,255,0.28)",
          fontFamily: "var(--font-body), 'Fira Code', monospace",
          padding: "12px 8px 4px",
        }}
      >
        Company
      </div>
      {[...companyLinks, ...companyLinks2].map((l) => (
        <LinkCard key={l.title} {...l} />
      ))}

      <div
        style={{
          marginTop: "auto",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <a
          href="#"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "11px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(240,230,255,0.8)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            textDecoration: "none",
            fontFamily: "var(--font-body), 'Fira Code', monospace",
          }}
        >
          Sign In
        </a>
        <a
          href="#"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "11px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(135deg,#ff2d78,#9b30ff)",
            textDecoration: "none",
            fontFamily: "var(--font-body), 'Fira Code', monospace",
          }}
        >
          Get Started
        </a>
      </div>
    </motion.div>,
    document.body
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          width: "100%",
          pointerEvents: "auto",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.05)",
          background: scrolled
            ? "rgba(8,4,15,0.45)"
            : "rgba(8,4,15,0.15)",
          backdropFilter: "blur(32px) saturate(1.8)",
          WebkitBackdropFilter: "blur(32px) saturate(1.8)",
          /* top-edge gloss line */
          boxShadow: scrolled
            ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 32px rgba(0,0,0,0.25)"
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <nav
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="CosmoDeX"
                style={{ height: "44px", width: "auto", display: "block" }}
              />
            </a>

            {/* Desktop nav */}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <DropdownMenu label="Product">
                  <div style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4px",
                      }}
                    >
                      {productLinks.map((l) => (
                        <LinkCard key={l.title} {...l} />
                      ))}
                    </div>
                    <div
                      style={{
                        padding: "10px 12px 2px",
                        fontSize: "13px",
                        color: "rgba(240,230,255,0.38)",
                        fontFamily: "var(--font-body), 'Fira Code', monospace",
                      }}
                    >
                      Interested?{" "}
                      <a
                        href="#"
                        style={{
                          color: "rgba(240,230,255,0.78)",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Schedule a demo
                      </a>
                    </div>
                  </div>
                </DropdownMenu>

                <DropdownMenu label="Company">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0",
                      padding: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        paddingRight: "8px",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {companyLinks.map((l) => (
                        <LinkCard key={l.title} {...l} />
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        paddingLeft: "8px",
                      }}
                    >
                      {companyLinks2.map((l) => (
                        <LinkCard key={l.title} {...l} />
                      ))}
                    </div>
                  </div>
                </DropdownMenu>

                <a
                  href="#"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgba(240,230,255,0.65)",
                    textDecoration: "none",
                    transition: "all 0.18s ease",
                    fontFamily: "var(--font-body), 'Fira Code', monospace",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(240,230,255,0.65)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  Pricing
                </a>
              </div>
            )}
          </div>

          {/* CTA buttons — desktop */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                href="#"
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(240,230,255,0.75)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  transition: "all 0.18s ease",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(240,230,255,0.75)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                }}
              >
                Sign In
              </a>
              <a
                href="#"
                style={{
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  background: "linear-gradient(135deg,#ff2d78,#9b30ff)",
                  textDecoration: "none",
                  transition: "all 0.22s ease",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 22px rgba(255,45,120,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                Get Started
              </a>
            </div>
          )}

          {/* Hamburger — mobile */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                color: "rgba(240,230,255,0.8)",
                transition: "all 0.18s ease",
              }}
            >
              {menuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
            </button>
          )}
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && isMobile && (
          <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
