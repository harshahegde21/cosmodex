import { OAuthLogin } from '@/features/auth/components/OAuthLogin';
import { ManualLoginForm } from '@/features/auth/components/ManualLoginForm';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import localFont from 'next/font/local';

const hitchcut = localFont({ 
  src: '../../../../public/fonts/Hitchcut Font/Hitchcut-typeface/Hitchcut-Regular.ttf',
  variable: '--font-hitchcut'
});

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let dbUser = null;
  if (authUser) {
    dbUser = await prisma.users.findUnique({
      where: { id: authUser.id },
    });
  }

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-24 bg-[#080312] text-white ${hitchcut.variable}`}>
      <h1 
        className="text-5xl font-normal mb-8 text-center tracking-wide" 
        style={{ fontFamily: 'var(--font-hitchcut)' }}
      >
        Welcome to CosmoDex
      </h1>
      <div className="border border-white/10 bg-[#1A1525]/80 p-8 rounded-2xl shadow-sm backdrop-blur-md">
        {dbUser ? (
          <div className="text-center">
            <h2 className="text-2xl mb-4 text-green-600">Logged In!</h2>
            <p className="mb-2"><strong>Username:</strong> {dbUser.username}</p>
            <p className="mb-2"><strong>Email:</strong> {dbUser.email}</p>
            <div className="flex gap-4 justify-center mt-4 text-sm bg-gray-800 p-3 rounded">
              <span><strong>Role:</strong> {dbUser.role}</span>
              <span><strong>Level:</strong> {dbUser.level}</span>
              <span><strong>XP:</strong> {dbUser.xp_total}</span>
            </div>

            {/* Log out button */}
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ManualLoginForm />
            <div className="flex items-center w-full">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 font-medium">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className="flex flex-col items-center">
              <OAuthLogin />
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
