/**
 * ─── Font Configuration ───────────────────────────────────────────────────────
 *
 * This is the ONLY file you need to edit to change fonts site-wide.
 *
 * HOW TO SWAP A FONT
 * ──────────────────
 * 1. Pick a font from https://fonts.google.com
 * 2. Import it below (replace the existing import for that role)
 * 3. Update the font() call — change the function name and adjust weights
 *    if the new font supports different ones
 * 4. Save — the CSS variables update automatically everywhere
 *
 * FONT ROLES
 * ──────────
 *  display  →  --font-display  →  headings, nav, badges, buttons, labels
 *  body     →  --font-body     →  paragraphs, descriptions, body copy
 *  mono     →  --font-mono     →  code blocks, terminal mockups, XP values
 *
 * POPULAR SWAP OPTIONS (just change the import + function name)
 * ─────────────────────────────────────────────────────────────
 *  Display alternatives:
 *    Outfit | Syne | Clash Display | DM Sans | Manrope | Raleway
 *    Inter | Urbanist | Cabinet Grotesk | Bricolage Grotesque
 *
 *  Body alternatives:
 *    Inter | DM Sans | Nunito | Lato | Source Sans 3
 *    Geist | Figtree | Onest | Instrument Sans
 *
 *  Mono alternatives:
 *    Fira Code | Source Code Pro | IBM Plex Mono | Roboto Mono
 *    Geist Mono | Inconsolata | Cascadia Code
 */

import {
  // ── DISPLAY font (headings, nav, buttons) ──────────────────────────────────
  // Swap: replace "Space_Grotesk" with any Google Font name (snake_case)
  Space_Grotesk as DisplayFont,

  // ── BODY font (paragraphs, descriptions) ──────────────────────────────────
  // Swap: replace "Plus_Jakarta_Sans" with any Google Font name (snake_case)
  Plus_Jakarta_Sans as BodyFont,

  // ── MONO font (code, terminal, XP values) ─────────────────────────────────
  // Swap: replace "JetBrains_Mono" with any Google Font name (snake_case)
  JetBrains_Mono as MonoFont,
} from "next/font/google";

// ── Display ──────────────────────────────────────────────────────────────────
// Adjust `weight` if your chosen font supports different values
export const displayFont = DisplayFont({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// ── Body ─────────────────────────────────────────────────────────────────────
export const bodyFont = BodyFont({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// ── Mono ─────────────────────────────────────────────────────────────────────
export const monoFont = MonoFont({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
