import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { buildSnapshot } from '../utils/snapshot';

const idSchema = z.string().min(1);
const transactionSchema = z.object({
  amount: z.number(),
  category: z.string().min(1),
  type: z.enum(['expense', 'income', 'savings']),
  note: z.string().optional(),
  date: z.coerce.date().optional()
});

const incomeSchema = z.object({
  source: z.string().min(1),
  amount: z.number(),
  date: z.coerce.date().optional(),
  note: z.string().optional()
});

const savingsSchema = z.object({
  amount: z.number(),
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.coerce.date().optional()
});

const diarySchema = z.object({
  title: z.string().optional(),
  body: z.string().min(1),
  emotion: z.string().optional(),
  date: z.coerce.date().optional()
});

const goalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number(),
  currentAmount: z.number().optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium')
});

const goalProgressSchema = z.object({ currentAmount: z.number() });

const budgetSchema = z.array(
  z.object({ id: z.string().optional(), name: z.string(), limit: z.number().nullable().optional(), icon: z.string().nullable().optional() })
);

export default function financeRouter(prisma: PrismaClient) {
  const router = Router();

  const userId = async () => {
    const user = await prisma.user.findFirst();
    if (!user) {
      throw new Error('User not found');
    }
    return user.id;
  };

  router.get('/transactions', async (_req, res) => {
    const uid = await userId();
    const tx = await prisma.transaction.findMany({ where: { userId: uid }, orderBy: { date: 'desc' } });
    res.json(tx);
  });

  router.post('/transactions', async (req, res) => {
    const parsed = transactionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const uid = await userId();
    const created = await prisma.transaction.create({ data: { ...parsed.data, userId: uid, date: parsed.data.date ?? new Date() } });
    res.json(created);
  });

  router.post('/income', async (req, res) => {
    const parsed = incomeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const uid = await userId();
    const created = await prisma.income.create({ data: { ...parsed.data, userId: uid, date: parsed.data.date ?? new Date() } });
    res.json(created);
  });

  router.post('/savings', async (req, res) => {
    const parsed = savingsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const uid = await userId();
    const created = await prisma.savingsTransfer.create({ data: { ...parsed.data, userId: uid, date: parsed.data.date ?? new Date() } });
    res.json(created);
  });

  router.get('/diary', async (_req, res) => {
    const uid = await userId();
    const entries = await prisma.diaryEntry.findMany({ where: { userId: uid }, orderBy: { date: 'desc' } });
    res.json(entries);
  });

  router.post('/diary', async (req, res) => {
    const parsed = diarySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const uid = await userId();
    const created = await prisma.diaryEntry.create({ data: { ...parsed.data, userId: uid, date: parsed.data.date ?? new Date() } });
    res.json(created);
  });

  router.post('/goals', async (req, res) => {
    const parsed = goalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const uid = await userId();
    const created = await prisma.goal.create({ data: { ...parsed.data, userId: uid, currentAmount: parsed.data.currentAmount ?? 0 } });
    res.json(created);
  });

  router.patch('/goals/:id/progress', async (req, res) => {
    const parsedId = idSchema.safeParse(req.params.id);
    const parsedBody = goalProgressSchema.safeParse(req.body);
    if (!parsedId.success || !parsedBody.success) return res.status(400).json({ error: 'Invalid request' });
    const updated = await prisma.goal.update({ where: { id: parsedId.data }, data: { currentAmount: parsedBody.data.currentAmount } });
    res.json(updated);
  });

  router.patch('/budget/categories', async (req, res) => {
    const parsed = budgetSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const uid = await userId();
    const results = await Promise.all(
      parsed.data.map((cat) => {
        if (cat.id) {
          return prisma.budgetCategory.upsert({
            where: { id: cat.id },
            create: { userId: uid, name: cat.name, limit: cat.limit ?? null, icon: cat.icon ?? null },
            update: { name: cat.name, limit: cat.limit ?? null, icon: cat.icon ?? null }
          });
        }

        return prisma.budgetCategory.create({
          data: { userId: uid, name: cat.name, limit: cat.limit ?? null, icon: cat.icon ?? null }
        });
      })
    );
    res.json(results);
  });

  router.get('/history', async (_req, res) => {
    const uid = await userId();
    const tx = await prisma.transaction.findMany({ where: { userId: uid }, orderBy: [{ date: 'desc' }, { createdAt: 'desc' }] });
    res.json(tx);
  });

  router.get('/snapshot', async (_req, res) => {
    try {
      const payload = await buildSnapshot(prisma);
      res.json(payload);
    } catch (error) {
      res.status(500).json({ error: 'Snapshot failed', details: (error as Error).message });
    }
  });

  return router;
}
