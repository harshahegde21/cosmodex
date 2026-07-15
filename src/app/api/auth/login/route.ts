import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'cosmo_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.users.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        username: true,
        email: true,
        password_hash: true,
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

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.password_hash) {
      return NextResponse.json({ error: 'This account was registered using another sign-in method.' }, { status: 400 });
    }

    const passwordMatch = await compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Update last_login_at timestamp
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    // Set user session cookie matching the registration format
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarId: user.avatar_url ?? null,
        xpTotal: user.xp_total,
        level: user.level,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[login] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
