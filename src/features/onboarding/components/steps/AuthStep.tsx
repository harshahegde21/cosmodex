import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { OnboardingData } from '../../types/onboarding';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface AuthStepProps {
  onNext: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
}

export default function AuthStep({ onNext, updateData }: AuthStepProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'login';
    }
    return false;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('error') || '';
    }
    return '';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const resData = await res.json();
        if (!res.ok || resData.error) {
          setError(resData.error || 'Invalid credentials or account inactive.');
          setIsSubmitting(false);
          return;
        }

        router.push('/dashboard');
        return;
      }

      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const resData = await res.json();
      if (resData.exists) {
        setError('This email is already registered.');
        setIsSubmitting(false);
        return;
      }
      if (resData.error) {
        setError(resData.error);
        setIsSubmitting(false);
        return;
      }

      updateData({ authMethod: 'Email', email, password });
      onNext();
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProvider = async (provider: 'Google' | 'GitHub') => {
    setError('');
    setIsSubmitting(true);
    signIn(provider.toLowerCase(), { callbackUrl: '/onboarding?step=USERNAME' });
  };

  const isFormValid = email && password && (isLogin || password.length >= 8);

  return (
    <div className="cosmo-glass p-8 sm:p-10 w-full max-w-sm mx-auto shadow-2xl relative overflow-hidden">
      <motion.div
        key={isLogin ? 'login' : 'signup'}
        initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-bold mb-2 text-white">
            {isLogin ? 'Welcome back' : 'Identity Access'}
          </h2>
          <p className="text-cosmo-text-muted text-sm">
            {isLogin ? 'Log in to resume your journey' : 'Authenticate your credentials'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Email"
              className="cosmo-input text-sm"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                if (!isLogin && val.length > 0 && val.length < 8) {
                  setError('Password must be at least 8 characters.');
                } else {
                  setError('');
                }
              }}
              placeholder="Password"
              className="cosmo-input text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="text-rose-500 text-xs font-mono text-center mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="cosmo-btn-primary w-full py-4 text-base mt-4"
          >
            {isSubmitting ? 'Checking...' : (isLogin ? 'Log in' : 'Sign up for free')}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0a0518] px-4 text-[10px] text-white/40 font-bold uppercase tracking-widest text-[#0a0518]">
            <span className="bg-[#0a0518] text-white/40 px-2 rounded">OR</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleProvider('Google')}
            className="cosmo-btn-secondary py-3 text-sm font-medium"
          >
            <div className="w-4 h-4 rounded-full flex items-center justify-center">
              {/* Simple Google SVG icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleProvider('GitHub')}
            className="cosmo-btn-secondary py-3 text-sm font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        <div className="text-center text-sm space-y-4">
          {!isLogin && (
            <p className="text-white/40 text-xs">
              By signing up, I agree to Cosmodex&apos;s <a href="#" className="underline hover:text-white transition-colors">Terms</a>.
            </p>
          )}

          <p className="text-cosmo-text-muted">
            {isLogin ? "Need an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#38bdf8] hover:text-[#7dd3fc] font-medium transition-colors hover:underline"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>

          {isLogin && (
            <button type="button" className="text-white/40 hover:text-white/80 text-xs transition-colors hover:underline block w-full">
              Reset password
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
