import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  prompt: z.string().min(2),
  persona: z.enum(['friendly', 'strict', 'humorous']).default('friendly'),
  history: z.array(z.object({ role: z.enum(['assistant', 'user']), content: z.string() })).optional()
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.format() }, { status: 400 });
  }

  const { prompt, persona, history } = parsed.data;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/ai/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, persona, history })
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ reply: 'Here is a quick win: move R200 to your Emergency Fund to earn +120 XP and stay on streak.' });
  }
}
