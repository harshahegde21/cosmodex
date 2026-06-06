import {
  Space_Grotesk as DisplayFont,
  Plus_Jakarta_Sans as BodyFont,
  JetBrains_Mono as MonoFont,
} from "next/font/google";

export const displayFont = DisplayFont({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const bodyFont = BodyFont({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const monoFont = MonoFont({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
