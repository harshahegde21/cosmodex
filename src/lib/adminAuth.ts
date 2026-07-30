import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const SESSION_COOKIE = 'cosmo_session';

export type AdminRole = 'super_admin' | 'learning_admin' | 'arena_admin';

export interface SessionUser {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export async function verifyAdminSession(
  req: NextRequest,
  allowedRoles: AdminRole[],
): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const sessionCookie = req.cookies.get(SESSION_COOKIE);

  if (!sessionCookie?.value) {
    return {
      error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
    };
  }

  let session: SessionUser;
  try {
    session = JSON.parse(sessionCookie.value) as SessionUser;
  } catch {
    return {
      error: NextResponse.json({ error: 'Invalid session' }, { status: 401 }),
    };
  }

  if (!session.userId || !session.role) {
    return {
      error: NextResponse.json({ error: 'Invalid session data' }, { status: 401 }),
    };
  }

  // Verify the user still exists in DB and has the claimed role (defense in depth)
  const dbUser = await prisma.users.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, is_active: true },
  });

  if (!dbUser || !dbUser.is_active) {
    return {
      error: NextResponse.json({ error: 'Account not found or suspended' }, { status: 403 }),
    };
  }

  const dbRole = dbUser.role ?? 'student';

  if (!allowedRoles.includes(dbRole as AdminRole)) {
    return {
      error: NextResponse.json(
        { error: `Forbidden: requires one of [${allowedRoles.join(', ')}]` },
        { status: 403 },
      ),
    };
  }

  return { user: { ...session, role: dbRole } };
}

/**
 * Logs an admin action to the admin_activity_log table.
 */
export async function logAdminActivity(params: {
  actorId: string;
  actorRole: string;
  section: string;
  action: string;
  targetTable?: string;
  targetId?: string;
  oldValue?: object | null;
  newValue?: object | null;
  ipAddress?: string;
}) {
  try {
    await prisma.admin_activity_log.create({
      data: {
        actor_id: params.actorId,
        actor_role: params.actorRole,
        section: params.section,
        action: params.action,
        target_table: params.targetTable ?? null,
        target_id: params.targetId ?? null,
        old_value_json: params.oldValue ?? undefined,
        new_value_json: params.newValue ?? undefined,
        ip_address: params.ipAddress ?? null,
      },
    });
  } catch (err) {
    // Non-blocking — log errors should never break the main action
    console.error('[logAdminActivity] Failed to write audit log:', err);
  }
}

/**
 * Extracts the client IP from the request headers.
 */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}
