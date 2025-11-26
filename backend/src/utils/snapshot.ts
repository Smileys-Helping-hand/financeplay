import { PrismaClient, BudgetCategory, Bursary, DiaryEntry, Gamification, Goal, Income, SavingsTransfer, Transaction } from '@prisma/client';

export type SnapshotTotals = { spending: number; income: number; savings: number };
export type SnapshotPayload = {
  user: { id: string; email: string; name?: string | null };
  totals: SnapshotTotals;
  categories: Record<string, number>;
  transactions: Transaction[];
  incomes: Income[];
  savings: SavingsTransfer[];
  goals: Goal[];
  budgetCategories: BudgetCategory[];
  bursaries: Bursary[];
  diary: DiaryEntry[];
  gamification: Gamification;
};

const defaultGamification: Gamification = {
  userId: '',
  level: 1,
  xp: 0,
  streak: 0,
  badges: [],
  dailyChallenge: 'Complete a no-spend day',
  persona: 'friendly'
};

const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

export async function buildSnapshot(prisma: PrismaClient): Promise<SnapshotPayload> {
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error('User not found');
  }

  const [transactions, incomes, savings, goals, budgetCategories, bursaries, diaryEntries, gamification] = await Promise.all([
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' } }),
    prisma.income.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' } }),
    prisma.savingsTransfer.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' } }),
    prisma.goal.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'asc' } }),
    prisma.budgetCategory.findMany({ where: { userId: user.id } }),
    prisma.bursary.findMany({ where: { userId: user.id }, orderBy: { nextPaymentDate: 'asc' } }),
    prisma.diaryEntry.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' } }),
    prisma.gamification.findUnique({ where: { userId: user.id } })
  ]);

  const expenses = transactions.filter((t) => t.type === 'expense');
  const spendTotal = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const incomeTotal =
    incomes.reduce((sum, inc) => sum + inc.amount, 0) + transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const savingsTotal =
    savings.reduce((sum, s) => sum + s.amount, 0) + transactions.filter((t) => t.type === 'savings').reduce((s, t) => s + Math.abs(t.amount), 0);

  const categories = expenses.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] ?? 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  const sortedGoals: Goal[] = goals
    .map((g) => ({ ...g, priority: g.priority ?? 'medium' }))
    .sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1));

  return {
    user: { id: user.id, email: user.email, name: user.name },
    totals: {
      spending: spendTotal,
      income: incomeTotal,
      savings: savingsTotal
    },
    categories,
    transactions,
    incomes,
    savings,
    goals: sortedGoals,
    budgetCategories,
    bursaries,
    diary: diaryEntries,
    gamification: gamification ?? { ...defaultGamification, userId: user.id }
  };
}
