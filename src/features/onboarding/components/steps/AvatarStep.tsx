import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, UserCircle } from 'lucide-react';
import { OnboardingData } from '../../types/onboarding';
import { AVATARS } from '../../theme/constants';

interface AvatarStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function AvatarStep({ data, onNext, onBack, updateData }: AvatarStepProps) {
  const handleNext = () => {
    if (data.avatarId) {
      onNext();
    }
  };

  return (
    <div className="cosmo-glass p-8 sm:p-12 w-full max-w-2xl mx-auto">
      <button onClick={onBack} className="absolute left-6 top-6 text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-10 mt-2">
        <h2 className="text-2xl font-display font-bold mb-2">Select Hologram</h2>
        <p className="text-cosmo-text-muted text-sm">Choose your visual representation.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
        {AVATARS.map((avatar, i) => {
          const isSelected = data.avatarId === avatar.id;
          return (
            <motion.button
              key={avatar.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              onClick={() => updateData({ avatarId: avatar.id })}
              className={`relative group rounded-2xl p-1 transition-all duration-300 ${
                isSelected ? 'scale-110 shadow-[0_0_30px_rgba(232,115,195,0.6)] z-10' : 'hover:scale-105 hover:shadow-[0_0_20px_rgba(217,95,209,0.3)] hover:-translate-y-1'
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`} />
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl ${avatar.cls} flex items-center justify-center p-1 overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                <motion.div 
                   animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className={`w-full h-full rounded-lg border-2 ${isSelected ? 'border-white/50' : 'border-white/20'} flex flex-col items-center justify-center`}
                >
                  <UserCircle size={32} className="text-white/60 mb-1" />
                </motion.div>
              </div>
              <div className={`mt-3 text-xs font-mono font-medium tracking-wide text-center transition-colors ${isSelected ? 'text-[#E873C3] drop-shadow-[0_0_8px_rgba(232,115,195,0.5)]' : 'text-white/50'}`}>
                {avatar.name}
              </div>
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!data.avatarId}
        className="cosmo-btn-primary w-full max-w-xs mx-auto py-4 text-base"
      >
        Lock Appearance <ArrowRight size={18} />
      </button>
    </div>
  );
}
