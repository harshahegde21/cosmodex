'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { BookOpen, Layers, FileQuestion, Trophy, Users, Construction } from 'lucide-react';

const DEMO_SECTIONS = [
  {
    label: 'Languages & Tracks',
    icon: BookOpen,
    color: '#4ECDC4',
    stats: '6 languages',
    desc: 'Manage programming language tracks available on the platform.',
  },
  {
    label: 'Module Manager',
    icon: Layers,
    color: '#8D37D6',
    stats: '24 modules',
    desc: 'Create, edit, and publish curriculum modules per language track.',
  },
  {
    label: 'Question Bank',
    icon: FileQuestion,
    color: '#F5A623',
    stats: '312 exercises',
    desc: 'Manage MCQ, code, and fill-in-the-blank learning exercises.',
  },
  {
    label: 'Badge Manager',
    icon: Trophy,
    color: '#E873C3',
    stats: '18 badges',
    desc: 'Configure badges, criteria JSON, and achievement rewards.',
  },
  {
    label: 'Progress Inspector',
    icon: Users,
    color: '#3DCB7F',
    stats: '1,204 learners',
    desc: 'Inspect user progress, submissions, and learning analytics.',
  },
];

export default function LearningAdminPage() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-[#4ECDC4]" />
            <h1 className="text-2xl font-black text-white">Learning Admin</h1>
          </div>
          <p className="text-sm text-white/40">
            Curriculum management center for languages, modules, topics, exercises, and badges.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="relative overflow-hidden bg-[#4ECDC4]/[0.06] border border-[#4ECDC4]/[0.25] rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/20 border border-[#4ECDC4]/30 flex items-center justify-center flex-shrink-0">
            <Construction size={20} className="text-[#4ECDC4]" />
          </div>
          <div>
            <p className="font-bold text-[#4ECDC4] text-sm mb-0.5">Dashboard Preview</p>
            <p className="text-white/50 text-xs leading-relaxed">
              This panel is currently in development. The sections below show the planned functionality. Full CRUD operations coming soon.
            </p>
          </div>
        </div>

        {/* Demo Section Cards */}
        <div>
          <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Platform Sections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.label}
                  className="relative group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] hover:-translate-y-0.5 cursor-not-allowed"
                >
                  {/* Ambient glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity pointer-events-none"
                    style={{ background: section.color }}
                  />

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${section.color}18`, border: `1px solid ${section.color}35` }}
                    >
                      <Icon size={18} style={{ color: section.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-sm">{section.label}</h3>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${section.color}20`, color: section.color }}
                        >
                          {section.stats}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{section.desc}</p>
                    </div>
                  </div>

                  {/* Coming soon overlay label */}
                  <div className="absolute bottom-3 right-4">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Coming Soon</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Change password shortcut */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-white text-sm">Account Settings</p>
            <p className="text-xs text-white/40 mt-0.5">Update your Learning Admin password.</p>
          </div>
          <a
            href="/learning-admin/change-password"
            className="px-4 py-2 rounded-xl text-sm font-bold text-[#4ECDC4] bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 hover:bg-[#4ECDC4]/20 transition-all"
          >
            Change Password
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
