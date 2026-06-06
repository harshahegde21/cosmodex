"use client";

/**
 * ClickParticles
 * --------------
 * Renders a canvas overlay that spawns star-shaped pink/purple particles
 * at the cursor position on every click. Particles fade, scale, and drift
 * upward over ~700ms then are removed. Lightweight — only active during
 * the short burst, then RAF stops.
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;     // 0→1 (1 = just born, 0 = dead)
  decay: number;    // how fast life decreases per frame
  type: "star" | "dot"; // shape variety
}

const COLORS = [
  "#ff2d78",
  "#ff6ba8",
  "#c084fc",
  "#9b30ff",
  "#ffffff",
  "#ffb3d1",
];

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}

export default function ClickParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);

  // Resize canvas to match viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation loop — only runs while particles exist
  const startLoop = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      const particles = particlesRef.current;
      if (particles.length === 0) {
        isAnimatingRef.current = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gentle gravity
        p.vx *= 0.97; // air resistance
        p.rotation += p.rotationSpeed;

        const alpha = Math.min(p.life * 1.5, 1);
        const scale = p.life < 0.3 ? p.life / 0.3 : 1;

        ctx.save();
        ctx.globalAlpha = alpha * p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "dot") {
          // Glowing circle
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * scale);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(0, 0, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        } else {
          // Star shape
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 3;
          drawStar(ctx, 0, 0, 4, p.size * scale, (p.size * scale) * 0.4);
          ctx.fill();
        }

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  // Spawn particles on click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const count = 8 + Math.floor(Math.random() * 5); // 8–12 particles
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 1.2 + Math.random() * 2.8;
        const isSmall = Math.random() > 0.5;

        newParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5, // bias upward
          size: isSmall ? 3 + Math.random() * 3 : 5 + Math.random() * 4,
          opacity: 0.7 + Math.random() * 0.3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          life: 1,
          decay: 0.022 + Math.random() * 0.018, // ~700-1000ms lifetime
          type: Math.random() > 0.35 ? "star" : "dot",
        });
      }

      particlesRef.current.push(...newParticles);
      startLoop();
    };

    window.addEventListener("click", handleClick, { passive: true });
    return () => {
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
