import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const SESSION_COOKIE = 'cosmo_session';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function GET(req: NextRequest) {
  let userId: string | null = null;
  let username: string | null = null;
  let role: string = 'student';

  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (sessionCookie?.value) {
    try {
      const parsed = JSON.parse(sessionCookie.value);
      if (parsed.userId && parsed.username) {
        userId = parsed.userId;
        username = parsed.username;
        role = parsed.role ?? 'student';
      }
    } catch {
      // Fall through to NextAuth check below
    }
  }

  if (!userId || !username) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const dbUser = await prisma.users.findUnique({
        where: { email: session.user.email.trim().toLowerCase() },
        select: { id: true, username: true, role: true },
      });
      if (dbUser) {
        userId = dbUser.id;
        username = dbUser.username;
        role = dbUser.role ?? 'student';
      }
    }
  }

  if (!userId || !username) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const token = jwt.sign(
    { userId, username, role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return NextResponse.json({ token, userId, username });
}
