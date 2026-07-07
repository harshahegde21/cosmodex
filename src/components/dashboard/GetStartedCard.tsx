"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Gamepad2, Globe, Cpu, Sparkles } from "lucide-react";

interface Enrollment {
  id: string;
  languageName: string;
  languageCode: string;
  iconUrl: string | null;
  currentModuleTitle: string | null;
}

interface GetStartedCardProps {
  enrollments?: Enrollment[];
}

// Map language codes to icons and colors
function getLanguageStyle(code: string): { icon: typeof Code2; color: string; bg: string } {
  const lower = code.toLowerCase();
  if (lower.includes('python')) return { icon: Cpu, color: '#E873C3', bg: 'bg-[#E873C3]/10' };
  if (lower.includes('cpp') || lower.includes('c++') || lower.includes('c_')) return { icon: Code2, color: '#3b82f6', bg: 'bg-blue-900/30' };
  if (lower.includes('js') || lower.includes('javascript')) return { icon: Sparkles, color: '#FFD700', bg: 'bg-yellow-900/20' };
  if (lower.includes('java')) return { icon: Cpu, color: '#f97316', bg: 'bg-orange-900/20' };
  if (lower.includes('web') || lower.includes('html') || lower.includes('css')) return { icon: Globe, color: '#10B981', bg: 'bg-emerald-900/20' };
  if (lower.includes('game')) return { icon: Gamepad2, color: '#8B5CF6', bg: 'bg-purple-900/20' };
  return { icon: Code2, color: '#E873C3', bg: 'bg-[#E873C3]/10' };
}

export default function GetStartedCard({ enrollments = [] }: GetStartedCardProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  // No enrollments — show onboarding CTA
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-display text-white tracking-wide">Get Started</h2>
        </div>

        <div className="cosmo-glass-panel p-6 border border-white/10 flex flex-col relative overflow-hidden group min-h-[170px] justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-colors duration-500 bg-[#E873C3] opacity-20" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Welcome to CosmoDex!</h3>
              <p className="text-sm text-white/70">Complete onboarding to unlock your personalized learning path.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0 justify-end">
              <Link
                href="/onboarding"
                className="cosmo-btn-primary py-2.5 px-6 rounded-xl text-sm"
              >
                Start Onboarding
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform inline-block ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selected = enrollments[selectedIdx] ?? enrollments[0];
  const style = getLanguageStyle(selected.languageCode);
  const Icon = style.icon;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display text-white tracking-wide">Continue Learning</h2>
        {enrollments.length > 1 && (
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            {enrollments.map((e, idx) => {
              const s = getLanguageStyle(e.languageCode);
              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    selectedIdx === idx
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                  style={selectedIdx === idx ? { color: s.color } : {}}
                >
                  {e.languageName.split(' ')[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="cosmo-glass-panel p-6 border border-white/10 flex flex-col relative overflow-hidden group min-h-[170px]">
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: `${style.color}20` }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl ${style.bg} flex items-center justify-center p-3 transition-colors duration-300 border border-white/5`}>
              <Icon size={32} color={style.color} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white transition-all duration-300">{selected.languageName}</h3>
              <p className="text-sm text-white/50 mt-1 transition-all duration-300">
                {selected.currentModuleTitle ?? 'Continue your journey'}
              </p>
            </div>
          </div>
          <Link
            href="/learn"
            className="cosmo-btn-primary py-2.5 px-6 rounded-xl text-sm w-full sm:w-auto"
          >
            Continue
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform ml-1 inline-block" />
          </Link>
        </div>

        <div className="flex items-center gap-4 relative z-10 mt-auto">
          <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#E873C3] shadow-[0_0_10px_rgba(232,115,195,0.4)]"
              style={{ width: '0%' }}
            />
          </div>
          <span className="text-xs font-bold text-white/50 min-w-[90px] text-right transition-all duration-300">
            In Progress
          </span>
        </div>
      </div>
    </div>
  );
}
