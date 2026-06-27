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

// Color palette for interest tags - rotate through vibrant colors
const interestColors = [
  { bg: 'linear-gradient(135deg, rgba(34, 211, 238, 0.8), rgba(59, 130, 246, 0.8))', border: 'rgba(34, 211, 238, 0.8)', shadow: 'rgba(34, 211, 238, 0.5)' }, // cyan-blue
  { bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8))', border: 'rgba(168, 85, 247, 0.8)', shadow: 'rgba(168, 85, 247, 0.5)' }, // purple-pink
  { bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(244, 63, 94, 0.8))', border: 'rgba(249, 115, 22, 0.8)', shadow: 'rgba(249, 115, 22, 0.5)' }, // orange-rose
  { bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(59, 130, 246, 0.8))', border: 'rgba(34, 197, 94, 0.8)', shadow: 'rgba(34, 197, 94, 0.5)' }, // green-blue
  { bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(249, 115, 22, 0.8))', border: 'rgba(236, 72, 153, 0.8)', shadow: 'rgba(236, 72, 153, 0.5)' }, // pink-orange
  { bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8))', border: 'rgba(59, 130, 246, 0.8)', shadow: 'rgba(59, 130, 246, 0.5)' }, // blue-indigo
  { bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(99, 102, 241, 0.8))', border: 'rgba(168, 85, 247, 0.8)', shadow: 'rgba(168, 85, 247, 0.5)' }, // purple-indigo
  { bg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.8), rgba(249, 115, 22, 0.8))', border: 'rgba(244, 63, 94, 0.8)', shadow: 'rgba(244, 63, 94, 0.5)' }, // rose-orange
  { bg: 'linear-gradient(135deg, rgba(34, 211, 238, 0.8), rgba(34, 197, 94, 0.8))', border: 'rgba(34, 211, 238, 0.8)', shadow: 'rgba(34, 211, 238, 0.5)' }, // cyan-green
  { bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(168, 85, 247, 0.8))', border: 'rgba(236, 72, 153, 0.8)', shadow: 'rgba(236, 72, 153, 0.5)' }, // pink-purple
];

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
          const colorScheme = interestColors[i % interestColors.length];
          
          return (
            <motion.button
              key={interest.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(interest.id)}
              style={{
                background: isSelected ? colorScheme.bg : 'rgba(255, 255, 255, 0.05)',
                borderColor: isSelected ? colorScheme.border : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isSelected ? `0 0 20px ${colorScheme.shadow}, 0 0 40px ${colorScheme.shadow}` : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = colorScheme.border;
                  e.currentTarget.style.boxShadow = `0 0 20px ${colorScheme.shadow}`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="px-5 py-3 rounded-2xl text-sm font-medium border flex items-center gap-2 transition-all duration-300 text-white backdrop-blur-md"
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
