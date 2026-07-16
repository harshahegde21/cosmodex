"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { OnboardingData, OnboardingStepId } from './types/onboarding';

import StartStep from './components/steps/StartStep';
import AuthStep from './components/steps/AuthStep';
import UsernameStep from './components/steps/UsernameStep';
import AvatarStep from './components/steps/AvatarStep';
import PreviewStep from './components/steps/PreviewStep';
import ExperienceStep from './components/steps/ExperienceStep';
import InterestsStep from './components/steps/InterestsStep';
import CompletionStep from './components/steps/CompletionStep';
import Mascot from './components/Mascot';

const STEPS: OnboardingStepId[] = [
  'START',
  'AUTH',
  'USERNAME',
  'AVATAR',
  'EXPERIENCE',
  'INTERESTS',
  'PREVIEW',
  'COMPLETING'
];

export default function OnboardingFlow() {
  const searchParams = useSearchParams();
  const isLoginMode = searchParams.get('mode') === 'login';
  const [stepIndex, setStepIndex] = useState(isLoginMode ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [loadingSession, setLoadingSession] = useState(true);
  const [data, setData] = useState<OnboardingData>({
    email: '',
    password: '',
    username: '',
    avatarId: null,
    experienceLevel: null,
    interests: [],
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const [sessionRes, oauthRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/auth/oauth-pending'),
        ]);

        const [sessionData, oauthPendingData] = await Promise.all([
          sessionRes.json(),
          oauthRes.json(),
        ]);

        if (sessionData.user) {
          window.location.href = '/dashboard';
          return;
        }

        if (oauthPendingData.exists) {
          window.location.href = '/dashboard';
          return;
        }

        if (oauthPendingData.pending) {
          setData(prev => ({
            ...prev,
            email: oauthPendingData.pending.email || '',
            authMethod: oauthPendingData.pending.authMethod,
          }));
          setStepIndex(2);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoadingSession(false);
      }
    }
    checkSession();
  }, []);

  const currentStep = STEPS[stepIndex];

  if (loadingSession) {
    return null;
  }

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setDirection(1);
      setStepIndex(s => s + 1);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setDirection(-1);
      setStepIndex(s => s - 1);
    }
  };

  const updateData = (partial: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...partial }));
  };

  // Variants for horizontal sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  // Progress percentage
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0518]">
      {/* Background exact match via CSS */}
      <motion.div
        className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none"
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
          animate={{ scale: 1 + stepIndex * 0.05 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute top-[8%] left-[5%] max-lg:top-[12%] xl:left-[8%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] sm:min-w-[300px] sm:min-h-[300px] will-change-transform"
        >
          <div className="w-full h-full relative animate-planet1 will-change-transform">
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

        {/* Constellation Pathway (Step by Step Connection) */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CFA1FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F0D1FF" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {[
              { y: 15, x: 15 },
              { y: 26, x: 26 },
              { y: 37, x: 37 },
              { y: 48, x: 48 },
              { y: 58, x: 58 },
              { y: 68, x: 68 },
              { y: 78, x: 78 },
              { y: 88, x: 88 },
            ].map((point, i, arr) => {
              if (i === arr.length - 1) return null;
              const nextPoint = arr[i + 1];
              return (
                <g key={`trail-${i}`}>
                  {/* Background Trail (inactive) */}
                  <line
                    x1={`${point.x}%`}
                    y1={`${point.y}%`}
                    x2={`${nextPoint.x}%`}
                    y2={`${nextPoint.y}%`}
                    stroke="url(#trail-gradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    strokeOpacity="0.15"
                    strokeLinecap="round"
                  />
                  {/* Active Trail */}
                  {stepIndex > i && (
                    <motion.line
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      x1={`${point.x}%`}
                      y1={`${point.y}%`}
                      x2={`${nextPoint.x}%`}
                      y2={`${nextPoint.y}%`}
                      stroke="url(#trail-gradient)"
                      strokeWidth="2"
                      strokeDasharray="4 6"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Tiny Soft Stars */}
          {[
            { y: 15, x: 15 },
            { y: 26, x: 26 },
            { y: 37, x: 37 },
            { y: 48, x: 48 },
            { y: 58, x: 58 },
            { y: 68, x: 68 },
            { y: 78, x: 78 },
            { y: 88, x: 88 },
          ].map((node, i) => {
            const isActive = stepIndex === i;
            const isPast = stepIndex > i;
            const isLit = isActive || isPast;

            return (
              <div
                key={`star-${i}`}
                className="absolute z-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${node.y}%`, left: `${node.x}%`, width: '64px', height: '64px' }}
              >
                <div
                  className={`animate-bounce-star relative w-full h-full transition-all duration-1000 ${isLit ? (isActive ? 'opacity-100 drop-shadow-[0_0_15px_rgba(238,204,255,0.8)]' : 'opacity-95') : 'opacity-50'} flex items-center justify-center will-change-transform`}
                  style={{ animationDelay: `${i * 0.5}s`, animationDuration: `${6 + (i % 3)}s` }}
                >
                  <svg viewBox="0 0 100 100" className={`w-full h-full origin-center ${isLit ? 'text-[#F0D1FF]' : 'text-[#CE9EFF]'} drop-shadow-md`}>
                    <defs>
                      <radialGradient id={`tinyStarGrad-${i}`} cx="40%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#F9F2FF" />
                        <stop offset="65%" stopColor="currentColor" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
                      </radialGradient>
                      <filter id={`softGlow-${i}`}>
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Soft puffy star base with rounded stroke for cartoony edges */}
                    <path
                      d="M 50,18 C 55,36 64,45 82,50 C 64,55 55,64 50,82 C 45,64 36,55 18,50 C 36,45 45,36 50,18 Z"
                      fill={`url(#tinyStarGrad-${i})`}
                      stroke={`url(#tinyStarGrad-${i})`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#softGlow-${i})`}
                    />

                    {/* Glossy top highlight for 3D bounce */}
                    <path
                      d="M 50,22 C 53,35 58,42 65,46 C 58,46 53,49 50,62 C 47,49 42,46 35,46 C 42,42 47,35 50,22 Z"
                      fill="#FFFFFF"
                      opacity="0.5"
                      filter="blur(1px)"
                    />

                    {/* Sharp specular dot highlight */}
                    <ellipse cx="44" cy="36" rx="4" ry="2" transform="rotate(-30 44 36)" fill="#FFFFFF" opacity="0.9" />

                    {/* Soft central core glow */}
                    <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.8" filter="blur(2px)" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Right Planet */}
        <motion.div
          animate={{ scale: 1 + stepIndex * 0.05 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="absolute bottom-[2%] right-[2%] max-lg:bottom-[8%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] sm:min-w-[250px] sm:min-h-[250px] will-change-transform"
        >
          <div className="w-full h-full relative animate-planet2 will-change-transform">
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

      {/* Mascot Overlay */}
      <Mascot step={currentStep} data={data} />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-4xl flex-1 relative flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute w-full max-w-lg"
            >
              {currentStep === 'START' && <StartStep onNext={goNext} />}
              {currentStep === 'AUTH' && <AuthStep onNext={goNext} updateData={updateData} />}
              {currentStep === 'USERNAME' && <UsernameStep onNext={goNext} onBack={goBack} updateData={updateData} data={data} />}
              {currentStep === 'AVATAR' && <AvatarStep onNext={goNext} onBack={goBack} updateData={updateData} data={data} />}
              {currentStep === 'EXPERIENCE' && <ExperienceStep onNext={goNext} onBack={goBack} updateData={updateData} data={data} />}
              {currentStep === 'INTERESTS' && <InterestsStep onNext={goNext} onBack={goBack} updateData={updateData} data={data} />}
              {currentStep === 'PREVIEW' && <PreviewStep onNext={goNext} onBack={goBack} data={data} />}
              {currentStep === 'COMPLETING' && <CompletionStep data={data} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Progress Bar */}
        {
          currentStep !== 'START' && currentStep !== 'COMPLETING' && (
            <div className="absolute bottom-12 left-0 right-0 max-w-xl mx-auto w-full px-6">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.5 }}
                />
              </div>
              <div className="mt-4 flex justify-between text-xs text-white/40 font-mono tracking-wider">
                <span>{String(stepIndex).padStart(2, '0')}</span>
                <span>{String(STEPS.length - 2).padStart(2, '0')}</span>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
}