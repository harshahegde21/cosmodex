import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'cosmo_session';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ pending: null });
    }

    const email = session.user.email.trim().toLowerCase();
    const provider = (session.user as { provider?: string }).provider === 'github' ? 'GitHub' : 'Google';

    // Check if user already exists — only fetch fields needed for session building
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        auth_provider: true,
        avatar_url: true,
        experience_level: true,
        interests: true,
        xp_total: true,
        level: true,
        role: true,
        created_at: true,
      },
    });

    if (user) {
      // Ensure the provider matches to prevent direct login when email is registered with another method
      if (user.auth_provider?.toLowerCase() !== provider.toLowerCase()) {
        const response = NextResponse.json({ pending: null });
        const authCookies = [
          'authjs.session-token',
          '__Secure-authjs.session-token',
          'next-auth.session-token',
          '__Secure-next-auth.session-token',
        ];
        for (const cookieName of authCookies) {
          response.cookies.set(cookieName, '', { maxAge: 0, path: '/' });
        }
        return response;
      }

      void prisma.users.update({
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

      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }

    return NextResponse.json({
      exists: false,
      pending: {
        email,
        authMethod: provider,
      },
    });
  } catch (err) {
    console.error('[oauth-pending] Error:', err);
    return NextResponse.json({ pending: null });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  const authCookies = [
    'authjs.session-token',
    '__Secure-authjs.session-token',
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'authjs.callback-url',
    '__Secure-authjs.callback-url',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
    'authjs.csrf-token',
    '__Secure-authjs.csrf-token',
    'next-auth.csrf-token',
    '__Secure-next-auth.csrf-token',
  ];

  for (const cookieName of authCookies) {
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
  }

  return response;
}
