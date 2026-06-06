"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  /** horizontal drift — subtle side sway */
  driftFreq: number;
  driftAmp: number;
  driftOffset: number;
}

const COLORS = [
  "#ff2d78",
  "#ff6ba8",
  "#9b30ff",
  "#c084fc",
  "#ffffff",
  "#ffffff",
  "#ffffff",
];

function makeStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,         // seed anywhere in the canvas
      size: Math.random() * 2.2 + 0.4,
      speed: Math.random() * 0.45 + 0.12,
      opacity: 0,
      maxOpacity: Math.random() * 0.55 + 0.15,
      color,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
      driftFreq: Math.random() * 0.008 + 0.003,
      driftAmp: Math.random() * 18 + 4,
      driftOffset: Math.random() * Math.PI * 2,
    };
  });
}

interface RisingStarsProps {
  /** Approximate number of stars. Default 90. */
  count?: number;
  /** Overall brightness multiplier 0–1. Default 1. */
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function RisingStars({
  count = 90,
  intensity = 1,
  className,
  style,
}: RisingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      starsRef.current = makeStars(count, width, height);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      frameRef.current += 1;
      ctx.clearRect(0, 0, width, height);

      for (const star of starsRef.current) {
        // Rise upward
        star.y -= star.speed;

        // Horizontal drift
        const drift =
          Math.sin(frameRef.current * star.driftFreq + star.driftOffset) *
          star.driftAmp;

        // Fade in as it rises from bottom half, fade out near top
        const progress = 1 - star.y / height;          // 0 at bottom → 1 at top
        const fadeIn = Math.min(progress * 3, 1);      // first third: fade in
        const fadeOut = Math.max(0, (1 - progress) * 3 - 2); // last third: fade out
        const lifecycle = Math.min(fadeIn, 1) * (progress > 0.67 ? Math.max(1 - (progress - 0.67) * 3, 0) : 1);

        // Twinkle
        const twinkle =
          0.7 +
          0.3 *
            Math.sin(
              frameRef.current * star.twinkleSpeed + star.twinkleOffset
            );

        star.opacity = star.maxOpacity * lifecycle * twinkle * intensity;

        // Reset star when it exits the top
        if (star.y < -10) {
          star.y = height + Math.random() * 20;
          star.x = Math.random() * width;
          star.opacity = 0;
        }

        if (star.opacity <= 0.005) continue;

        const px = star.x + drift;
        const r = star.size;

        // Glow halo
        const glow = ctx.createRadialGradient(px, star.y, 0, px, star.y, r * 5);
        glow.addColorStop(0, hexAlpha(star.color, star.opacity * 0.9));
        glow.addColorStop(0.35, hexAlpha(star.color, star.opacity * 0.35));
        glow.addColorStop(1, hexAlpha(star.color, 0));

        ctx.beginPath();
        ctx.arc(px, star.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, star.y, r, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(star.color, Math.min(star.opacity * 2, 1));
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [count, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
    />
  );
}

/** Convert a 6-char hex colour + alpha 0-1 → rgba() string */
function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}
