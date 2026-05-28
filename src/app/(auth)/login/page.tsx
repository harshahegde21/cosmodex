import { OAuthLogin } from '@/features/auth/components/OAuthLogin';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to CosmoDex
      </h1>
      <div className="border border-gray-300 p-8 rounded-lg shadow-sm">
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
          <OAuthLogin />
        )}
      </div>
    </main>
  );
}
