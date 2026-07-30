import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession, logAdminActivity, getClientIp } from '@/lib/adminAuth';

/**
 * PATCH /api/admin/arena/problems/[id]
 * Update a battle problem.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminSession(req, ['super_admin', 'arena_admin']);
  if ('error' in auth) return auth.error;

  const { id } = await params;

  try {
    const body = await req.json();
    const { title, description, difficulty, base_points, time_limit_sec, memory_limit_mb } = body as {
      title?: string;
      description?: string;
      difficulty?: string;
      base_points?: number;
      time_limit_sec?: number;
      memory_limit_mb?: number;
    };

    const existing = await prisma.battle_problems.findUnique({ where: { id }, select: { id: true, title: true } });
    if (!existing) return NextResponse.json({ error: 'Problem not found' }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (base_points !== undefined) updateData.base_points = base_points;
    if (time_limit_sec !== undefined) updateData.time_limit_sec = time_limit_sec;
    if (memory_limit_mb !== undefined) updateData.memory_limit_mb = memory_limit_mb;

    const updated = await prisma.battle_problems.update({
      where: { id },
      data: updateData,
    });

    await logAdminActivity({
      actorId: auth.user.userId,
      actorRole: auth.user.role,
      section: 'battle_arena',
      action: 'update_problem',
      targetTable: 'battle_problems',
      targetId: id,
      oldValue: { title: existing.title },
      newValue: updateData,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, problem: updated });
  } catch (err) {
    console.error('[admin/arena/problems/[id] PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/arena/problems/[id]
 * Delete a battle problem.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminSession(req, ['super_admin', 'arena_admin']);
  if ('error' in auth) return auth.error;

  const { id } = await params;

  try {
    const existing = await prisma.battle_problems.findUnique({ where: { id }, select: { id: true, title: true } });
    if (!existing) return NextResponse.json({ error: 'Problem not found' }, { status: 404 });

    await prisma.battle_problems.delete({ where: { id } });

    await logAdminActivity({
      actorId: auth.user.userId,
      actorRole: auth.user.role,
      section: 'battle_arena',
      action: 'delete_problem',
      targetTable: 'battle_problems',
      targetId: id,
      oldValue: { title: existing.title },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/arena/problems/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
