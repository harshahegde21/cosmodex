"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  BookOpen,
  Code2,
  Hammer,
  Users,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Learn",
    icon: BookOpen,
    href: "#",
    children: ["Courses", "Tracks", "Tutorials"],
  },
  {
    label: "Practice",
    icon: Code2,
    href: "#",
    children: ["Challenge Packs", "Builds", "#30NitesOfCode"],
  },
  { label: "Build", icon: Hammer, href: "#" },
  { label: "Community", icon: Users, href: "#", children: ["Crews", "Forum", "Events"] },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border-subtle bg-bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-container items-center justify-between px-6 gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Cosmodex logo"
            width={28}
            height={28}
            className="rounded-sm"
          />
          <span className="font-lato font-black text-xl text-text-primary tracking-wide">
            CosmoDex
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="nav-link group">
                <item.icon size={15} className="opacity-70 group-hover:opacity-100" />
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={13}
                    className={`ml-0.5 transition-transform duration-150 ${activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>

              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-1 w-44 card py-1.5 shadow-card animate-fade-in">
                  {item.children.map((child) => (
                    <Link
                      key={child}
                      href="#"
                      className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors duration-100"
                    >
                      {child}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            id="navbar-search"
            aria-label="Search"
            className="btn-icon focus-ring hidden sm:flex"
          >
            <Search size={16} />
          </button>

          {/* Notifications */}
          <button
            id="navbar-notifications"
            aria-label="Notifications"
            className="btn-icon focus-ring relative hidden sm:flex"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
          </button>

          {/* Avatar */}
          <button
            id="navbar-avatar"
            aria-label="User menu"
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-sm hover:bg-bg-elevated transition-colors duration-150 focus-ring"
          >
            <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-medium overflow-hidden flex items-center justify-center">
              <Image
                src="/images/mascot.png"
                alt="avatar"
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <ChevronDown size={13} className="text-text-muted hidden sm:block" />
          </button>

          {/* Join Crew CTA */}
          <Link href="#" id="navbar-join-crew" className="btn-primary hidden sm:inline-flex">
            Join Crew
          </Link>

          {/* Mobile hamburger */}
          <button
            className="btn-icon md:hidden focus-ring"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-bg-surface px-4 py-3 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link key={item.label} href="#" className="nav-link w-full">
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border-subtle">
            <Link href="#" className="btn-primary w-full justify-center">
              Join Crew
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
