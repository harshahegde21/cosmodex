"use client";

import Navbar from "@/components/navbar/Navbar";
import { motion } from "framer-motion";
import { Shield, Swords, Crown } from "lucide-react";

export default function LearnPage() {
  const stepIndex = 0;
  return (
    <main className="min-h-screen bg-cosmo-bg relative overflow-x-hidden">
      <Navbar />

      {/* Onboarding Background exact match via CSS */}
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

          {/* Top Left Planet */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute top-[8%] left-[5%] max-lg:top-[12%] xl:left-[8%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] sm:min-w-[300px] sm:min-h-[300px] will-change-transform"
          >
            <div className="w-full h-full relative will-change-transform">
              {/* Planet Body */}
              <div className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #E873C3 0%, #D95FD1 40%, #8D37D6 70%, #2A0845 100%)',
                  boxShadow: 'inset -20px -20px 60px 0px rgba(0,0,0, 0.6), inset 10px 10px 30px 0px rgba(255, 200, 255, 0.5), 0 0 50px 0px rgba(217, 95, 209, 0.4)'
                }}>
                {/* Soft illustrative grain */}
                <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
                  }}
                />
                {/* Stylized soft crater impressions */}
                <div className="absolute inset-0 rounded-full overflow-hidden opacity-30 mix-blend-soft-light">
                  <div className="absolute top-[25%] left-[35%] w-[18%] h-[18%] rounded-full bg-black/40 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.5),inset_-2px_-2px_8px_rgba(255,255,255,0.4)] blur-[1px]" />
                  <div className="absolute top-[55%] left-[65%] w-[12%] h-[12%] rounded-full bg-black/40 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.5),inset_-1px_-1px_4px_rgba(255,255,255,0.4)] blur-[1px]" />
                  <div className="absolute top-[70%] left-[30%] w-[15%] h-[15%] rounded-full bg-black/40 shadow-[inset_3px_3px_10px_rgba(0,0,0,0.5),inset_-2px_-2px_6px_rgba(255,255,255,0.4)] blur-[1px]" />
                </div>
              </div>
            </div>
          </motion.div>

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

        {/* Bottom Right Planet */}
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute bottom-[2%] right-[2%] max-lg:bottom-[8%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] sm:min-w-[250px] sm:min-h-[250px] will-change-transform"
        >
          <div className="w-full h-full relative will-change-transform">
            {/* Planet Body */}
            <div className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 40% 30%, #00FFE9 0%, #0284c7 40%, #1e3a8a 75%, #0a0518 100%)',
                boxShadow: 'inset -25px -25px 50px 0px rgba(0, 0, 0, 0.6), inset 15px 15px 40px 0px rgba(255, 255, 255, 0.5), 0 0 60px 0px rgba(0, 255, 233, 0.3)'
              }}
            >
              {/* Soft illustrative grain */}
              <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
                }}
              />
              {/* Soft stylized gas bands */}
              <div className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] opacity-30 mix-blend-overlay blur-[2px]"
                style={{
                  background: 'repeating-radial-gradient(ellipse at center, transparent 0%, rgba(255,255,255,0.2) 2%, transparent 5%, rgba(0,255,233,0.3) 8%, transparent 12%)',
                  transform: 'rotate(-25deg) scaleX(1.5)'
                }}
              />
              {/* Additional soft glow */}
              <div className="absolute inset-[-5%] rounded-full bg-cyan-400/20 blur-[30px] mix-blend-screen pointer-events-none" />
            </div>
          </div>
        </motion.div>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 lg:pt-32 lg:pb-12 px-6 sm:px-12 flex flex-col items-center justify-center text-center overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gradient-1-start)] to-[var(--color-gradient-1-end)] mb-4">
            Explore the world of
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white tracking-wider mb-8 drop-shadow-2xl">
            CosmoDeX
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-mono leading-relaxed">
            Start your coding adventure with 200+ hours of interactive programming
            exercises paired with real-world projects. Explore for free!
          </p>
        </motion.div>
      </section>

      {/* Course Path Section - The Legend of Python */}
      <section className="relative z-10 container-custom section-padding pt-0 -mt-16 lg:-mt-24">
        <div className="max-w-[1120px] mx-auto pt-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Python */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative flex flex-col overflow-hidden bg-[#120d1d] border border-white/10 rounded-[32px] hover:border-[#10b981]/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all duration-300 shadow-2xl"
            >
              {/* Top-left Glow */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-[#10b981]/40 to-[#10b981]/0 rounded-full blur-[70px] pointer-events-none group-hover:from-[#10b981]/50 transition-colors duration-500"></div>

              <div className="p-8 relative z-10 flex-1 flex flex-col">
                {/* Icon Circle (matching avatar in image) */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#10b981] to-[#34d399] flex items-center justify-center border-[6px] border-[#120d1d] shadow-[0_8px_30px_rgba(16,185,129,0.3)] mb-8">
                   <Shield size={40} className="text-[#120d1d]" />
                </div>

                <span className="text-[11px] font-bold tracking-widest text-[#10b981] uppercase mb-2">COURSE 1</span>
                <h3 className="text-3xl font-display font-bold text-white mb-3">Python</h3>
                <p className="text-[15px] text-white/50 font-mono leading-relaxed mb-10 flex-1">
                  Learn programming fundamentals such as variables, control flow, and loops with the most versatile language.
                </p>
                <div className="flex items-center mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    BEGINNER
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: C++ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative flex flex-col overflow-hidden bg-[#120d1d] border border-white/10 rounded-[32px] hover:border-[#6366f1]/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all duration-300 shadow-2xl"
            >
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-[#6366f1]/40 to-[#6366f1]/0 rounded-full blur-[70px] pointer-events-none group-hover:from-[#6366f1]/50 transition-colors duration-500"></div>

              <div className="p-8 relative z-10 flex-1 flex flex-col">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#818cf8] flex items-center justify-center border-[6px] border-[#120d1d] shadow-[0_8px_30px_rgba(99,102,241,0.3)] mb-8">
                   <Swords size={40} className="text-[#120d1d]" />
                </div>

                <span className="text-[11px] font-bold tracking-widest text-[#6366f1] uppercase mb-2">COURSE 2</span>
                <h3 className="text-3xl font-display font-bold text-white mb-3">C++</h3>
                <p className="text-[15px] text-white/50 font-mono leading-relaxed mb-10 flex-1">
                  Build fast, powerful software. Master memory management, OOP, and systems-level programming.
                </p>
                <div className="flex items-center mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1] shadow-[0_0_8px_#6366f1]"></div>
                    INTERMEDIATE
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Java */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative flex flex-col overflow-hidden bg-[#120d1d] border border-white/10 rounded-[32px] hover:border-[#d946ef]/50 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(217,70,239,0.3)] transition-all duration-300 shadow-2xl"
            >
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-[#d946ef]/40 to-[#d946ef]/0 rounded-full blur-[70px] pointer-events-none group-hover:from-[#d946ef]/50 transition-colors duration-500"></div>

              <div className="p-8 relative z-10 flex-1 flex flex-col">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#d946ef] to-[#e879f9] flex items-center justify-center border-[6px] border-[#120d1d] shadow-[0_8px_30px_rgba(217,70,239,0.3)] mb-8">
                   <Crown size={40} className="text-[#120d1d]" />
                </div>

                <span className="text-[11px] font-bold tracking-widest text-[#d946ef] uppercase mb-2">COURSE 3</span>
                <h3 className="text-3xl font-display font-bold text-white mb-3">Java</h3>
                <p className="text-[15px] text-white/50 font-mono leading-relaxed mb-10 flex-1">
                  Write once, run anywhere. Learn object-oriented design, data structures, and enterprise patterns.
                </p>
                <div className="flex items-center mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                    <div className="w-2 h-2 rounded-full bg-[#d946ef] shadow-[0_0_8px_#d946ef]"></div>
                    INTERMEDIATE
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  );
}
