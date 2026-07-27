"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./victory.module.css";

// ── Types ────────────────────────────────────────────────────────────────────

interface MatchResult {
  points: number;
  livesLeft: number;
  submissions: number;
  opponentName: string;
  myName: string;
  eloDelta: number | null;
  matchId: string | null;
  isWinner: boolean;
}

// ── Status Banner ─────────────────────────────────────────────────────────────

function StatusBanner() {
  return (
    <div className={styles.statusBanner}>
      <span className={styles.statusItem}>
        <span className={styles.statusDot} style={{ background: "#22c55e" }} />
        ✓ You solved it!
      </span>
      <span className={styles.statusDivider}>·</span>
      <span className={styles.statusItem}>
        <span className={styles.statusDot} style={{ background: "#a855f7" }} />
        ✓ Waiting for opponent…
      </span>
    </div>
  );
}

// ── Trophy SVG ────────────────────────────────────────────────────────────────

function TrophySVG() {
  return (
    <svg
      className={styles.trophySvg}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="bodyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE08A" />
          <stop offset="60%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#C47C1A" />
        </radialGradient>
        <radialGradient id="baseGrad" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </radialGradient>
        <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="200" rx="55" ry="8" fill="rgba(168,85,247,0.3)" filter="url(#glow)" />
      <rect x="62" y="176" width="76" height="18" rx="5" fill="url(#baseGrad)" />
      <rect x="72" y="168" width="56" height="12" rx="3" fill="url(#baseGrad)" />
      <rect x="80" y="180" width="40" height="9" rx="3" fill="rgba(0,0,0,0.35)" />
      <text x="100" y="188" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="#F5A623" letterSpacing="1">CDX</text>
      <rect x="86" y="148" width="28" height="24" rx="4" fill="url(#bodyGrad)" />
      <rect x="86" y="148" width="28" height="24" rx="4" fill="url(#shineGrad)" />
      <path d="M 52 56 Q 50 140 100 150 Q 150 140 148 56 Z" fill="url(#bodyGrad)" filter="url(#glow)" />
      <path d="M 52 56 Q 50 140 100 150 Q 150 140 148 56 Z" fill="url(#shineGrad)" />
      <rect x="46" y="48" width="108" height="14" rx="7" fill="url(#bodyGrad)" />
      <rect x="46" y="48" width="108" height="14" rx="7" fill="url(#shineGrad)" />
      <path d="M 52 66 Q 22 72 24 100 Q 26 118 52 118" stroke="url(#bodyGrad)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 148 66 Q 178 72 176 100 Q 174 118 148 118" stroke="url(#bodyGrad)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <text x="100" y="116" textAnchor="middle" fontSize="26" fill="rgba(255,255,255,0.25)">★</text>
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon, color }: {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  const [displayed, setDisplayed] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 600;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current !== null) cancelAnimationFrame(raf.current); };
  }, [value]);

  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>{displayed}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statIcon} style={{ color }}>{icon}</div>
    </div>
  );
}

// ── Star Field ────────────────────────────────────────────────────────────────

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    interface Star { x: number; y: number; r: number; speed: number; phase: number; }
    const stars: Star[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    const sparkles = [
      { x: 0.15, y: 0.12, size: 10, color: "#a855f7" },
      { x: 0.85, y: 0.18, size: 8,  color: "#60a5fa" },
      { x: 0.08, y: 0.55, size: 6,  color: "#a855f7" },
      { x: 0.92, y: 0.60, size: 7,  color: "#60a5fa" },
      { x: 0.50, y: 0.08, size: 7,  color: "#ec4899" },
      { x: 0.72, y: 0.82, size: 6,  color: "#a855f7" },
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula blobs
      const blob = (x: number, y: number, rx: number, ry: number, c: string) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
        g.addColorStop(0, c); g.addColorStop(1, "transparent");
        ctx.save(); ctx.scale(1, ry / rx);
        ctx.beginPath(); ctx.arc(x, (y * rx) / ry, rx, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill(); ctx.restore();
      };
      blob(canvas.width * 0.25, canvas.height * 0.4, 180, 260, "rgba(88,28,220,0.18)");
      blob(canvas.width * 0.78, canvas.height * 0.65, 140, 200, "rgba(168,85,247,0.12)");

      stars.forEach((s) => {
        const alpha = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
      });

      sparkles.forEach((sp) => {
        const px = sp.x * canvas.width, py = sp.y * canvas.height;
        const scale = 0.75 + 0.25 * Math.sin(t * 0.04 + sp.x * 5);
        const sz = sp.size * scale;
        ctx.save(); ctx.translate(px, py);
        ctx.strokeStyle = sp.color; ctx.lineWidth = 2; ctx.globalAlpha = 0.7 * scale;
        ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(0, sz);
        ctx.moveTo(-sz, 0); ctx.lineTo(sz, 0); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fillStyle = sp.color; ctx.fill(); ctx.restore();
      });

      t++;
      requestAnimationFrame(draw);
    };

    const id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className={styles.starCanvas} aria-hidden="true" />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VictoryPage() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Fast path — written by arena index.html on match_ended
        const raw = localStorage.getItem("cosmodex_match_result");
        if (raw) {
          setResult(JSON.parse(raw));
          return;
        }

        // Fallback — reconstruct from API
        const token = localStorage.getItem("cosmodex_token");
        const user = JSON.parse(localStorage.getItem("cosmodex_user") || "null");
        const matchId = localStorage.getItem("cosmodex_last_match_id");

        if (!token || !user || !matchId) {
          // No session — show demo values
          setResult({ points: 700, livesLeft: 3, submissions: 8, opponentName: "opponent", myName: user?.username ?? "You", eloDelta: null, matchId: null, isWinner: true });
          return;
        }

        const [matchRes, meRes] = await Promise.all([
          fetch(`/api/matches/${matchId}`),
          fetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!matchRes.ok) throw new Error("Match not found");

        const match = await matchRes.json();
        const me = meRes.ok ? await meRes.json() : user;
        const myId: string = user.id;
        const isP1 = match.player1Id === myId;
        const opponent = isP1 ? match.player2 : match.player1;

        let subCount = 0;
        try {
          const subsRes = await fetch(`/api/matches/${matchId}/submissions`, { headers: { Authorization: `Bearer ${token}` } });
          if (subsRes.ok) {
            const subs: { userId: string }[] = await subsRes.json();
            subCount = subs.filter((s) => s.userId === myId).length;
          }
        } catch { /* ignore */ }

        const roomState = JSON.parse(localStorage.getItem("cosmodex_last_room_state") || "null");
        const ps = roomState?.players?.[myId];

        setResult({
          points: ps?.points ?? (isP1 ? match.player1Score : match.player2Score) ?? 0,
          livesLeft: ps?.lives ?? 0,
          submissions: subCount || (ps?.submissionsCount ?? 0),
          opponentName: opponent?.username ?? "Opponent",
          myName: me?.username ?? user.username,
          eloDelta: null,
          matchId,
          isWinner: match.winnerId === myId,
        });
      } catch (err) {
        console.error("Failed to load result:", err);
        setResult({ points: 0, livesLeft: 0, submissions: 0, opponentName: "Opponent", myName: "You", eloDelta: null, matchId: null, isWinner: false });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!loading) setTimeout(() => setVisible(true), 80);
  }, [loading]);

  const playAgain = () => {
    localStorage.removeItem("cosmodex_match_result");
    localStorage.removeItem("cosmodex_last_room_state");
    localStorage.removeItem("cosmodex_last_match_id");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <StarField />
        <div className={styles.loadingDots}><span /><span /><span /></div>
      </div>
    );
  }

  const r = result!;

  return (
    <div className={styles.page}>
      <StarField />
      <div className={`${styles.card} ${visible ? styles.cardVisible : ""}`}>

        <StatusBanner />

        <div className={styles.trophyWrap}>
          <TrophySVG />
          <div className={styles.trophyGlow} />
        </div>

        <h1 className={styles.victoryTitle}>VICTORY</h1>

        <p className={styles.subtitle}>
          You defeated <span className={styles.opponentName}>{r.opponentName}</span>! Your{" "}
          <span className={styles.eloText}>ELO</span> has been updated.
        </p>

        <div className={styles.statsRow}>
          <StatCard value={r.points} label="POINTS" color="#a855f7" icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          } />
          <StatCard value={r.livesLeft} label="LIVES LEFT" color="#ef4444" icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          } />
          <StatCard value={r.submissions} label="SUBMISSIONS" color="#06b6d4" icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          } />
        </div>

        <button className={styles.playAgainBtn} onClick={playAgain} aria-label="Play Again">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.88" />
          </svg>
          Play Again
        </button>

      </div>
    </div>
  );
}
