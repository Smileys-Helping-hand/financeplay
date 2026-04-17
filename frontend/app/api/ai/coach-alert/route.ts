import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';

// ────────────────────────────────────────────────────────────────────────────
// POST /api/ai/coach-alert
//
// Called by the client after loading transactions to see if the AI coach
// should fire a spending-velocity warning.
//
// Payload: { userId, spentSoFar, budget, daysElapsed, daysInMonth }
// Returns: { alert: boolean, message: string | null }
// ────────────────────────────────────────────────────────────────────────────

const BodySchema = z.object({
  spentSoFar:  z.number().min(0),
  budget:      z.number().positive(),
  daysElapsed: z.number().int().min(1),
  daysInMonth: z.number().int().min(28),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 422 });
  }

  const { spentSoFar, budget, daysElapsed, daysInMonth } = parsed.data;

  // Velocity: fraction of budget consumed relative to fraction of month elapsed
  const budgetFractionConsumed = spentSoFar / budget;
  const monthFractionElapsed   = daysElapsed / daysInMonth;
  // Velocity ratio: 1.0 = on-track, >1.4 = overspending fast
  const velocityRatio = monthFractionElapsed > 0 ? budgetFractionConsumed / monthFractionElapsed : 0;

  // Only fire alert at ≥ 40% budget consumed in the first third of the month
  const shouldAlert = budgetFractionConsumed >= 0.4 && daysElapsed <= Math.ceil(daysInMonth / 3);

  if (!shouldAlert) {
    return NextResponse.json({ alert: false, message: null });
  }

  // Use AI to craft a spicy personalised message
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 80,
      temperature: 0.9,
      messages: [
        {
          role: 'system',
          content:
            'You are a sarcastic but caring personal finance coach in a gamified finance app called FinancePlay. Write ONE short push-notification-style alert (max 25 words, street-smart tone, include the warning emoji ⚠️). The user has spent a large fraction of their monthly budget in the first few days.',
        },
        {
          role: 'user',
          content: `Spent ${Math.round(budgetFractionConsumed * 100)}% of R${budget} budget in just ${daysElapsed} days. Velocity ratio: ${velocityRatio.toFixed(1)}x.`,
        },
      ],
    });
    const message = chat.choices[0]?.message?.content?.trim() ?? null;
    return NextResponse.json({ alert: true, message });
  } catch {
    // Fallback message if OpenAI is unavailable
    const fallback = `⚠️ Whoa there, High Roller! You've burned ${Math.round(budgetFractionConsumed * 100)}% of your budget in ${daysElapsed} days. Slow down or you'll be eating 2-minute noodles by the 15th.`;
    return NextResponse.json({ alert: true, message: fallback });
  }
}
