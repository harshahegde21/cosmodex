import { motion } from 'motion/react';
import { Sparkles, Hand } from 'lucide-react';
import { OnboardingStepId, OnboardingData } from '../types/onboarding';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import mascotBody from '../../mascot/Mascot - Without Eyes.png';
import mascotPupil from '../../mascot/Mascot - Pupil.png';

interface MascotProps {
  step: OnboardingStepId;
  data: OnboardingData;
}

export default function Mascot({ step }: MascotProps) {
  const [isMobile, setIsMobile] = useState(false);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize(); // Set initial value safely
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine mascot's position and animation state based on current step
  const getVariants = () => {
    if (isMobile) {
      // Keep it centered but above the cards on small screens
      switch (step) {
        case 'START':
          return { x: -140, y: -160, rotate: -10, scale: 0.8 };
        case 'AUTH':
          return { x: 0, y: -220, rotate: -5, scale: 0.9 };
        case 'USERNAME':
        case 'AVATAR':
        case 'EXPERIENCE':
        case 'INTERESTS':
        case 'PREVIEW':
          return { x: 0, y: -280, rotate: 5, scale: 0.8 };
        case 'COMPLETING':
          return { x: 140, y: -160, rotate: 10, scale: 0.8 };
        default:
          return { x: 0, y: -200, rotate: 0, scale: 0.8 };
      }
    }

    // Desktop: Push further outwards to avoid text
    switch (step) {
      case 'START':
        return { x: -380, y: -30, rotate: -10, scale: 1.2 };
      case 'AUTH':
        return { x: 0, y: -300, rotate: -5, scale: 1 };
      case 'USERNAME':
        return { x: 320, y: -180, rotate: 10, scale: 0.9 };
      case 'AVATAR':
        return { x: -320, y: -180, rotate: -10, scale: 1.1 };
      case 'PREVIEW':
        return { x: 0, y: -320, rotate: 5, scale: 1 };
      case 'EXPERIENCE':
        return { x: -350, y: 150, rotate: -15, scale: 0.9 };
      case 'INTERESTS':
        return { x: 350, y: 150, rotate: 10, scale: 1 };
      case 'COMPLETING':
        return { x: 380, y: -30, rotate: 10, scale: 1.2 };
      default:
        return { x: 0, y: 0, rotate: 0, scale: 1 };
    }
  };

  const currentVariant = getVariants();

  const blinkAnimation = {
    scaleY: [1, 1, 0.1, 1, 1],
    transition: { duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" as const }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
      <motion.div
        animate={currentVariant}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="relative"
      >
        {/* Holographic glow base */}
        <motion.div 
          className="absolute inset-0 bg-cyan-400 rounded-full blur-[40px] opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        
        {/* The Float mechanic */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative drop-shadow-[0_0_15px_rgba(0,255,233,0.5)] w-[150px] h-[200px]"
        >
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

          {/* Arms / Details (Optional) */}
          {step === 'START' && (
            <motion.div 
              className="absolute -right-6 top-6 text-cyan-400 drop-shadow-[0_0_5px_currentColor] z-20"
              animate={{ rotate: [0, 20, 0, 20, 0], scale: [1, 1.1, 1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Hand size={30} />
            </motion.div>
          )}

          {step === 'COMPLETING' && (
            <motion.div 
              className="absolute -left-5 -top-5 text-fuchsia-400 drop-shadow-[0_0_8px_currentColor] z-20"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Sparkles size={24} />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
