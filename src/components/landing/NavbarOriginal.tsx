"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Learn", href: "#courses" },
  { label: "Practice", href: "#battle-arena" },
  { label: "Pricing", href: "#pricing" },
];

export default function NavbarOriginal() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/8 bg-white/5 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center justify-between px-6 sm:px-10 gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo.png"
            alt="CosmoDeX logo"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <span className="font-lato font-black text-xl text-white tracking-wide">
            CosmoDeX
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => go(e, link.href)}
              className="text-sm font-bold text-white/60 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right Controls ── */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a
            href="/onboarding"
            className="cosmo-btn-primary px-6 py-2 rounded-xl text-sm font-bold text-white"
          >
            Sign Up Free
          </a>
        </div>

        {/* ── Mobile Menu Toggle ── */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMobileOpen(true)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-[#1A1525]/95 backdrop-blur-xl border-b border-white/10 p-4 md:hidden flex flex-col gap-2"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/onboarding"
              onClick={() => setMobileOpen(false)}
              className="mt-4 cosmo-btn-primary w-full px-6 py-3 rounded-xl text-sm font-bold text-center"
            >
              Sign Up Free
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
