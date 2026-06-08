import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Shield, Swords, Crown } from 'lucide-react';
import { OnboardingData, ExperienceLevel } from '../../types/onboarding';

interface ExperienceStepProps {
  data: OnboardingData;
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function ExperienceStep({ data, onNext, onBack, updateData }: ExperienceStepProps) {
  const levels: { id: ExperienceLevel; icon: React.ElementType; title: string; desc: string; color: string }[] = [
    { id: 'Beginner', icon: Shield, title: 'Initiate', desc: 'Starting my coding journey.', color: 'text-cyan-400' },
    { id: 'Intermediate', icon: Swords, title: 'Explorer', desc: 'Building things and breaking them.', color: 'text-accent' },
    { id: 'Advanced', icon: Crown, title: 'Commander', desc: 'Architecting complex systems.', color: 'text-fuchsia-400' },
  ];

  const handleNext = () => {
    if (data.experienceLevel) {
      onNext();
    }
  };

  return (
    <div className="cosmo-glass p-8 sm:p-12 w-full max-w-2xl mx-auto flex flex-col pt-16">
      <button onClick={onBack} className="absolute left-6 top-6 text-white/50 hover:text-white transition-colors">
        <ArrowLeft size={20} />
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold mb-2">Combat Rank</h2>
        <p className="text-cosmo-text-muted text-sm">Select your current engineering proficiency.</p>
      </div>

      <div className="space-y-4 mb-10">
        {levels.map((lvl, i) => {
          const isSelected = data.experienceLevel === lvl.id;
          return (
            <motion.button
              key={lvl.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => updateData({ experienceLevel: lvl.id })}
              className={`w-full text-left p-5 rounded-[20px] border flex items-center gap-5 transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#E873C3]/30 to-[#8D37D6]/30 border-[#E873C3]/50 shadow-[0_0_30px_rgba(217,95,209,0.3)] -translate-y-1' 
                  : 'bg-white/10 border-white/10 hover:border-[#D95FD1]/50 hover:bg-white/15 hover:shadow-[0_0_25px_rgba(217,95,209,0.2)] hover:-translate-y-1'
              }`}
            >
              {isSelected && (
                <motion.div layoutId="highlight" className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#E873C3] to-[#8D37D6]" />
              )}
              
              <div className={`p-4 rounded-xl bg-black/30 backdrop-blur-md ${isSelected ? 'text-[#E873C3] shadow-[0_0_15px_rgba(232,115,195,0.4)]' : 'text-white/40 group-hover:text-white/80'} transition-all`}>
                <lvl.icon size={24} />
              </div>
              
              <div>
                <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-white/80'}`}>{lvl.title}</h3>
                <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-white/50'}`}>{lvl.desc}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!data.experienceLevel}
        className="cosmo-btn-primary w-full max-w-xs mx-auto py-4 text-base"
      >
        Set Coordinates <ArrowRight size={18} />
      </button>
    </div>
  );
}
