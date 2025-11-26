import { SnapshotPayload } from './snapshot';

export function buildWeeklySummary(snapshot: SnapshotPayload) {
  const spend = snapshot.totals.spending;
  const savings = snapshot.totals.savings;
  const priorityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const priorityValue = (priority?: string) => priorityRank[priority ?? 'medium'] ?? 0;
  const topGoal = snapshot.goals.slice().sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority))[0];
  const overspendCategories = Object.entries(snapshot.categories)
    .map(([name, value]) => {
      const envelope = snapshot.budgetCategories.find((b) => b.name.toLowerCase() === name.toLowerCase());
      return { name, value, limit: envelope?.limit ?? 0 };
    })
    .filter((c) => c.limit && c.value > c.limit * 0.8)
    .map((c) => `${c.name}: ${c.value.toFixed(0)} / ${c.limit?.toFixed(0)}`);

  const diaryNotes = snapshot.diary.slice(0, 3).map((d) => `${d.emotion ?? 'neutral'}: ${d.body.slice(0, 80)}`);
  const allowancePoints =
    snapshot.bursaries.length > 0
      ? snapshot.bursaries.map((b) => `${b.provider} next on ${b.nextPaymentDate.toISOString?.().slice(0, 10) ?? b.nextPaymentDate}`)
      : ['NSFAS payment scheduled'];

  return {
    title: `You spent R${spend.toFixed(0)} and saved R${savings.toFixed(0)} this week.`,
    sections: [
      {
        heading: 'Highlights',
        points: [
          `Top goal: ${topGoal?.name ?? 'Emergency Fund'} progress ${topGoal?.currentAmount ?? 0}/${topGoal?.targetAmount ?? 0}`,
          `Streak: ${snapshot.gamification.streak} days, XP ${snapshot.gamification.xp}`
        ]
      },
      {
        heading: 'Overspending flags',
        points: overspendCategories.length ? overspendCategories : ['No overspending detected']
      },
      {
        heading: 'AI Challenges',
        points: [
          'Cook two meals at home to drop food spend by 10%',
          'Move R200 to savings to reach the next XP level'
        ]
      },
      {
        heading: 'Diary & Mood',
        points: diaryNotes.length ? diaryNotes : ['No diary entries captured']
      },
      {
        heading: 'Allowances',
        points: allowancePoints
      }
    ]
  };
}
