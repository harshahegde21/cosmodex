import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OnboardingData } from '../../types/onboarding';

interface CompletionStepProps {
  data: OnboardingData;
}

export default function CompletionStep({ data }: CompletionStepProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const hasCalledRegister = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (hasCalledRegister.current) return;
    hasCalledRegister.current = true;

    async function registerUser() {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            username: data.username,
            avatarId: data.avatarId,
            experienceLevel: data.experienceLevel,
            interests: data.interests,
            authMethod: data.authMethod,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          if (isMounted.current) {
            setError(json.error || 'Failed to create user. Please try again.');
          }
          return;
        }

        if (data.authMethod && data.authMethod !== 'Email') {
          await fetch('/api/auth/oauth-pending', { method: 'DELETE' });
        }

        setTimeout(() => {
          if (isMounted.current) {
            router.push('/dashboard');
          }
        }, 3000);
      } catch {
        if (isMounted.current) {
          setError('Network error. Please try again.');
        }
      }
    }

    registerUser();
  }, [data, router]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 mt-24">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 relative"
      >
        <motion.div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500 rounded-full blur-[80px]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white drop-shadow-lg relative z-10">
          Welcome Aboard,<br /> <span className="text-gradient-1">{data.username}</span>
        </h2>
        <p className="text-cosmo-text-muted text-lg relative z-10">
          {error ? (
            <span className="text-rose-400 font-mono text-base">{error}</span>
          ) : (
            'Your command center is ready. Syncing data with the network...'
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10 overflow-hidden group">
          <motion.div
            className="absolute bottom-0 w-full bg-cyan-500"
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
          />
          <Rocket size={32} className="text-white relative z-10 drop-shadow-md group-hover:-translate-y-2 transition-transform" />
        </div>
      </motion.div>
    </div>
  );
}
