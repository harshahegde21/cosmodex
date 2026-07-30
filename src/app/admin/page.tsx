'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, BookOpen, Swords, Eye, EyeOff, Loader2, Lock } from 'lucide-react';

const ADMIN_PANELS = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    subtitle: 'Full platform control',
    description: 'User management, RBAC role assignment, audit logs, and admin account creation.',
    icon: Shield,
    gradient: 'from-[#E873C3] via-[#D95FD1] to-[#8D37D6]',
    glow: 'rgba(232,115,195,0.4)',
    border: 'rgba(232,115,195,0.3)',
    href: '/super-admin',
  },
  {
    role: 'learning_admin',
    label: 'Learning Admin',
    subtitle: 'Curriculum management',
    description: 'Manage languages, modules, topics, exercises, and badges for the learning platform.',
    icon: BookOpen,
    gradient: 'from-[#4ECDC4] via-[#26B5A8] to-[#1A7A74]',
    glow: 'rgba(78,205,196,0.4)',
    border: 'rgba(78,205,196,0.3)',
    href: '/learning-admin',
  },
  {
    role: 'arena_admin',
    label: 'Battle Arena Admin',
    subtitle: 'Arena & match control',
    description: 'Manage battle problems, test cases, ELO ratings, and monitor active matches.',
    icon: Swords,
    gradient: 'from-[#FF6B35] via-[#F5A623] to-[#C0392B]',
    glow: 'rgba(255,107,53,0.4)',
    border: 'rgba(255,107,53,0.3)',
    href: '/arena-admin',
  },
];

export default function AdminGatewayPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        return;
      }

      const { role } = data.user;

      // Redirect to the appropriate admin panel based on role
      if (role === 'super_admin') {
        router.push('/super-admin');
      } else if (role === 'learning_admin') {
        router.push('/learning-admin');
      } else if (role === 'arena_admin') {
        router.push('/arena-admin');
      } else {
        setError('Your account does not have admin access.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06020f] flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#D95FD1] opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#4ECDC4] opacity-[0.05] blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#FF6B35] opacity-[0.04] blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='rgba(255,255,255,1)' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E873C3] to-[#8D37D6] flex items-center justify-center shadow-[0_0_20px_rgba(232,115,195,0.5)]">
              <Lock size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-wide font-lato">CosmoDex</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white text-center leading-tight">
            Admin Portal
          </h1>
          <p className="text-white/50 text-base text-center max-w-md">
            Secure access for authorized administrators only. Sign in to manage the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── Login Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 mb-6">
                <Lock size={16} className="text-[#E873C3]" />
                <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">Admin Sign In</h2>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
                    className="bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D95FD1] focus:shadow-[0_0_0_3px_rgba(217,95,209,0.15)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D95FD1] focus:shadow-[0_0_0_3px_rgba(217,95,209,0.15)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#E873C3] via-[#D95FD1] to-[#8D37D6] shadow-[0_0_20px_rgba(232,115,195,0.35)] hover:shadow-[0_0_30px_rgba(232,115,195,0.55)] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In to Admin Panel'
                  )}
                </button>
              </form>

              <p className="mt-5 text-xs text-white/30 text-center">
                Access is restricted to authorized administrators. Unauthorized attempts are logged.
              </p>
            </div>
          </div>

          {/* ── Admin Panel Cards ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Available Panels</p>
            {ADMIN_PANELS.map((panel) => {
              const Icon = panel.icon;
              return (
                <div
                  key={panel.role}
                  className="group relative bg-white/[0.03] border rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-0.5 cursor-default overflow-hidden"
                  style={{ borderColor: panel.border }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(circle at top left, ${panel.glow} 0%, transparent 60%)` }}
                  />

                  <div className="relative flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${panel.glow} 0%, transparent 100%)`, border: `1px solid ${panel.border}` }}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-base">{panel.label}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                          {panel.role}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed">{panel.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
