import { Router } from 'express';
import { PrismaClient, Transaction as TxModel } from '@prisma/client';

type SnapshotCategoryTotals = Record<string, number>;
type SnapshotTransaction = Omit<TxModel, 'date' | 'createdAt'> & { date: string };
type SnapshotGoal = { id: string; name: string; targetAmount: number; currentAmount: number; deadline: string; priority: string };
type SnapshotPayload = {
  user: { id: string; email: string; name?: string | null };
  transactions: SnapshotTransaction[];
  goals: SnapshotGoal[];
  bursaries: { id: string; provider: string; monthlyAmount: number; nextPaymentDate: string; notes?: string | null }[];
  gamification: unknown;
  spendingTotals: { total: number; byCategory: SnapshotCategoryTotals };
  savingsTotal: number;
  categories: string[];
};

export default function dataRouter(prisma: PrismaClient) {
  const router = Router();

  router.get('/snapshot', async (_req, res) => {
    try {
      const user = await prisma.user.findFirst({
        include: { transactions: true, goals: true, bursaries: true, gamification: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User snapshot not found' });
      }

      const transactions: SnapshotTransaction[] = user.transactions.map((t) => ({
        id: t.id,
        userId: t.userId,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date.toISOString()
      }));

      const spendingTotals: SnapshotCategoryTotals = {};
      transactions.forEach((t) => {
        if (t.category === 'income' || t.category === 'savings') return;
        spendingTotals[t.category] = (spendingTotals[t.category] ?? 0) + Math.abs(t.amount);
      });

      const savingsTotal = transactions
        .filter((t) => t.category === 'savings')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const priorityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const withPriorityFallback: SnapshotGoal[] = user.goals
        .map((g) => ({
          id: g.id,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          deadline: g.deadline.toISOString(),
          priority: g.priority ?? 'medium'
        }))
        .sort((a, b) => (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0));

      const payload: SnapshotPayload = {
        user: { id: user.id, email: user.email, name: user.name },
        transactions,
        goals: withPriorityFallback,
        bursaries: user.bursaries.map((b) => ({
          id: b.id,
          provider: b.provider,
          monthlyAmount: b.monthlyAmount,
          nextPaymentDate: b.nextPaymentDate.toISOString(),
          notes: b.notes
        })),
        gamification: user.gamification ?? null,
        spendingTotals: { total: Object.values(spendingTotals).reduce((sum, val) => sum + val, 0), byCategory: spendingTotals },
        savingsTotal,
        categories: Object.keys(spendingTotals)
      };

      res.json(payload);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load snapshot' });
    }
  });

  return router;
}
