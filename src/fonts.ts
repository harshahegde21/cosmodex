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
 *  display  →  --font-display  →  hero headings, section titles, feature card titles,
 *                                  achievement titles, decorative game elements ONLY
 *  body     →  --font-body     →  ALL other text: nav, buttons, descriptions,
 *                                  badges, forms, footer, cards, modals
 *  mono     →  --font-mono     →  code blocks, terminal mockups, XP values
 *                                  (same as body — unified Fira Code)
 */

import localFont from "next/font/local";
import {
  // ── BODY font (all UI text — nav, buttons, descriptions, forms, footer) ──────
  // Fira Code: monospace with programming ligatures — developer-centric aesthetic
  Fira_Code as BodyFont,

  // ── MONO font (code blocks, terminal, XP values) ──────────────────────────────
  // Same as body — unified Fira Code throughout for a cohesive dev experience
  Fira_Code as MonoFont,
} from "next/font/google";

// ── Display ──────────────────────────────────────────────────────────────────
// Hitchcut: ONLY for hero headings, section titles, feature card titles,
// achievement titles, and decorative gaming elements.
// NOT for nav links, buttons, badges, body text, or UI labels.
export const displayFont = localFont({
  src: [
    {
      path: "../public/fonts/Hitchcut Font/Hitchcut-typeface/Hitchcut-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// ── Body ─────────────────────────────────────────────────────────────────────
// Fira Code as the primary application font — nav links, buttons, descriptions,
// form elements, badges, footer content, cards, modals, and ALL UI text.
export const bodyFont = BodyFont({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// ── Mono ─────────────────────────────────────────────────────────────────────
// Fira Code — code blocks, terminal mockups, XP values, stat numbers.
// Unified with body for a seamless developer experience.
export const monoFont = MonoFont({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
