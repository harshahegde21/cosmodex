import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, UserCircle } from 'lucide-react';
import { OnboardingData } from '../../types/onboarding';
import { AVATARS } from '../../theme/constants';

interface PreviewStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
}

export default function PreviewStep({ data, onNext, onBack }: PreviewStepProps) {
  const avatar = AVATARS.find(a => a.id === data.avatarId) || AVATARS[0];

  return (
    <div className="flex flex-col items-center">
      <div className="absolute top-0 left-[-40px] pointer-events-auto">
        <button onClick={onBack} className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-black/60 transition-colors border border-white/10">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="text-center mb-8">
         <h2 className="text-3xl font-display font-bold mb-2">Profile Activated</h2>
         <p className="text-cosmo-text-muted">This is how cosmoverse will see you.</p>
      </div>

      <motion.div 
        initial={{ y: 20, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="cosmo-glass p-1 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Banner */}
        <div className={`h-32 w-full ${avatar.cls} relative rounded-t-[1.8rem]`}>
           <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        </div>

        {/* Avatar */}
        <div className="relative -mt-16 flex justify-center">
          <div className="p-2 bg-cosmo-surface backdrop-blur-xl rounded-full border border-cosmo-border shadow-xl">
             <div className={`w-28 h-28 rounded-full ${avatar.cls} flex items-center justify-center p-1 relative overflow-hidden`}>
               <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
               <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full border-2 border-dashed border-white/40 flex items-center justify-center"
               >
                  <UserCircle size={40} className="text-white/60" />
               </motion.div>
             </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center pt-4 pb-8 px-6">
          <h3 className="text-2xl font-bold font-display text-white">@{data.username}</h3>
          <div className="inline-flex mt-3 px-3 py-1 bg-white/5 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(0,255,233,0.1)]">
            Cosmodex Recruit
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onNext}
        className="cosmo-btn-primary mt-10 px-10 py-5 w-full max-w-xs text-base"
      >
        Continue Journey <ArrowRight size={18} />
      </motion.button>
    </div>
  );
}
