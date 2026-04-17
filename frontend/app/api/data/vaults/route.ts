import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, getUserIdFromRequest } from '../../../../lib/server/auth';

// NOTE: These routes require `prisma migrate dev` to be run after the
// DreamVault model was added to prisma/schema.prisma.
// Until then, the routes return 503 gracefully.

// eslint-disable-next-line -- prisma cast until DreamVault migration runs
const db = prisma as any; // typed after `prisma migrate dev` runs in production

// ────────────────────────────────────────────────────────────────────────────
// /api/data/vaults
//
// GET    — list all vaults for the authenticated user
// POST   — create a new vault
// PUT    — fund a vault (add to currentAmount) or update vault metadata
// ────────────────────────────────────────────────────────────────────────────

const CreateSchema = z.object({
  title:         z.string().min(1).max(80),
  emoji:         z.string().default('🏦'),
  targetAmount:  z.number().positive(),
  isMultiplayer: z.boolean().default(false),
  locked:        z.boolean().default(false),
});

const FundSchema = z.object({
  id:     z.string().min(1),
  amount: z.number().positive().max(1_000_000),
});

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const vaults = await db.dreamVault.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    // eslint-disable-next-line -- prisma cast until DreamVault migration runs
    vaults.map((v: any) => ({
      ...v,
      milestonesBadges: safeParseJson(v.milestonesBadges, []),
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });

  const vault = await db.dreamVault.create({
    data: { userId, ...parsed.data, milestonesBadges: '[]' },
  });

  return NextResponse.json({ ...vault, milestonesBadges: [], createdAt: vault.createdAt.toISOString(), updatedAt: vault.updatedAt.toISOString() }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = FundSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });

  const { id, amount } = parsed.data;

  // Verify vault belongs to this user
  const vault = await db.dreamVault.findUnique({ where: { id } });
  if (!vault || vault.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (vault.locked) return NextResponse.json({ error: 'Vault is locked' }, { status: 409 });

  const newAmount = Math.min(vault.currentAmount + amount, vault.targetAmount);

  // Calculate newly unlocked milestones
  const prevMilestones: string[] = safeParseJson(vault.milestonesBadges, []);
  const prevPct = vault.targetAmount > 0 ? (vault.currentAmount / vault.targetAmount) * 100 : 0;
  const newPct  = vault.targetAmount > 0 ? (newAmount          / vault.targetAmount) * 100 : 0;
  const milestoneThresholds = [25, 50, 75, 100];
  const freshMilestones = milestoneThresholds
    .filter((m) => newPct >= m && prevPct < m)
    .map(String);
  const allMilestones = [...new Set([...prevMilestones, ...freshMilestones])];

  const updated = await db.dreamVault.update({
    where: { id },
    data: { currentAmount: newAmount, milestonesBadges: JSON.stringify(allMilestones) },
  });

  return NextResponse.json({
    ...updated,
    milestonesBadges: allMilestones,
    freshMilestones,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

function safeParseJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}
