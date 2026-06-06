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

// ─── WordmarkIcon (SVG logo) ──────────────────────────────────────────────────
function WordmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 84 24" fill="currentColor" {...props}>
      <path d="M45.035 23.984c-1.34-.062-2.566-.441-3.777-1.16-1.938-1.152-3.465-3.187-4.02-5.36-.199-.784-.238-1.128-.234-2.058 0-.691.008-.87.062-1.207.23-1.5.852-2.883 1.852-4.144.297-.371 1.023-1.09 1.41-1.387 1.399-1.082 2.84-1.68 4.406-1.816.536-.047 1.528-.02 2.047.054 1.227.184 2.227.543 3.106 1.121 1.277.84 2.5 2.184 3.367 3.7.098.168.172.308.172.312-.004 0-1.047.723-2.32 1.598l-2.711 1.867c-.61.422-2.91 2.008-2.993 2.062l-.074.047-1-1.574c-.55-.867-1.008-1.594-1.012-1.61-.007-.019.922-.648 2.188-1.476 1.215-.793 2.2-1.453 2.191-1.46-.02-.032-.508-.27-.691-.34a5 5 0 0 0-.465-.13c-.371-.09-1.105-.125-1.426-.07-1.285.219-2.336 1.3-2.777 2.852-.215.761-.242 1.636-.074 2.355.129.527.383 1.102.691 1.543.234.332.727.82 1.047 1.031.664.434 1.195.586 1.969.555.613-.023 1.027-.129 1.64-.426 1.184-.574 2.16-1.554 2.828-2.843.122-.235.208-.372.227-.368.082.032 3.77 1.938 3.79 1.961.034.032-.407.93-.696 1.414a12 12 0 0 1-1.051 1.477c-.36.422-1.102 1.14-1.492 1.445a9.9 9.9 0 0 1-3.23 1.684 9.2 9.2 0 0 1-2.95.351M74.441 23.996c-1.488-.043-2.8-.363-4.066-.992-1.687-.848-2.992-2.14-3.793-3.774-.605-1.234-.863-2.402-.863-3.894.004-1.149.176-2.156.527-3.11.14-.378.531-1.171.75-1.515 1.078-1.703 2.758-2.934 4.805-3.524.847-.242 1.465-.332 2.433-.351 1.032-.024 1.743.055 2.48.277l.31.09.007 2.48c.004 1.364 0 2.481-.008 2.481a1 1 0 0 1-.12-.055c-.688-.347-2.09-.488-2.962-.296-.754.167-1.296.453-1.785.945a3.7 3.7 0 0 0-1.043 2.11c-.047.382-.02 1.109.055 1.437a3.4 3.4 0 0 0 .941 1.738c.75.75 1.715 1.102 2.875 1.05.645-.03 1.118-.14 1.563-.366q1.721-.864 2.02-3.145c.035-.293.042-1.266.042-7.957V0H84l-.012 8.434c-.008 7.851-.011 8.457-.054 8.757-.196 1.274-.586 2.25-1.301 3.243-1.293 1.808-3.555 3.07-6.145 3.437-.664.098-1.43.14-2.047.125M9.848 23.574a14 14 0 0 1-1.137-.152c-2.352-.426-4.555-1.781-6.117-3.774-.27-.335-.75-1.05-.95-1.406-1.156-2.047-1.695-4.27-1.64-6.77.047-1.995.43-3.66 1.23-5.316.524-1.086 1.04-1.87 1.793-2.715C4.567 1.72 6.652.535 8.793.171 9.68.02 10.093 0 12.297 0h1.789v5.441l-.961.016c-2.36.04-3.441.215-4.441.719-.836.414-1.278.879-1.895 1.976-.219.399-.535 1.02-.535 1.063 0 .02 1.285.027 3.918.027h3.914v5.113h-3.914c-2.54 0-3.918.008-3.918.028 0 .05.254.597.441.953.344.656.649 1.086 1.051 1.48.668.657 1.356.985 2.445 1.16.645.106 1.274.145 2.61.16l1.285.016v5.442l-2.055-.004a120 120 0 0 1-2.183-.016M16.469 14.715c0-5.504.011-9.04.031-9.29a5.54 5.54 0 0 1 1.527-3.48c.778-.82 1.922-1.457 3.118-1.734C21.915.035 22.422 0 24.39 0h1.652v4.914h-1.426c-1.324 0-1.445.004-1.644.055-.739.191-1.059.699-1.106 1.754l-.015.355h4.191v4.914h-4.184v11.602h-5.39ZM27.023 14.727c0-5.223.012-9.04.028-9.278.129-1.98 1.234-3.68 3.012-4.62.87-.462 1.777-.716 2.851-.802A61 61 0 0 1 34.945 0h1.649v4.914h-1.426c-1.32 0-1.441.004-1.64.055-.739.191-1.063.699-1.106 1.754l-.02.355h4.192v4.914H32.41v11.602h-5.387ZM55.48 15.406V7.22h4.66v1.363c0 1.3.005 1.363.051 1.363.04 0 .075-.054.133-.203.38-.98.969-1.68 1.711-2.031.563-.266 1.422-.43 2.492-.48l.414-.02v4.914l-.414.035c-.738.063-1.597.195-2.058.313-.297.082-.688.28-.875.449-.324.289-.532.703-.625 1.254-.094.547-.098.879-.098 5.144v4.274h-5.39Zm0 0" />
    </svg>
  );
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
          fontFamily: "var(--font-display), sans-serif",
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
            fontFamily: "var(--font-display), sans-serif",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: "11.5px",
              color: "rgba(240,230,255,0.38)",
              fontFamily: "var(--font-body), sans-serif",
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
  onClose,
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
          fontFamily: "var(--font-display), sans-serif",
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
          fontFamily: "var(--font-display), sans-serif",
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
            fontFamily: "var(--font-display), sans-serif",
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
            fontFamily: "var(--font-display), sans-serif",
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
                        fontFamily: "var(--font-body), sans-serif",
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
                    fontFamily: "var(--font-display), sans-serif",
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
                  fontFamily: "var(--font-display), sans-serif",
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
                  fontFamily: "var(--font-display), sans-serif",
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
