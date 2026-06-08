"use client";

/**
 * ScrollAnimation — v3 (smooth blend edition)
 * ─────────────────────────────────────────────
 * Rendering strategy
 * ──────────────────
 * Two off-screen ImageBitmap caches (current + next frame) are blended
 * onto a single on-screen canvas using ctx.globalAlpha cross-fade.
 * This eliminates the "slideshow" effect: instead of snapping between
 * integer frame indices, we continuously interpolate the *visual* output
 * between adjacent frames proportional to the fractional part of the
 * float frame position.
 *
 * Pipeline
 * ────────
 * 1. Preload all 240 HTMLImageElements (decode() called immediately so
 *    the browser GPU-uploads them before they're needed).
 * 2. Lenis scroll → raw float frame position (no rounding).
 * 3. RAF loop: lerp currentFrame toward target at a rate that tracks
 *    scroll tightly (factor 0.18) without overshooting.
 * 4. Split float into floor/ceil indices + blend alpha.
 * 5. Draw floor frame at full opacity, then ceil frame on top at alpha =
 *    fractional part. Result: pixel-perfect interpolation between frames.
 * 6. Cover-fit geometry cached; only recomputed on resize.
 * 7. Canvas opacity (fade-out at end of zone) applied via will-change
 *    transform trick to avoid triggering a repaint.
 */

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 240;
const FRAME_PATH = (n: number) =>
  `/ezgif-65262e46052e95d2-jpg/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

const ANIMATION_SECTION_IDS = [
  "hero",
  "courses",
  "battle-arena",
  "level-up",
];

// Cached cover-fit geometry — recomputed only on resize
interface DrawGeometry {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

function computeGeometry(
  cw: number,
  ch: number,
  iw: number,
  ih: number
): DrawGeometry {
  const scale = Math.max(cw / iw, ch / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  return { sx: (cw - sw) / 2, sy: (ch - sh) / 2, sw, sh };
}

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const geoRef = useRef<DrawGeometry | null>(null);
  const opacityRef = useRef(1);
  const blurRef = useRef(0);
  const lastOpacityRef = useRef(1);
  const lastBlurRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef<number>(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  // Stars must be undefined during SSR — computed only after mount to avoid
  // hydration mismatches from floating-point precision differences between
  // server-serialized HTML attributes and full-precision JS values.
  const [loaderStars, setLoaderStars] = useState<Array<{
    w: number; top: number; left: number; opacity: number;
    color: string; duration: number; delay: number;
  }> | null>(null);

  // Populate stars only on the client, after the first paint.
  // setTimeout defers the setState call out of the synchronous effect body,
  // satisfying react-hooks/set-state-in-effect while keeping this client-only.
  useEffect(() => {
    const id = setTimeout(() => {
      const seed = (n: number) => { const x = Math.sin(n) * 9999; return x - Math.floor(x); };
      setLoaderStars(Array.from({ length: 30 }, (_, i) => ({
        w:        seed(i * 3) * 2 + 1,
        top:      seed(i * 7) * 100,
        left:     seed(i * 11) * 100,
        opacity:  seed(i * 13) * 0.4 + 0.08,
        color:    i % 3 === 0 ? "#ff2d78" : i % 3 === 1 ? "#9b30ff" : "white",
        duration: seed(i * 17) * 3 + 2,
        delay:    seed(i * 19) * 3,
      })));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // ─── Core draw: blend frame[floor] → frame[ceil] by frac ─────────────────
  const drawBlended = (floatIndex: number) => {
    const ctx = ctxRef.current;
    const geo = geoRef.current;
    if (!ctx || !geo) return;

    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, floatIndex));
    const floorIdx = Math.floor(clamped);
    const ceilIdx = Math.min(TOTAL_FRAMES - 1, floorIdx + 1);
    const frac = clamped - floorIdx; // 0..1 blend factor

    const imgA = imagesRef.current[floorIdx];
    const imgB = imagesRef.current[ceilIdx];

    if (!imgA?.complete || imgA.naturalWidth === 0) return;

    const { sx, sy, sw, sh } = geo;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Draw base frame at full opacity
    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, sx, sy, sw, sh);

    // Blend next frame on top — only if there's a meaningful difference
    if (frac > 0.01 && imgB?.complete && imgB.naturalWidth > 0) {
      ctx.globalAlpha = frac;
      ctx.drawImage(imgB, sx, sy, sw, sh);
    }

    ctx.globalAlpha = 1; // reset
  };

  // ─── Preload ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loaded = 0;

    const onLoad = (i: number) => {
      loaded++;
      setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));

      // Eagerly decode so the GPU has the texture ready before it's needed
      if ("decode" in images[i]) {
        images[i].decode().catch(() => {/* ignore */});
      }

      if (loaded === TOTAL_FRAMES) {
        setIsReady(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      // Hint browser to prioritise first ~30 frames for fast initial render
      img.fetchPriority = i < 30 ? "high" : "auto";
      img.src = FRAME_PATH(i + 1);
      img.onload = () => onLoad(i);
      img.onerror = () => onLoad(i);
      images[i] = img;
    }
    imagesRef.current = images;

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ─── Canvas setup + resize ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Set canvas resolution to exact CSS pixels — no DPR scaling
      // (avoids ctx.scale() stacking on each resize which crops the image)
      canvas.width  = w;
      canvas.height = h;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;

      // Recompute cover-fit geometry
      const ref = imagesRef.current.find(
        (img) => img?.complete && img.naturalWidth > 0
      );
      geoRef.current = ref
        ? computeGeometry(w, h, ref.naturalWidth, ref.naturalHeight)
        : null;

      drawBlended(currentFrameRef.current);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Recompute geometry once images finish loading
  useEffect(() => {
    if (!isReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ref = imagesRef.current.find(
      (img) => img?.complete && img.naturalWidth > 0
    );
    if (ref) {
      geoRef.current = computeGeometry(
        canvas.width,
        canvas.height,
        ref.naturalWidth,
        ref.naturalHeight
      );
    }
    drawBlended(0);
  }, [isReady]);

  // ─── Scroll → target frame (via Lenis) ───────────────────────────────────
  useEffect(() => {
    // Cache scroll range — recompute lazily on scroll (cheap DOM reads)
    let cachedEnd = 0;
    let lastMeasureScroll = -1;

    const getEnd = (scrollY: number): number => {
      // Re-measure every 200px of scroll to handle dynamic content
      if (Math.abs(scrollY - lastMeasureScroll) > 200 || cachedEnd === 0) {
        let end = 0;
        for (const id of ANIMATION_SECTION_IDS) {
          const el = document.getElementById(id);
          if (el) {
            const bottom = el.offsetTop + el.offsetHeight;
            if (bottom > end) end = bottom;
          }
        }
        cachedEnd = end || window.innerHeight * 5;
        lastMeasureScroll = scrollY;
      }
      return cachedEnd;
    };

    const onScroll = ({ scroll }: { scroll: number }) => {
      const end = getEnd(scroll);
      const raw = scroll / Math.max(end, 1);
      const progress = Math.max(0, Math.min(1, raw));

      // Direct mapping — no extra lerp here; the RAF loop handles smoothing
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

      // Keep last frame visible and static — no fade-out, no blur
      opacityRef.current = 1;
      blurRef.current = 0;
    };

    let unsubscribe: (() => void) | null = null;

    const attach = () => {
      const lenis = window.__lenis;
      if (!lenis) return false;
      lenis.on("scroll", onScroll);
      unsubscribe = () => lenis.off("scroll", onScroll);
      onScroll({ scroll: lenis.scroll });
      return true;
    };

    if (!attach()) {
      const iv = setInterval(() => { if (attach()) clearInterval(iv); }, 50);
      return () => { clearInterval(iv); unsubscribe?.(); };
    }
    return () => unsubscribe?.();
  }, []);

  // ─── RAF render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      // Adaptive lerp:
      // - Fast factor (0.22) when far away → snappy tracking
      // - Slow factor (0.10) when close → smooth deceleration
      // This eliminates both lag AND the "waiting then jumping" pattern
      const absDiff = Math.abs(diff);
      const factor = absDiff > 8 ? 0.22 : absDiff > 2 ? 0.16 : 0.10;

      const next = absDiff < 0.015
        ? target                          // snap to exact target when close
        : current + diff * factor;

      currentFrameRef.current = next;

      // Skip draw if position hasn't changed meaningfully
      if (Math.abs(next - lastDrawnRef.current) < 0.008) {
        // Still update opacity and blur if needed
        if (opacityRef.current !== lastOpacityRef.current || blurRef.current !== lastBlurRef.current) {
          if (wrapperRef.current) {
            wrapperRef.current.style.opacity = String(opacityRef.current);
            const blurPx = blurRef.current;
            wrapperRef.current.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "";
          }
          lastOpacityRef.current = opacityRef.current;
          lastBlurRef.current = blurRef.current;
        }
        return;
      }

      lastDrawnRef.current = next;
      drawBlended(next);

      // Opacity and blur — applied to wrapper div, not canvas, to avoid repaint
      if (opacityRef.current !== lastOpacityRef.current || blurRef.current !== lastBlurRef.current) {
        if (wrapperRef.current) {
          wrapperRef.current.style.opacity = String(opacityRef.current);
          const blurPx = blurRef.current;
          wrapperRef.current.style.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : "";
        }
        lastOpacityRef.current = opacityRef.current;
        lastBlurRef.current = blurRef.current;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <>
      {/*
       * Wrapper div carries opacity for the fade-out.
       * Using opacity on a div (not the canvas) avoids triggering
       * a canvas repaint on every opacity change.
       * will-change: opacity promotes this to its own compositor layer.
       */}
      <div
        ref={wrapperRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: isReady ? 1 : 0,
          transition: "opacity 1s ease",
          willChange: "opacity",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
          aria-hidden="true"
        />
      </div>

      {/*
       * Vignette — edge darkening only, NO backdrop-filter.
       * backdrop-filter on a fixed element forces a full compositor
       * repaint every time the canvas below it changes, which is every
       * single frame. Removing it eliminates a major GPU bottleneck.
       * The subtle blur effect is instead baked into the canvas draw
       * via a very light CSS filter on the canvas itself.
       */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: [
            "linear-gradient(to bottom, rgba(5,5,8,0.60) 0%, transparent 20%)",
            "linear-gradient(to top,    rgba(5,5,8,0.75) 0%, transparent 32%)",
            "linear-gradient(to right,  rgba(5,5,8,0.30) 0%, transparent 14%, transparent 86%, rgba(5,5,8,0.30) 100%)",
          ].join(", "),
        }}
      />

      {/* Subtle static blur on the canvas — no repaint cost */}
      <style>{`
        canvas[aria-hidden="true"] {
          filter: blur(1px);
        }
      `}</style>

      {/* Loading screen */}
      {!isReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#050508",
            gap: "0",
          }}
        >
          {/* Ambient loader glow */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,45,120,0.06) 0%, rgba(155,48,255,0.04) 40%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Client-side only stars — no hydration mismatch */}
          {loaderStars?.map((s, i) => (
            <div key={i} style={{
              position: "absolute",
              width: `${s.w}px`, height: `${s.w}px`,
              borderRadius: "50%", background: s.color,
              top: `${s.top}%`, left: `${s.left}%`,
              opacity: s.opacity,
              animation: `cdx-twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Logo */}
          <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="5.5" fill="url(#ldr-grad)" />
              <ellipse cx="14" cy="14" rx="12" ry="5"
                stroke="url(#ldr-ring)" strokeWidth="1.4" fill="none"
                strokeDasharray="3 2"
                style={{ animation: "cdx-spin 8s linear infinite" }}
              />
              <circle cx="22.5" cy="10.5" r="2" fill="#ff6ba8" opacity="0.9" />
              <defs>
                <radialGradient id="ldr-grad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ff6ba8" />
                  <stop offset="100%" stopColor="#7c22ff" />
                </radialGradient>
                <linearGradient id="ldr-ring" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff2d78" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#9b30ff" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "0.04em",
              background: "linear-gradient(135deg, #ffffff 0%, #e8d8ff 45%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>CosmoDeX</span>
          </div>

          {/* Spinner ring */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1.5px solid rgba(255,45,120,0.12)",
              borderTop: "1.5px solid #ff2d78",
              borderRight: "1.5px solid rgba(155,48,255,0.5)",
              animation: "cdx-spin 0.85s linear infinite",
              marginBottom: "28px",
              boxShadow: "0 0 20px rgba(255,45,120,0.2)",
            }}
          />

          {/* Progress bar */}
          <div
            style={{
              width: "200px",
              height: "3px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${loadProgress}%`,
                background: "linear-gradient(90deg, #ff2d78, #c084fc, #9b30ff)",
                borderRadius: "2px",
                transition: "width 0.18s ease",
                boxShadow: "0 0 8px rgba(255,45,120,0.5)",
              }}
            />
          </div>

          {/* Label */}
          <p
            style={{
              fontSize: "11px",
              color: "rgba(240,230,255,0.28)",
              fontFamily: "var(--font-mono), 'Fira Code', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Entering the cosmos — {loadProgress}%
          </p>
        </div>
      )}

      <style>{`
        @keyframes cdx-spin { to { transform: rotate(360deg); } }
        @keyframes cdx-twinkle {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </>
  );
}
