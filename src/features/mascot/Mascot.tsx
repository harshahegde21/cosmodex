"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMascotStore } from "@/hooks/useMascotStore";
import mascotBody from "./Mascot - Without Eyes.png";
import mascotPupil from "./Mascot - Pupil.png";

// Responsive Viewport Positions
const layoutVariants: Record<string, { top: string; left: string; x: string; y: string }> = {
  "bottom-right": { top: "calc(100vh - 110px)", left: "calc(100vw - 90px)", x: "-50%", y: "-50%" },
  "center": { top: "50vh", left: "50vw", x: "-50%", y: "-50%" },
  "offset-right": { top: "50vh", left: "70vw", x: "-50%", y: "-50%" }
};

export default function Mascot() {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  // Use Framer Motion's manual animation controls for the teleport sequence
  const controls = useAnimation();

  const { message, position } = useMascotStore();
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // --- Teleportation Sequence Logic ---
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Prevent teleporting on the very first page load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const triggerTeleport = async () => {
      // 1. Zap Out (Shrink and fade out quickly)
      await controls.start({
        scale: 0.1,
        opacity: 0,
        filter: "blur(4px)",
        transition: { duration: 0.15, ease: "easeIn" }
      });

      // 2. Snap to new location instantly (duration 0)
      // This also resets the x/y transform, erasing any manual drag offsets
      const target = layoutVariants[position] || layoutVariants["bottom-right"];
      await controls.start({
        top: target.top,
        left: target.left,
        x: target.x,
        y: target.y,
        transition: { duration: 0 }
      });

      // 3. Zap In (Pop back up with a bouncy spring)
      await controls.start({
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        transition: { type: "spring", stiffness: 350, damping: 15 }
      });
    };

    triggerTeleport();
  }, [position, controls]);

  // --- Eye Tracking Logic ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsIdle(false);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setIsIdle(true);
      }, 2000);

      if (!containerRef.current || !leftEyeRef.current || !rightEyeRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const mascotCenterX = containerRect.left + containerRect.width / 2;
      const mascotCenterY = containerRect.top + containerRect.height / 2;

      const deltaX = e.clientX - mascotCenterX;
      const deltaY = e.clientY - mascotCenterY;
      const angle = Math.atan2(deltaY, deltaX);

      const maxRadius = 6;
      const pupilX = Math.cos(angle) * maxRadius;
      const pupilY = Math.sin(angle) * maxRadius;

      leftEyeRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      rightEyeRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // --- Idle Snap Logic ---
  useEffect(() => {
    if (isIdle && leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.style.transition = "transform 0.3s ease-out";
      rightEyeRef.current.style.transition = "transform 0.3s ease-out";
      leftEyeRef.current.style.transform = `translate(0px, 0px)`;
      rightEyeRef.current.style.transform = `translate(0px, 0px)`;

      setTimeout(() => {
        if (leftEyeRef.current) leftEyeRef.current.style.transition = "none";
        if (rightEyeRef.current) rightEyeRef.current.style.transition = "none";
      }, 300);
    }
  }, [isIdle]);

  const blinkAnimation = {
    scaleY: [1, 1, 0.1, 1, 1],
    transition: { duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" as const }
  };

  if (pathname === '/onboarding' || pathname?.startsWith('/onboarding/')) {
    return null;
  }

  return (
    <div ref={boundaryRef} className="fixed 
    top-0 left-0 w-screen h-screen pointer-events-none z-[9999] overflow-hidden">

      <motion.div
        ref={containerRef}
        drag
        dragConstraints={boundaryRef}
        dragElastic={0.2}
        dragMomentum={false}
        // Initialize position on first mount
        initial={{ ...layoutVariants["bottom-right"], scale: 1, opacity: 1 }}
        // Use manual controls instead of state binding
        animate={controls}
        className="absolute pointer-events-auto w-[150px] h-[200px] cursor-grab active:cursor-grabbing touch-none select-none"
      >

        {/* Dark Theme Chat Bubble */}
        <div
          className={`absolute -top-[70px] -right-[90px] w-[220px] px-4 py-3 rounded-2xl font-medium tracking-wide pointer-events-none transition-all duration-500 ease-out
            bg-[#160E2B]/95 text-cyan-400 border border-cyan-400/30 shadow-[0_4px_15px_rgba(0,255,255,0.15)]
            ${message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"}`}
        >
          {message}
        </div>

        <motion.div className="absolute w-full h-full">
          <Image
            src={mascotBody}
            alt="Mascot Body"
            draggable={false}
            className="absolute z-10 w-full h-auto pointer-events-none"
          />

          {/* Left Pupil */}
          <div ref={leftEyeRef} className="absolute z-11 w-[20px] top-[52px] left-[52px]">
            <motion.div animate={blinkAnimation} style={{ originY: 0.5 }}>
              <Image src={mascotPupil} alt="Left Eye" draggable={false} className="w-full h-auto pointer-events-none" />
            </motion.div>
          </div>

          {/* Right Pupil */}
          <div ref={rightEyeRef} className="absolute z-11 w-[20px] top-[52px] right-[45px]">
            <motion.div animate={blinkAnimation} style={{ originY: 0.5 }}>
              <Image src={mascotPupil} alt="Right Eye" draggable={false} className="w-full h-auto pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}