import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminAuth';

const PAGE_SIZE = 30;

/**
 * GET /api/admin/super/logs
 * Returns paginated audit log entries.
 * Query params: page, section, action, actorId
 */
export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, ['super_admin']);
  if ('error' in auth) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const section = searchParams.get('section')?.trim() ?? '';
  const action = searchParams.get('action')?.trim() ?? '';
  const actorId = searchParams.get('actorId')?.trim() ?? '';

  const where: NonNullable<Parameters<typeof prisma.admin_activity_log.findMany>[0]>['where'] = {};
  if (section) where.section = section;
  if (action) where.action = { contains: action, mode: 'insensitive' };
  if (actorId) where.actor_id = actorId;

  try {
    const [logs, total] = await Promise.all([
      prisma.admin_activity_log.findMany({
        where,
        include: {
          users: { select: { username: true, email: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.admin_activity_log.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (err) {
    console.error('[admin/super/logs GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
