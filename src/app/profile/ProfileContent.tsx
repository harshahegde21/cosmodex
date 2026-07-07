"use client";
import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Edit, Zap, Shield, Award, Flame, Plus, X, Globe, Link, MessageCircle, Video, Share2, CheckCircle2, Star, Loader2 } from 'lucide-react';
import RisingStars from '../../component/RisingStar';

const ONBOARDING_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript',
  'UI/UX Design', 'Web Development', 'AI/ML',
  'Cybersecurity', 'Game Development', 'Open Source'
];

interface Badge {
  id: string;
  name: string;
  description: string | null;
  earnedAt: string | null;
}

interface ProfileContentProps {
  userId: string | null;
  username: string;
  email: string;
  createdAt: string | null;
  interests: string[];
  xpTotal: number;
  level: number;
  experienceLevel: string | null;
  streak: number;
  badgeCount: number;
  badges: Badge[];
  starPoints: number;
  rankThreshold: number;
}

function getRankLabel(experienceLevel: string | null | undefined): string {
  if (experienceLevel === 'Advanced') return 'Commander';
  if (experienceLevel === 'Intermediate') return 'Explorer';
  return 'Initiate';
}

function formatJoinDate(iso: string | null): string {
  if (!iso) return 'Recently joined';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function ProfileContent({
  userId,
  username: initialUsername,
  createdAt,
  interests: initialInterests,
  xpTotal,
  level,
  experienceLevel,
  streak,
  badgeCount,
  badges,
  starPoints,
  rankThreshold,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: initialUsername,
    username: initialUsername,
    skills: initialInterests,
    socials: {
      github: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      twitch: ''
    }
  });

  const [editData, setEditData] = useState(profile);

  const handleSaveProfile = () => {
    setSaveError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: editData.username,
            interests: editData.skills,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setSaveError(data.error ?? 'Failed to save profile.');
          return;
        }

        setProfile({
          ...editData,
          name: editData.username,
        });
        setIsEditing(false);
      } catch {
        setSaveError('Network error. Please try again.');
      }
    });
  };

  const toggleSkill = (skill: string) => {
    if (profile.skills.includes(skill)) {
      setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    } else {
      setProfile({ ...profile, skills: [...profile.skills, skill] });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  const availableSkills = ONBOARDING_SKILLS.filter(skill => !profile.skills.includes(skill));

  const rankProgress = Math.min((starPoints / rankThreshold) * 100, 100);
  const nextRankName = starPoints >= rankThreshold ? 'Silver' : 'Silver';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0518]">
      {/* Background exact match via CSS */}
      <div className="absolute inset-[-10%] w-[120%] h-[120%] pointer-events-none">
        {/* Core dark space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,#1a0b2e_0%,#080312_100%)] opacity-90" />

        <RisingStars />

        {/* Nebula dust / subtle colored clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
              rotate: [-45, -40, -45]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[30%] w-[40rem] h-[30rem] bg-indigo-900/20 rounded-[100%] blur-[100px] mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] right-[20%] w-[35rem] h-[25rem] bg-fuchsia-900/10 rounded-[100%] blur-[120px] mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.9, 0.7, 0.9],
              x: [0, -15, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-900/10 rounded-[100%] blur-[100px] mix-blend-screen"
          />
        </div>

        {/* Small stars layers */}
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10%]" style={{
            backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.4
          }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10%]" style={{
            backgroundImage: 'radial-gradient(1.5px 1.5px at 10px 10px, #e0b0ff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 150px, #fuchsia, rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            opacity: 0.3
          }}
        />

        {/* Twinkling Stars */}
        <motion.div
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(2px 2px at 80px 120px, rgba(255,255,255,0.9), rgba(0,0,0,0)), radial-gradient(2px 2px at 250px 50px, rgba(158,0,246,0.8), rgba(0,0,0,0)), radial-gradient(2px 2px at 180px 300px, rgba(0,255,233,0.9), rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '350px 350px'
          }}
        />
        <motion.div
          animate={{ opacity: [0.9, 0.2, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(2px 2px at 120px 220px, rgba(255,220,100,0.9), rgba(0,0,0,0)), radial-gradient(2.5px 2.5px at 300px 180px, rgba(255,255,255,1), rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 40px 350px, rgba(255,100,200,0.8), rgba(0,0,0,0))',
            backgroundRepeat: 'repeat',
            backgroundSize: '450px 450px'
          }}
        />

        {/* Top Left Planet */}
        <motion.div
           animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
           transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[8%] left-[5%] max-lg:top-[12%] xl:left-[8%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] sm:min-w-[300px] sm:min-h-[300px]"
        >
          <div className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #E873C3 0%, #D95FD1 40%, #8D37D6 70%, #2A0845 100%)',
              boxShadow: 'inset -20px -20px 60px 0px rgba(0,0,0, 0.6), inset 10px 10px 30px 0px rgba(255, 200, 255, 0.5), 0 0 50px 0px rgba(217, 95, 209, 0.1)'
            }}>
            <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
              }}
            />
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-30 mix-blend-soft-light" />
          </div>
        </motion.div>

        {/* Bottom Right Planet */}
        <motion.div
           animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
           className="absolute bottom-[2%] right-[2%] max-lg:bottom-[8%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] sm:min-w-[250px] sm:min-h-[250px]"
        >
          <div className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 40% 30%, #00FFE9 0%, #0284c7 40%, #1e3a8a 75%, #0a0518 100%)',
              boxShadow: 'inset -25px -25px 50px 0px rgba(0, 0, 0, 0.6), inset 15px 15px 40px 0px rgba(255, 255, 255, 0.5), 0 0 60px 0px rgba(0, 255, 233, 0.1)'
            }}
          >
            <div className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-[5]" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full overflow-y-auto px-4 py-8 sm:px-8 custom-scrollbar">
        <div className="w-full h-12 mb-8"></div>

        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 pb-32">

          {/* Left Column (Main Profile) */}
          <div className="flex-1 flex flex-col cosmo-glass-panel border border-white/10 rounded-[32px] pb-10 overflow-hidden relative">

            {/* Banner & Avatar Wrapper */}
            <div className="relative">
              {/* Banner Image */}
              <div className="w-full h-56 sm:h-64 rounded-t-[32px] overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-br from-[#2A0845] via-[#1a0b2e] to-[#0a0518] opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0518]/90 to-transparent" />
                {/* Decorative nebula on banner */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(232,115,195,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(141,55,214,0.1),transparent_60%)]" />
              </div>

              {/* Action Bar */}
              <div className="absolute -bottom-16 left-0 right-0 px-6 sm:px-8 flex justify-end">
                <button
                  onClick={() => {
                    setEditData(profile);
                    setSaveError(null);
                    setIsEditing(true);
                  }}
                  className="cosmo-glass-panel px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white/15 transition-colors border border-white/20 text-white rounded-xl shadow-lg mt-auto mb-20 z-20"
                >
                  <Edit size={16} /> <span className="hidden sm:inline">Edit profile</span>
                </button>
              </div>

              {/* Profile Avatar */}
              <div className="absolute -bottom-16 left-6 sm:left-10 z-20">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-[#0a0518] overflow-hidden bg-gradient-to-br from-[#E873C3] to-[#8D37D6] shadow-[0_0_40px_rgba(141,55,214,0.4)] relative">
                  <div className="w-full h-full bg-white/10 scale-105" />
                  <div className="absolute inset-0 ring-inset ring-2 ring-white/20 rounded-full pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 sm:px-10 mt-20">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
                {profile.name}
              </h1>
              <p className="text-white/60 text-base mt-2 font-mono">@{profile.username}</p>

              <div className="flex items-center gap-2 text-white/50 text-sm mt-5 font-medium">
                <Calendar size={16} /> Joined {formatJoinDate(createdAt)}
              </div>

              <div className="flex items-center gap-6 mt-6 text-sm font-medium">
                <p className="flex items-center gap-1.5"><span className="font-bold text-white text-lg">0</span> <span className="text-white/50 tracking-wide uppercase text-xs">Followers</span></p>
                <p className="flex items-center gap-1.5"><span className="font-bold text-white text-lg">0</span> <span className="text-white/50 tracking-wide uppercase text-xs">Following</span></p>
              </div>

              {/* Profile Navigation Tabs */}
              <div className="flex items-center gap-8 mt-12 border-b border-white/10 text-base font-semibold tracking-wide">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-4 px-1 -mb-[1px] transition-colors ${activeTab === 'overview' ? 'text-white border-b-2 border-fuchsia-400' : 'text-white/40 border-b-2 border-transparent hover:text-white/80'}`}>
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`pb-4 px-1 -mb-[1px] transition-colors ${activeTab === 'practice' ? 'text-white border-b-2 border-fuchsia-400' : 'text-white/40 border-b-2 border-transparent hover:text-white/80'}`}>
                  Practice
                </button>
                <button
                  onClick={() => setActiveTab('battles')}
                  className={`pb-4 px-1 -mb-[1px] transition-colors ${activeTab === 'battles' ? 'text-white border-b-2 border-fuchsia-400' : 'text-white/40 border-b-2 border-transparent hover:text-white/80'}`}>
                  Battles
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {activeTab === 'overview' && (
                  <>
                    <h2 className="text-2xl font-bold font-display text-white mb-6 tracking-wide drop-shadow-md">Recent Activity</h2>
                    <div className="cosmo-glass-panel p-10 w-full text-center border-dashed border-2 border-white/10 flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-white/5">
                      <p className="text-white/60 font-medium text-lg">No recent activity.</p>
                      <p className="text-white/30 text-sm mt-2">Complete lessons to see your progress here.</p>
                    </div>
                  </>
                )}
                {activeTab === 'practice' && (
                  <>
                    <h2 className="text-2xl font-bold font-display text-white mb-6 tracking-wide drop-shadow-md">Practice Sessions</h2>
                    <div className="cosmo-glass-panel p-10 w-full text-center border-dashed border-2 border-white/10 flex flex-col items-center justify-center rounded-2xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer bg-white/5">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4 group-hover:scale-110 group-hover:text-white/40 transition-all">
                        <Plus size={32} />
                      </div>
                      <p className="text-white/60 font-medium text-lg">Start a practice session.</p>
                    </div>
                  </>
                )}
                {activeTab === 'battles' && (
                  <>
                    <h2 className="text-2xl font-bold font-display text-white mb-6 tracking-wide drop-shadow-md">Battle History</h2>
                    <div className="cosmo-glass-panel p-10 w-full text-center border-dashed border-2 border-white/10 flex flex-col items-center justify-center rounded-2xl overflow-hidden hover:border-white/20 transition-all group cursor-pointer bg-white/5">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4 group-hover:scale-110 group-hover:text-white/40 transition-all">
                        <Plus size={32} />
                      </div>
                      <p className="text-white/60 font-medium text-lg">Join your first battle.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[320px] xl:w-[350px] flex flex-col gap-6 mt-8 lg:mt-0 px-4 sm:px-0">

            {/* Identity & Stats Card */}
            <div className="cosmo-glass-panel p-6 border border-white/15 drop-shadow-2xl">
              <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5 relative">
                <div>
                  <h3 className="font-bold text-white text-lg tracking-wide">{profile.username}</h3>
                  <p className="text-sm font-medium text-white/60 font-mono">Level {level}</p>
                </div>
                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl z-[-1]" />
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex items-start gap-3">
                  <div className="text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] mt-0.5 text-[22px] leading-none">✦</div>
                  <div>
                    <p className="font-bold text-white text-xl leading-none">{starPoints}</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Star Points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-[#CD7F32] drop-shadow-[0_0_8px_rgba(205,127,50,0.6)] mt-0.5"><Shield size={20} fill="currentColor" /></div>
                  <div>
                    <p className="font-bold text-white text-base leading-none mt-0.5">{getRankLabel(experienceLevel)}</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 mt-1.5">Rank</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] mt-0.5"><Award size={20} fill="currentColor" /></div>
                  <div>
                    <p className="font-bold text-white text-xl leading-none">{badgeCount}</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Badges</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] mt-0.5"><Flame size={20} fill="currentColor" /></div>
                  <div>
                    <p className="font-bold text-white text-xl leading-none">{streak}</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/50 mt-1">Day Streak</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex justify-between items-end mb-2.5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Current Progress</p>
                    <p className="text-sm font-medium text-white/80"><span className="text-white font-bold">{starPoints}</span> / {rankThreshold} ✦</p>
                  </div>
                  <p className="text-sm font-medium text-white/60 mb-0.5">to {nextRankName}</p>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#E873C3] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${rankProgress}%` }}
                    transition={{ ease: "easeOut", duration: 1.5, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="cosmo-glass-panel p-6 border border-white/10">
              <h3 className="font-bold font-display text-white mb-5 text-lg tracking-wide drop-shadow-sm">Achievements</h3>
              {badges.length === 0 ? (
                <div className="text-center text-white/50 font-medium text-sm py-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                  <Award size={20} className="mx-auto mb-2 text-white/20" />
                  No achievements yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {badges.slice(0, 5).map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center shrink-0">
                        <Star size={14} className="text-fuchsia-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{badge.name}</p>
                        {badge.description && <p className="text-[11px] text-white/50 truncate">{badge.description}</p>}
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    </div>
                  ))}
                  {badges.length > 5 && (
                    <p className="text-xs text-white/40 text-center mt-1">+{badges.length - 5} more</p>
                  )}
                </div>
              )}
            </div>

            {/* Skills Card */}
            <div className="cosmo-glass-panel p-6 border border-white/10">
              <h3 className="font-bold font-display text-white mb-3 text-lg tracking-wide drop-shadow-sm">Skills</h3>
              {profile.skills.length === 0 ? (
                <p className="text-sm text-white/60 mb-6 font-medium">You haven&apos;t listed any skills yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.skills.map(skill => (
                    <div key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 flex items-center gap-2">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(skill)} className="text-white/40 hover:text-white transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {availableSkills.length > 0 && (
                <button
                  onClick={() => setIsAddingSkill(true)}
                  className="cosmo-glass hover:bg-white/15 hover:-translate-y-0.5 transition-all w-full border border-white/20 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-white shadow-lg"
                >
                  <Plus size={18} strokeWidth={2.5} /> Add skills
                </button>
              )}
            </div>

            {/* Socials Card */}
            <div className="cosmo-glass-panel p-6 border border-white/10">
              <h3 className="font-bold font-display text-white mb-4 text-lg tracking-wide drop-shadow-sm">Socials</h3>
              <div className="flex flex-col gap-3">
                {Object.entries(profile.socials).map(([network, url]) => {
                  if (!url) return null;

                  let Icon = Zap;
                  let label = '';
                  if (network === 'github') { Icon = Globe; label = 'GitHub'; }
                  if (network === 'twitter') { Icon = MessageCircle; label = 'X (Twitter)'; }
                  if (network === 'linkedin') { Icon = Link; label = 'LinkedIn'; }
                  if (network === 'instagram') { Icon = Share2; label = 'Instagram'; }
                  if (network === 'youtube') { Icon = Video; label = 'YouTube'; }
                  if (network === 'twitch') { Icon = Video; label = 'Twitch'; }

                  return (
                    <a key={network} href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{label}</span>
                    </a>
                  );
                })}

                {Object.values(profile.socials).every(val => !val) && (
                  <p className="text-sm text-white/60 font-medium">No social links added.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="cosmo-glass-panel border border-white/20 p-6 rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2a0845_0%,transparent_100%)] opacity-50" />

              <div className="relative flex flex-col h-full max-h-[80vh]">
                <button
                  onClick={() => setIsEditing(false)}
                  className="absolute top-0 right-0 text-white/50 hover:text-white transition-colors p-1 z-20 bg-black/20 rounded-full"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-display font-bold text-white mb-6">Edit Profile</h2>

                <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-6">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={e => setEditData({ ...editData, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Username</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={e => setEditData({ ...editData, username: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>

                  {/* Socials */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h3 className="text-white font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {Object.keys(editData.socials).map(network => (
                        <div key={network} className="relative">
                          <label className="block text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">{network}</label>
                          <input
                            type="text"
                            placeholder={`${network}.com/username`}
                            value={editData.socials[network as keyof typeof editData.socials]}
                            onChange={e => setEditData({
                              ...editData,
                              socials: { ...editData.socials, [network]: e.target.value }
                            })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fuchsia-500 transition-colors text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {saveError && (
                  <p className="text-red-400 text-sm mb-3 font-medium">{saveError}</p>
                )}

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-3 flex-shrink-0">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isPending}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#E873C3] to-[#8D37D6] rounded-xl font-medium text-white shadow-[0_0_20px_rgba(141,55,214,0.4)] hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
                  >
                    {isPending && <Loader2 size={16} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isAddingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAddingSkill(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-[500px]"
            >
              <div className="flex flex-col items-center">
                <p className="text-white mb-6 text-[15px] font-medium text-center shadow-black drop-shadow-md">
                  Select at least one sector of interest.
                </p>

                <div className="flex flex-wrap justify-center content-center gap-3 mb-10 w-full max-w-[460px]">
                  {ONBOARDING_SKILLS.map((skill) => {
                    const isSelected = profile.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-6 py-2.5 rounded-[20px] text-sm font-semibold transition-all relative group flex items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#DD52D0] to-[#9934D9] text-white shadow-[0_0_20px_rgba(217,95,209,0.3)]'
                            : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {isSelected && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setIsAddingSkill(false)}
                  className="group relative px-10 py-3.5 bg-gradient-to-r from-[#DB52CF] to-[#9E34DA] rounded-full text-white font-bold text-base flex items-center justify-center shadow-[0_0_30px_rgba(217,95,209,0.5)] hover:shadow-[0_0_40px_rgba(217,95,209,0.7)] transition-all"
                >
                  <span>Finalize Setup</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
