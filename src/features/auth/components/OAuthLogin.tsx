'use client';

import { createClient } from '@/lib/supabase/client';

export function OAuthLogin() {
  const supabase = createClient();

  const handleLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error(`Error logging in with ${provider}:`, error.message);
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <button onClick={() => handleLogin('google')}>
        Login with Google
      </button>
      <br />
      <button onClick={() => handleLogin('github')}>
        Login with GitHub
      </button>
    </div>
  );
}
