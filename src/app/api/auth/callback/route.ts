import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Sync user to our Prisma database
      const user = data.user;
      const email = user.email!;
      const username = user.user_metadata?.user_name || user.user_metadata?.full_name || email.split('@')[0];
      const provider = user.app_metadata?.provider || 'oauth';
      const avatarUrl = user.user_metadata?.avatar_url || null;

      try {
        await prisma.users.upsert({
          where: { email },
          update: {
            // Update auth provider if changed, or avatar
            auth_provider: provider,
            avatar_url: avatarUrl,
            last_login_at: new Date(),
          },
          create: {
            id: user.id, // we might need to map UUID, assuming Supabase user id is a valid UUID
            email,
            username,
            auth_provider: provider,
            avatar_url: avatarUrl,
            role: 'student',
            last_login_at: new Date(),
          },
        });
      } catch (dbError) {
        console.error('Error syncing user to database:', dbError);
        // We should probably redirect to an error page or handle it gracefully
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
