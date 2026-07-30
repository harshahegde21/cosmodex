import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession, logAdminActivity, getClientIp } from '@/lib/adminAuth';

const PAGE_SIZE = 20;

/**
 * GET /api/admin/arena/problems
 * Returns a paginated list of battle problems.
 */
export async function GET(req: NextRequest) {
  const auth = await verifyAdminSession(req, ['super_admin', 'arena_admin']);
  if ('error' in auth) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const search = searchParams.get('search')?.trim() ?? '';
  const difficulty = searchParams.get('difficulty')?.trim() ?? '';

  const where: NonNullable<Parameters<typeof prisma.battle_problems.findMany>[0]>['where'] = {};
  if (search) where.title = { contains: search, mode: 'insensitive' };
  if (difficulty) where.difficulty = difficulty;

  try {
    const [problems, total] = await Promise.all([
      prisma.battle_problems.findMany({
        where,
        include: {
          test_cases: { select: { id: true, is_public: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.battle_problems.count({ where }),
    ]);

    const problemsWithCounts = problems.map((p) => ({
      ...p,
      publicTestCases: p.test_cases.filter((t) => t.is_public).length,
      hiddenTestCases: p.test_cases.filter((t) => !t.is_public).length,
      totalTestCases: p.test_cases.length,
      test_cases: undefined,
    }));

    return NextResponse.json({ problems: problemsWithCounts, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) });
  } catch (err) {
    console.error('[admin/arena/problems GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/arena/problems
 * Create a new battle problem with test cases.
 */
export async function POST(req: NextRequest) {
  const auth = await verifyAdminSession(req, ['super_admin', 'arena_admin']);
  if ('error' in auth) return auth.error;

  try {
    const body = await req.json();
    const { title, description, difficulty, base_points, time_limit_sec, memory_limit_mb, test_cases } = body as {
      title?: string;
      description?: string;
      difficulty?: string;
      base_points?: number;
      time_limit_sec?: number;
      memory_limit_mb?: number;
      test_cases?: Array<{ input: string; expected: string; is_public: boolean }>;
    };

    if (!title || !description || !difficulty || !base_points) {
      return NextResponse.json({ error: 'title, description, difficulty, and base_points are required.' }, { status: 400 });
    }

    const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ error: 'difficulty must be easy, medium, or hard' }, { status: 400 });
    }

    const problem = await prisma.battle_problems.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        base_points,
        time_limit_sec: time_limit_sec ?? 2,
        memory_limit_mb: memory_limit_mb ?? 128,
        test_cases: test_cases && test_cases.length > 0
          ? { create: test_cases.map((tc) => ({ input: tc.input, expected: tc.expected, is_public: tc.is_public })) }
          : undefined,
      },
      include: { test_cases: true },
    });

    await logAdminActivity({
      actorId: auth.user.userId,
      actorRole: auth.user.role,
      section: 'battle_arena',
      action: 'create_problem',
      targetTable: 'battle_problems',
      targetId: problem.id,
      newValue: { title: problem.title, difficulty: problem.difficulty },
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, problem });
  } catch (err) {
    console.error('[admin/arena/problems POST] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
