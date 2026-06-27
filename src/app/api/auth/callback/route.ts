import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'cosmo_session';

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const mode = searchParams.get('mode') ?? 'login';

    if (!code) {
      return NextResponse.redirect(`${origin}/onboarding?mode=login&error=No authorization code provided.`);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/onboarding?mode=login&error=${encodeURIComponent(error.message)}`);
    }

    const supabaseUser = data.user;
    if (!supabaseUser || !supabaseUser.email) {
      return NextResponse.redirect(`${origin}/onboarding?mode=login&error=Failed to retrieve user from provider.`);
    }

    // Check if the user already exists in the Prisma database
    const user = await prisma.users.findUnique({
      where: { email: supabaseUser.email.trim().toLowerCase() },
    });

    if (user) {
      if (mode === 'signup') {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/onboarding?mode=login&error=${encodeURIComponent('An account with this email already exists. Please log in.')}`);
      }

      // Existing user: create session and redirect to dashboard
      await prisma.users.update({
        where: { id: user.id },
        data: { last_login_at: new Date() },
      });

      const sessionPayload = JSON.stringify({
        userId: user.id,
        username: user.username,
        email: user.email,
        avatarId: user.avatar_url ?? null,
        experienceLevel: user.experience_level ?? null,
        interests: user.interests ?? [],
        xpTotal: user.xp_total ?? 0,
        level: user.level ?? 1,
        role: user.role ?? 'student',
        createdAt: user.created_at?.toISOString() ?? new Date().toISOString(),
      });

      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, sessionPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return NextResponse.redirect(`${origin}${next}`);
    } else {
      // New user: redirect to onboarding to complete profile
      // The client-side OnboardingFlow will detect the Supabase session and start at the USERNAME step
      return NextResponse.redirect(`${origin}/onboarding`);
    }
  } catch (err) {
    console.error('[auth-callback] Error:', err);
    return NextResponse.redirect(`${new URL(req.url).origin}/onboarding?mode=login&error=Internal server error.`);
  }
}
