import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/server/auth';

// ────────────────────────────────────────────────────────────────────────────
// POST /api/webhooks/expenses
//
// Receives an incoming expense payload from a trusted source (e.g. Gang Gear),
// deducts the amount from the current month's tracked Burn-Rate, and logs the
// transaction against the owning user.
//
// Security: caller must supply the shared secret in the Authorization header:
//   Authorization: Bearer <WEBHOOK_SECRET>
// ────────────────────────────────────────────────────────────────────────────

const PayloadSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  category: z.string().min(1).max(64),
  date: z.string().optional(), // ISO date string; defaults to today
});

function verifySecret(req: NextRequest): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return false; // secret must be configured
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  if (!verifySecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse & validate body ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { userId, amount, description, category, date } = parsed.data;

  // ── Verify user exists ────────────────────────────────────────────────────
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // ── Persist transaction ───────────────────────────────────────────────────
  const txDate = date ? new Date(date) : new Date();
  if (isNaN(txDate.getTime())) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 422 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      description,
      category,
      date: txDate,
    },
  });

  return NextResponse.json(
    {
      ok: true,
      transactionId: transaction.id,
      message: `Burn Rate deducted by R${amount} for "${description}"`,
    },
    { status: 201 }
  );
}
