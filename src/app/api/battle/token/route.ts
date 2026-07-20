import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE = 'cosmo_session';
const JWT_SECRET = process.env.JWT_SECRET || 'cosmodex-dev-secret-change-in-prod';

/**
 * GET /api/battle/token
 *
 * Reads the cosmo_session cookie and issues a short-lived JWT
 * that the battle-arena-backend can verify. This bridges the
 * cookie-based session of cosmodex-main with the JWT-based auth
 * of the battle-arena WebSocket server.
 */
export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let session: { userId: string; username: string; role?: string };
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  if (!session.userId || !session.username) {
    return NextResponse.json({ error: 'Incomplete session data' }, { status: 401 });
  }

  // Issue a JWT valid for 2 hours (enough for a full match session)
  const token = jwt.sign(
    {
      userId: session.userId,
      username: session.username,
      role: session.role ?? 'student',
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  return NextResponse.json({ token, userId: session.userId, username: session.username });
}
