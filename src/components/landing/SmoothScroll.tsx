"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Extend window type cleanly
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      orientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
