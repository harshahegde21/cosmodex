import localFont from "next/font/local";
import { Fira_Code as BodyFont, Fira_Code as MonoFont } from "next/font/google";

// Hitchcut — display only (hero headings, section titles, achievements)
export const displayFont = localFont({
  src: [
    {
      path: "../../public/fonts/Hitchcut Font/Hitchcut-typeface/Hitchcut-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// Fira Code — primary application font (all UI text)
export const bodyFont = BodyFont({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Fira Code — code/mono contexts (unified with body)
export const monoFont = MonoFont({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
