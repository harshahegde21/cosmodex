import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const SESSION_COOKIE = 'cosmo_session';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let userId: string;
    try {
      const session = JSON.parse(sessionCookie.value);
      userId = session.userId;
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar_url: true,
        experience_level: true,
        interests: true,
        xp_total: true,
        level: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('[user/profile GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let sessionData: Record<string, unknown>;
    let userId: string;
    try {
      sessionData = JSON.parse(sessionCookie.value);
      userId = sessionData.userId as string;
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await req.json();
    const { username, interests } = body as {
      username?: string;
      interests?: string[];
    };

    // Build update payload (only update fields that are provided)
    const updateData: Record<string, unknown> = {};
    if (username !== undefined) updateData.username = username.trim();
    if (interests !== undefined) updateData.interests = interests;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Check username uniqueness if changing
    if (username && username.trim() !== sessionData.username) {
      const conflict = await prisma.users.findFirst({
        where: { username: { equals: username.trim(), mode: 'insensitive' }, NOT: { id: userId } },
        select: { id: true },
      });
      if (conflict) {
        return NextResponse.json({ error: 'This username is already taken.' }, { status: 409 });
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatar_url: true,
        experience_level: true,
        interests: true,
        xp_total: true,
        level: true,
        created_at: true,
      },
    });

    // Refresh session cookie with updated values
    const newSession = JSON.stringify({
      ...sessionData,
      username: updatedUser.username,
      interests: updatedUser.interests,
    });

    cookieStore.set(SESSION_COOKIE, newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('[user/profile PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
