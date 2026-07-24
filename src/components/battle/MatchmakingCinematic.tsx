"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X } from 'lucide-react';

interface MatchmakingCinematicProps {
  username: string;
  userElo?: number;
  phase: 'SEARCHING' | 'MATCH_FOUND';
  opponent: { username: string; elo: number; avatar?: string } | null;
  onEnterBattle: () => void;
  onCancel: () => void;
}

export default function MatchmakingCinematic({
  username,
  userElo = 1000,
  phase,
  opponent,
  onEnterBattle,
  onCancel,
}: MatchmakingCinematicProps) {
  const [fusionPulse, setFusionPulse] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Trigger fusion pulse when phase changes to MATCH_FOUND
  useEffect(() => {
    let isMounted = true;
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;

    if (phase === 'MATCH_FOUND') {
      timer1 = setTimeout(() => {
        if (isMounted) setFusionPulse(true);
        timer2 = setTimeout(() => {
          if (isMounted) setFusionPulse(false);
        }, 800);
      }, 1100);
    }

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [phase]);

  // HTML Canvas Logic for Sparse Stars and Streaks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    const streaks: { x: number; y: number; length: number; speed: number; alpha: number }[] = [];
    const staticStars: { x: number; y: number; size: number; alpha: number }[] = [];
    const fusionParticles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Vertical star streaks
    const numStreaks = Math.floor(Math.random() * 11) + 30;
    for (let i = 0; i < numStreaks; i++) {
      streaks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.1 + 0.15,
      });
    }

    // Static background stars
    for (let i = 0; i < 80; i++) {
      staticStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.2 + 0.05,
      });
    }

    let pulseTriggered = false;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint background stars
      ctx.fillStyle = '#ffffff';
      staticStars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw streaks
      ctx.lineCap = 'butt';
      ctx.lineWidth = 1;

      streaks.forEach((streak) => {
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(streak.x, streak.y + streak.length);
        const grad = ctx.createLinearGradient(streak.x, streak.y, streak.x, streak.y + streak.length);
        grad.addColorStop(0, `rgba(217, 95, 209, 0)`);
        grad.addColorStop(1, `rgba(217, 95, 209, ${streak.alpha})`);
        ctx.strokeStyle = grad;
        ctx.stroke();

        streak.y += streak.speed;
        if (streak.y > canvas.height) {
          streak.y = -streak.length;
          streak.x = Math.random() * canvas.width;
        }
      });

      // Spawn fusion particles when pulse triggers
      if (fusionPulse && !pulseTriggered) {
        pulseTriggered = true;
        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 3 + 1;
          fusionParticles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1.0,
            size: Math.random() * 2 + 1,
          });
        }
      }

      if (!fusionPulse && pulseTriggered) {
        pulseTriggered = false;
      }

      // Draw fusion particles
      fusionParticles.forEach((p) => {
        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(236, 72, 153, ${p.life})`;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.life -= 0.03;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fusionPulse]);

  const easeInOutCubic: [number, number, number, number] = [0.65, 0, 0.35, 1];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 9999, background: '#050508' }}>
      <canvas ref={canvasRef} className="canvas-container" />
      <div className="ambient-bloom" />

      {/* Cancel Matchmaking Button */}
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
          }}
          title="Cancel Matchmaking"
        >
          <X size={20} />
        </button>
      )}

      {/* Tiny Accent Rockets */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', pointerEvents: 'none', zIndex: 11 }}>

        {/* Left Rocket (Purple) */}
        <div style={{ position: 'absolute', left: '32vw', top: 0, transform: 'translateY(-50%)' }}>
          <motion.div
            initial={{ x: 0, y: 0, rotate: 90, opacity: 0 }}
            animate={
              phase === 'SEARCHING'
                ? { x: 0, y: [-4, 4, -4], rotate: [88, 92, 88], opacity: 1 }
                : { x: '18vw', y: 0, rotate: 90, opacity: 0 }
            }
            transition={{
              opacity: phase === 'SEARCHING' ? { duration: 1 } : { duration: 0.1, delay: 1.0 },
              x: phase === 'SEARCHING' ? { duration: 0 } : { duration: 0.8, ease: easeInOutCubic, delay: 0.3 },
              y: phase === 'SEARCHING' ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3, ease: "easeOut" },
              rotate: phase === 'SEARCHING' ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3, ease: "easeOut" }
            }}
            style={{ position: 'relative' }}
          >
            <motion.div
              animate={{ filter: phase === 'SEARCHING' ? ['drop-shadow(0 0 5px #A855F7)', 'drop-shadow(0 0 10px #A855F7)', 'drop-shadow(0 0 5px #A855F7)'] : 'drop-shadow(0 0 15px #A855F7)' }}
              transition={{ duration: 2.8, repeat: Infinity }}
            >
              <Rocket size={28} color="#A855F7" fill="#A855F7" />
            </motion.div>
            {/* Engine Sparks */}
            <motion.div
              animate={phase === 'SEARCHING' ? { opacity: [0.5, 0.9, 0.5], scaleY: [1, 1.2, 1] } : { opacity: 1, scaleY: 2 }}
              transition={{ repeat: phase === 'SEARCHING' ? Infinity : 0, duration: 2.8 }}
              style={{ position: 'absolute', top: '28px', left: '12px', width: '4px', height: '24px', background: 'linear-gradient(to bottom, #A855F7, transparent)', borderRadius: '4px', transformOrigin: 'top' }}
            />
          </motion.div>
        </div>

        {/* Right Rocket (Pink) */}
        <div style={{ position: 'absolute', right: '32vw', top: 0, transform: 'translateY(-50%)' }}>
          <motion.div
            initial={{ x: 0, y: 0, rotate: -90, opacity: 0 }}
            animate={
              phase === 'SEARCHING'
                ? { x: 0, y: [4, -4, 4], rotate: [-88, -92, -88], opacity: 1 }
                : { x: '-18vw', y: 0, rotate: -90, opacity: 0 }
            }
            transition={{
              opacity: phase === 'SEARCHING' ? { duration: 1 } : { duration: 0.1, delay: 1.0 },
              x: phase === 'SEARCHING' ? { duration: 0 } : { duration: 0.8, ease: easeInOutCubic, delay: 0.3 },
              y: phase === 'SEARCHING' ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3, ease: "easeOut" },
              rotate: phase === 'SEARCHING' ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3, ease: "easeOut" }
            }}
            style={{ position: 'relative' }}
          >
            <motion.div
              animate={{ filter: phase === 'SEARCHING' ? ['drop-shadow(0 0 5px #EC4899)', 'drop-shadow(0 0 10px #EC4899)', 'drop-shadow(0 0 5px #EC4899)'] : 'drop-shadow(0 0 15px #EC4899)' }}
              transition={{ duration: 2.8, repeat: Infinity }}
            >
              <Rocket size={28} color="#EC4899" fill="#EC4899" />
            </motion.div>
            {/* Engine Sparks */}
            <motion.div
              animate={phase === 'SEARCHING' ? { opacity: [0.5, 0.9, 0.5], scaleY: [1, 1.2, 1] } : { opacity: 1, scaleY: 2 }}
              transition={{ repeat: phase === 'SEARCHING' ? Infinity : 0, duration: 2.8 }}
              style={{ position: 'absolute', top: '28px', left: '12px', width: '4px', height: '24px', background: 'linear-gradient(to bottom, #EC4899, transparent)', borderRadius: '4px', transformOrigin: 'top' }}
            />
          </motion.div>
        </div>

      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        {/* Top Text Area */}
        <div style={{ position: 'absolute', top: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {phase === 'SEARCHING' && (
              <motion.div
                key="searching"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center' }}
              >
                <h1 className="glow-text" style={{ fontSize: '3rem', letterSpacing: '4px', color: 'white' }}>
                  SEARCHING FOR AN OPPONENT
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>...</motion.span>
                </h1>
              </motion.div>
            )}

            {phase === 'MATCH_FOUND' && (
              <motion.div
                key="found"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.8, type: 'spring', damping: 15, stiffness: 80 }}
                style={{ textAlign: 'center' }}
              >
                <h1 className="glow-text" style={{ fontSize: '4.5rem', letterSpacing: '6px' }}>
                  MATCH FOUND
                </h1>
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ color: 'var(--text-secondary)', marginTop: '15px', fontSize: '1.2rem', letterSpacing: '8px', textTransform: 'uppercase', fontFamily: 'Lato, sans-serif' }}
                >
                  Preparing Battle Arena...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Central VS Portal Area */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence>
            {phase === 'MATCH_FOUND' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', damping: 15, stiffness: 80 }}
                style={{ position: 'relative', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <AnimatePresence>
                  {fusionPulse && (
                    <>
                      {/* Inner Pulse */}
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                          position: 'absolute', width: '80px', height: '80px', borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(168, 85, 247, 0.5) 70%, transparent 100%)',
                          boxShadow: '0 0 40px rgba(236, 72, 153, 0.8)',
                          zIndex: 20
                        }}
                      />
                      {/* Expanding Ring */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0.8, borderWidth: '8px' }}
                        animate={{ scale: 2, opacity: 0, borderWidth: '1px' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                          position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
                          border: 'solid rgba(217, 95, 209, 0.6)',
                          zIndex: 19
                        }}
                      />
                    </>
                  )}
                </AnimatePresence>

                {/* Portal Rings */}
                <motion.div
                  className="vs-portal-ring vs-portal-ring-outer"
                  animate={fusionPulse ? { boxShadow: '0 0 60px rgba(168, 85, 247, 0.8)' } : { boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="vs-portal-ring vs-portal-ring-inner"
                  animate={fusionPulse ? { boxShadow: 'inset 0 0 40px rgba(236, 72, 153, 0.8)' } : { boxShadow: 'inset 0 0 20px rgba(236, 72, 153, 0.2)' }}
                  transition={{ duration: 0.4 }}
                />
                <div className="portal-pulse" />

                {/* VS Text */}
                <h2 style={{ fontFamily: 'Hitchcut, sans-serif', fontSize: '6rem', color: 'white', textShadow: '0 0 40px var(--primary-pink)', zIndex: 10 }}>VS</h2>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === 'SEARCHING' && (
              <motion.div
                key="searching-portal"
                exit={{ opacity: 0, scale: 0.2, filter: 'blur(20px)' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {/* Rotating Dashed Border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: '200px', height: '200px', borderRadius: '50%',
                    border: '1px dashed rgba(168, 85, 247, 0.3)',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.15)'
                  }}
                />

                {/* Player Avatar inside Portal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.03, 1],
                    y: [-3, 3, -3]
                  }}
                  transition={{
                    opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  style={{
                    fontSize: '6.5rem',
                    filter: 'drop-shadow(0 0 25px rgba(168,85,247,0.7))',
                    zIndex: 2
                  }}
                >
                  🥷
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Circular Player Frames */}
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 15vw', pointerEvents: 'none' }}>

          {/* Player 1 (Me) */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={phase === 'MATCH_FOUND' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ delay: 0.8, type: 'spring', damping: 15, stiffness: 100 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="circular-frame"
            >
              <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 15px rgba(168,85,247,0.5))' }}>🥷</div>
            </motion.div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', fontFamily: 'Hitchcut, sans-serif', letterSpacing: '2px' }}>{username}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '6px', letterSpacing: '1px' }}>ELO <span style={{ color: 'var(--primary-purple)', fontWeight: 'bold' }}>{userElo}</span></div>
            </div>
          </motion.div>

          {/* Player 2 (Opponent) */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={phase === 'MATCH_FOUND' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ delay: 0.8, type: 'spring', damping: 15, stiffness: 100 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="circular-frame"
            >
              <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 15px rgba(236,72,153,0.5))' }}>{opponent?.avatar || '🧙'}</div>
            </motion.div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', fontFamily: 'Hitchcut, sans-serif', letterSpacing: '2px' }}>{opponent?.username || 'Opponent'}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '6px', letterSpacing: '1px' }}>ELO <span style={{ color: 'var(--primary-pink)', fontWeight: 'bold' }}>{opponent?.elo || 1000}</span></div>
            </div>
          </motion.div>

        </div>

        {/* Enter Battle Button */}
        <AnimatePresence>
          {phase === 'MATCH_FOUND' && (
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring', damping: 15, stiffness: 100 }}
              className="btn-primary"
              style={{ position: 'absolute', bottom: '22%', pointerEvents: 'auto' }}
              onClick={onEnterBattle}
            >
              ENTER BATTLE
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
