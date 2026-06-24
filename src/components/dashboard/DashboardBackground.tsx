"use client";

import { motion } from "framer-motion";

export default function DashboardBackground() {
  const stepIndex = 0;
  return (
    <div className="fixed inset-[-10%] w-[120%] h-[120%] pointer-events-none z-0">
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          x: stepIndex * -20,
          y: stepIndex * -10,
          scale: 1 + stepIndex * 0.02,
          rotate: stepIndex * -0.2
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        {/* Core dark space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#1a0b2e_0%,#080312_100%)] opacity-90" />

        {/* Nebula dust / subtle colored clouds */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="animate-nebula1 absolute top-[20%] left-[30%] w-[40rem] h-[30rem] bg-indigo-900/20 rounded-[100%] blur-[100px] mix-blend-screen will-change-transform" />
          <div className="animate-nebula2 absolute bottom-[10%] right-[20%] w-[35rem] h-[25rem] bg-fuchsia-900/10 rounded-[100%] blur-[120px] mix-blend-screen will-change-transform" />
          <div className="animate-nebula3 absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-900/10 rounded-[100%] blur-[100px] mix-blend-screen will-change-transform" />
        </div>

        {/* Small stars layers */}
        <div
          className="animate-stars1 absolute inset-[-10%] pointer-events-none will-change-transform" style={{
            backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.4
          }}
        />
        <div
          className="animate-stars2 absolute inset-[-10%] pointer-events-none will-change-transform" style={{
            backgroundImage: 'radial-gradient(1.5px 1.5px at 10px 10px, #e0b0ff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 150px, #fuchsia, rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            opacity: 0.3
          }}
        />

        {/* Twinkling Stars */}
        <div
          className="animate-twinkle1 absolute inset-0 pointer-events-none will-change-transform" style={{
            backgroundImage: 'radial-gradient(2px 2px at 80px 120px, rgba(255,255,255,0.9), rgba(0,0,0,0)), radial-gradient(2px 2px at 250px 50px, rgba(158,0,246,0.8), rgba(0,0,0,0)), radial-gradient(2px 2px at 180px 300px, rgba(0,255,233,0.9), rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '350px 350px'
          }}
        />
        <div
          className="animate-twinkle2 absolute inset-0 pointer-events-none will-change-transform" style={{
            backgroundImage: 'radial-gradient(2px 2px at 120px 220px, rgba(255,220,100,0.9), rgba(0,0,0,0)), radial-gradient(2.5px 2.5px at 300px 180px, rgba(255,255,255,1), rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 40px 350px, rgba(255,100,200,0.8), rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '450px 450px'
          }}
        />

        {/* Subtle Shooting Stars */}
        <motion.div
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: "150px", rotate: -35, top: "10%", right: "-10%" }}
          animate={{
            x: [0, -1200],
            y: [0, 800],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          style={{ width: "100px", rotate: -35, top: "40%", right: "-5%" }}
          animate={{
            x: [0, -1000],
            y: [0, 700],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 9,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          style={{ width: "200px", rotate: -35, top: "-5%", right: "30%" }}
          animate={{
            x: [0, -1500],
            y: [0, 1000],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 14,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
}
