import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { OnboardingData } from '../../types/onboarding';

interface UsernameStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function UsernameStep({ data, onNext, onBack, updateData }: UsernameStepProps) {
  const [username, setUsername] = useState(data.username);
  const [isTyping, setIsTyping] = useState(false);

  const isValid = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  
  const handleNext = () => {
    if (isValid) {
      updateData({ username });
      onNext();
    }
  };

  return (
    <div className="cosmo-glass p-8 sm:p-12 w-full">
      <button onClick={onBack} className="absolute left-6 top-6 text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-10 mt-2">
        <h2 className="text-2xl font-display font-bold mb-2">Assign Callsign</h2>
        <p className="text-cosmo-text-muted text-sm">Choose a unique identifier for the universe.</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
            placeholder="e.g. starweaver_99"
            className="cosmo-input font-mono text-center text-xl tracking-wider py-5"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {!isTyping && username.length > 0 && (
              isValid ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#E873C3]">
                  <CheckCircle size={20} />
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-400">
                  <XCircle size={20} />
                </motion.div>
              )
            )}
          </div>
        </div>
        
        <div className="flex justify-center h-4">
          {!isTyping && (
             <motion.span 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className={`text-xs ${isValid ? 'text-[#D95FD1]' : username.length > 0 ? 'text-rose-400' : 'text-transparent'}`}
             >
               {isValid ? 'Callsign available.' : username.length > 0 ? 'Invalid format or too short.' : ''}
             </motion.span>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!isValid}
          className="cosmo-btn-primary w-full py-4 text-base"
        >
          Confirm Trajectory <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
