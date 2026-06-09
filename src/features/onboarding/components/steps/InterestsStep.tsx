import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { OnboardingData } from '../../types/onboarding';
import { INTERESTS_OPTIONS } from '../../theme/constants';

interface InterestsStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function InterestsStep({ data, onNext, onBack, updateData }: InterestsStepProps) {
  const toggleInterest = (id: string) => {
    const current = data.interests;
    if (current.includes(id)) {
      updateData({ interests: current.filter(i => i !== id) });
    } else {
      updateData({ interests: [...current, id] });
    }
  };

  const handleNext = () => {
    if (data.interests.length > 0) {
      onNext();
    }
  };

  return (
    <div className="cosmo-glass p-8 sm:p-12 w-full max-w-3xl mx-auto pt-16">
      <button onClick={onBack} className="absolute left-6 top-6 text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold mb-2">Systems Calibration</h2>
        <p className="text-cosmo-text-muted text-sm">Select at least one sector of interest.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {INTERESTS_OPTIONS.map((interest, i) => {
          const isSelected = data.interests.includes(interest.id);
          return (
            <motion.button
              key={interest.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(interest.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium border flex items-center gap-2 transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#E873C3] to-[#8D37D6] border-transparent text-white shadow-[0_0_20px_rgba(217,95,209,0.5)] scale-105' 
                  : 'bg-white/10 border-white/15 text-white/70 hover:bg-white/15 hover:border-[#D95FD1]/50 hover:text-white hover:shadow-[0_0_20px_rgba(217,95,209,0.25)] hover:-translate-y-0.5 backdrop-blur-md'
              }`}
            >
              {isSelected && <Check size={16} className="text-white drop-shadow-md" />}
              {interest.label}
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={data.interests.length === 0}
        className="cosmo-btn-primary w-full max-w-xs mx-auto py-4 text-base"
      >
        Finalize Setup <ArrowRight size={18} />
      </button>
    </div>
  );
}
