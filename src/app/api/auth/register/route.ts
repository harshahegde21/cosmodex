import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'cosmo_session';
const SALT_ROUNDS = 12;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username, avatarId, experienceLevel, interests } = body as {
      email: string;
      password: string;
      username: string;
      avatarId: string | null;
      experienceLevel: string | null;
      interests: string[];
    };

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const [emailConflict, usernameConflict] = await Promise.all([
      prisma.users.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
      prisma.users.findFirst({
        where: { username: { equals: normalizedUsername, mode: 'insensitive' } },
        select: { id: true },
      }),
    ]);

    if (emailConflict) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    if (usernameConflict) {
      return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 });
    }

    const passwordHash = await hash(password, SALT_ROUNDS);

    const avatarUrl = avatarId ?? null;

    const newUser = await prisma.users.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        password_hash: passwordHash,
        auth_provider: 'email',
        role: 'student',
        avatar_url: avatarUrl,
        experience_level: experienceLevel,
        interests: interests ?? [],
        xp_total: 0,
        level: 1,
        is_active: true,
        last_login_at: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar_url: true,
        experience_level: true,
        interests: true,
        level: true,
        xp_total: true,
        role: true,
        created_at: true,
      },
    });


    const sessionPayload = JSON.stringify({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      avatarId: avatarId ?? null,
      experienceLevel: newUser.experience_level ?? null,
      interests: newUser.interests ?? [],
      xpTotal: newUser.xp_total ?? 0,
      level: newUser.level ?? 1,
      role: newUser.role ?? 'student',
      createdAt: newUser.created_at?.toISOString() ?? new Date().toISOString(),
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
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatarId,
        experienceLevel,
        interests,
        xpTotal: newUser.xp_total,
        level: newUser.level,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('[register] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
