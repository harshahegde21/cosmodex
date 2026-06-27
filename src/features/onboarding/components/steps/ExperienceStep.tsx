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
  // Define color schemes for each level with glass effects
  const levelColorSchemes = {
    'Beginner': {
      selectedBg: 'linear-gradient(135deg, rgba(34, 211, 238, 0.3), rgba(59, 130, 246, 0.3))',
      selectedBorder: 'rgb(34, 211, 238)',
      selectedShadow: 'rgba(34, 211, 238, 0.3)',
      hoverBorder: 'rgba(34, 211, 238, 0.5)',
      hoverShadow: 'rgba(34, 211, 238, 0.4)',
      accentBg: 'rgb(34, 211, 238)',
      iconBg: 'rgba(34, 211, 238, 0.2)',
      iconBorder: 'rgba(34, 211, 238, 0.3)',
      iconText: 'rgb(34, 211, 238)',
    },
    'Intermediate': {
      selectedBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
      selectedBorder: 'rgb(168, 85, 247)',
      selectedShadow: 'rgba(168, 85, 247, 0.3)',
      hoverBorder: 'rgba(168, 85, 247, 0.5)',
      hoverShadow: 'rgba(168, 85, 247, 0.4)',
      accentBg: 'rgb(168, 85, 247)',
      iconBg: 'rgba(168, 85, 247, 0.2)',
      iconBorder: 'rgba(168, 85, 247, 0.3)',
      iconText: 'rgb(168, 85, 247)',
    },
    'Advanced': {
      selectedBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(244, 63, 94, 0.3))',
      selectedBorder: 'rgb(249, 115, 22)',
      selectedShadow: 'rgba(249, 115, 22, 0.3)',
      hoverBorder: 'rgba(249, 115, 22, 0.5)',
      hoverShadow: 'rgba(249, 115, 22, 0.4)',
      accentBg: 'rgb(249, 115, 22)',
      iconBg: 'rgba(249, 115, 22, 0.2)',
      iconBorder: 'rgba(249, 115, 22, 0.3)',
      iconText: 'rgb(249, 115, 22)',
    },
  };

  const levels: { id: ExperienceLevel; icon: React.ElementType; title: string; desc: string; scheme: keyof typeof levelColorSchemes }[] = [
    { id: 'Beginner', icon: Shield, title: 'Initiate', desc: 'Starting my coding journey.', scheme: 'Beginner' },
    { id: 'Intermediate', icon: Swords, title: 'Explorer', desc: 'Building things and breaking them.', scheme: 'Intermediate' },
    { id: 'Advanced', icon: Crown, title: 'Commander', desc: 'Architecting complex systems.', scheme: 'Advanced' },
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
          const colors = levelColorSchemes[lvl.scheme];
          
          return (
            <motion.button
              key={lvl.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => updateData({ experienceLevel: lvl.id })}
              style={{
                background: isSelected ? colors.selectedBg : 'rgba(255, 255, 255, 0.05)',
                borderColor: isSelected ? colors.selectedBorder : 'rgba(255, 255, 255, 0.1)',
                boxShadow: `0 0 ${isSelected ? 30 : 0}px ${isSelected ? colors.selectedShadow : 'transparent'}`,
                transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = colors.hoverBorder;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = `0 0 25px ${colors.hoverShadow}`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = '0 0 0px transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
              className="w-full text-left p-5 rounded-[20px] border flex items-center gap-5 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm"
            >
              {isSelected && (
                <motion.div 
                  layoutId="highlight" 
                  style={{ background: colors.accentBg }}
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                />
              )}
              
              <div 
                style={{
                  background: isSelected ? colors.iconBg : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isSelected ? colors.iconBorder : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? colors.iconText : 'rgba(255, 255, 255, 0.4)',
                }}
                className="p-4 rounded-xl backdrop-blur-md border transition-all"
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = colors.iconBg;
                    e.currentTarget.style.borderColor = colors.iconBorder;
                    e.currentTarget.style.color = colors.iconText;
                    e.currentTarget.style.boxShadow = `0 0 15px ${colors.hoverShadow}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
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
