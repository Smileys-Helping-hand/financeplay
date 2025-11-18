import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { z } from 'zod';
import { buildCoachPrompt } from '../utils/prompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export default function aiRouter(prisma: PrismaClient) {
  const router = Router();

  const bodySchema = z.object({
    prompt: z.string().min(2),
    persona: z.enum(['friendly', 'strict', 'humorous']).default('friendly'),
    history: z
      .array(z.object({ role: z.enum(['assistant', 'user']), content: z.string() }))
      .optional()
  });

  router.post('/coach', async (req, res) => {
    const parseResult = bodySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid coach payload', issues: parseResult.error.format() });
    }

    const { prompt, persona, history } = parseResult.data;
    const user = await prisma.user.findFirst({
      include: { transactions: true, goals: true, bursaries: true, gamification: true }
    });

    const baseReply = 'Consider moving R200 to your Emergency Fund and limit takeout to R300 this week for +120 XP.';

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: baseReply, source: 'mock' });
    }

    try {
      const completion = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: buildCoachPrompt(prompt, persona, history, user)
      });
      const message = completion.output_text || baseReply;
      res.json({ reply: message, source: 'openai' });
    } catch (err) {
      res.json({ reply: baseReply, source: 'fallback' });
    }
  });

  return router;
}
