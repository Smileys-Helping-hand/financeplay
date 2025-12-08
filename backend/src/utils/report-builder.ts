type TransactionLike = { amount: number; date: Date; category: string; description: string };
type GoalLike = { name: string; currentAmount: number; targetAmount: number; priority?: 'low' | 'medium' | 'high' | string };
type BursaryLike = { provider: string; nextPaymentDate: Date };
type GamificationLike = { xp?: number; streak?: number; level?: number; badges?: string | string[] };
export type UserSnapshot = {
  id: string;
  email: string;
  name?: string | null;
  transactions?: TransactionLike[];
  goals?: GoalLike[];
  bursaries?: BursaryLike[];
  gamification?: GamificationLike | null;
};

export function buildWeeklySummary(user?: UserSnapshot) {
  const spend =
    user?.transactions
      ?.filter((t) => t.category !== 'income' && t.category !== 'savings')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0;
  const savings =
    user?.transactions?.filter((t) => t.category === 'savings').reduce((sum, t) => sum + Math.abs(t.amount), 0) ?? 0;
  const priorityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const priorityValue = (priority?: GoalLike['priority']) => priorityRank[priority ?? 'medium'] ?? 0;
  const topGoal = user?.goals?.slice().sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority))[0];

  return {
    title: `You spent R${spend.toFixed(0)} and saved R${savings.toFixed(0)} this week.`,
    sections: [
      {
        heading: 'Highlights',
        points: [
          `Top goal: ${topGoal?.name ?? 'Emergency Fund'} progress ${topGoal?.currentAmount ?? 0}/${topGoal?.targetAmount ?? 0}`,
          `Streak: ${user?.gamification?.streak ?? 0} days, XP ${user?.gamification?.xp ?? 0}`
        ]
      },
      {
        heading: 'AI Challenges',
        points: [
          'Cook two meals at home to drop food spend by 10%',
          'Move R200 to savings to reach the next XP level'
        ]
      },
      {
        heading: 'Allowances',
        points: user?.bursaries?.map((b) => `${b.provider} next on ${b.nextPaymentDate.toISOString().slice(0, 10)}`) ?? [
          'NSFAS payment scheduled for the 15th'
        ]
      }
    ]
  };
}
