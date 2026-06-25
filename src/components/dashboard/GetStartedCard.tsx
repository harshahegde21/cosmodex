"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Gamepad2, Code2, Sparkles } from "lucide-react";

const activeCourses = [
  {
    id: "python",
    title: "Python Basics",
    description: "Variables and Data Types",
    progress: 60,
    icon: Gamepad2,
    color: "#E873C3",
    bg: "bg-[#E873C3]/10",
  },
  {
    id: "cpp",
    title: "C++ Fundamentals",
    description: "Pointers and Memory Management",
    progress: 25,
    icon: Code2,
    color: "#3b82f6",
    bg: "bg-blue-900/30",
  }
];

export default function GetStartedCard() {
  const [isSkipped, setIsSkipped] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(activeCourses[0]);

  if (!isSkipped) {
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
              <button 
                onClick={() => setIsSkipped(true)}
                className="text-white/50 hover:text-white/90 font-bold text-sm px-4 py-2.5 transition-colors"
              >
                Skip for now
              </button>
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display text-white tracking-wide">Continue Learning</h2>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          {activeCourses.map(course => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                selectedCourse.id === course.id 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {course.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="cosmo-glass-panel p-6 border border-white/10 flex flex-col relative overflow-hidden group min-h-[170px]">
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-colors duration-500" 
          style={{ backgroundColor: `${selectedCourse.color}20` }}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl ${selectedCourse.bg} flex items-center justify-center p-3 transition-colors duration-300 border border-white/5`}>
              <selectedCourse.icon size={32} color={selectedCourse.color} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white transition-all duration-300">{selectedCourse.title}</h3>
              <p className="text-sm text-white/50 mt-1 transition-all duration-300">{selectedCourse.description}</p>
            </div>
          </div>
          <Link
            href="#"
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
              style={{ width: `${selectedCourse.progress}%` }} 
            />
          </div>
          <span className="text-xs font-bold text-white/50 min-w-[90px] text-right transition-all duration-300">
            {selectedCourse.progress}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}
