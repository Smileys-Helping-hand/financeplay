import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserIdFromRequest } from '@/lib/server-utils';
import OpenAI from 'openai';
import { z } from 'zod';

const prisma = new PrismaClient();
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const schema = z.object({
  prompt: z.string().min(2),
  persona: z.enum(['friendly', 'strict', 'humorous']).default('friendly'),
  history: z.array(z.object({ role: z.enum(['assistant', 'user']), content: z.string() })).optional()
});

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ 
      reply: 'Please log in to use the AI coach!' 
    });
  }

  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.format() }, { status: 400 });
    }

    const { prompt, persona, history } = parsed.data;

    if (!openai) {
      return NextResponse.json({ 
        reply: "I'm not configured yet. Here's a quick tip: Track your daily expenses to build better spending habits! Earn XP by logging transactions regularly." 
      });
    }

    // Get user's financial data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: { take: 20, orderBy: { date: 'desc' } },
        goals: true,
        gamification: true
      }
    });

    if (!user) {
      return NextResponse.json({ 
        reply: 'User not found. Please log in again.' 
      });
    }

    // Build context
    const totalSpending = user.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalIncome = user.transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const context = `User: ${user.name}
Level: ${user.gamification?.level || 1}
Total Spending: R${totalSpending.toFixed(2)}
Total Income: R${totalIncome.toFixed(2)}
Goals: ${user.goals.length} active goals
Recent transactions: ${user.transactions.length}`;

    const personaPrompts = {
      friendly: 'You are a supportive and encouraging financial coach. Be warm, understanding, and motivating.',
      strict: 'You are a no-nonsense financial advisor who gives direct, disciplined advice. Be firm but fair.',
      humorous: 'You are a witty financial coach who uses humor to make finance fun. Be entertaining but informative.'
    };

    const messages: any[] = [
      {
        role: 'system',
        content: `${personaPrompts[persona]} Help students and young professionals manage money. Be concise (2-3 sentences max). Context:\n${context}`
      }
    ];

    if (history && history.length > 0) {
      messages.push(...history);
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 200,
      temperature: 0.8
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('AI Coach error:', error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting right now. Here's a quick tip: Review your spending categories to find areas where you can save!" 
    });
  }
}
}
