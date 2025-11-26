import { SnapshotPayload } from './snapshot';

type ChatHistory = { role: 'assistant' | 'user'; content: string }[];

type BuildPromptParams = {
  userPrompt: string;
  persona: 'friendly' | 'strict' | 'humorous';
  history?: ChatHistory;
  snapshot?: SnapshotPayload;
};

const personaTone: Record<BuildPromptParams['persona'], string> = {
  friendly: 'encouraging, supportive, positive energy',
  strict: 'disciplined, direct, focused on accountability',
  humorous: 'light-hearted, witty, but financially intelligent'
};

function renderHistory(history?: ChatHistory) {
  if (!history || history.length === 0) return 'none';
  return history.map((h) => `${h.role}: ${h.content}`).join('\n');
}

function buildOverspendReport(snapshot?: SnapshotPayload) {
  if (!snapshot) return 'unknown';
  const { categories, budgetCategories } = snapshot;
  const limits = Object.fromEntries(budgetCategories.map((b) => [b.name.toLowerCase(), b.limit ?? 0]));
  const overspent = Object.entries(categories)
    .filter(([category, amount]) => {
      const limit = limits[category.toLowerCase()];
      return limit && amount >= limit * 0.8;
    })
    .map(([category, amount]) => {
      const limit = limits[category.toLowerCase()] ?? 0;
      return `${category}: ${amount.toFixed(2)} / ${limit.toFixed(2)}`;
    });
  return overspent.length ? overspent.join('; ') : 'no overspending detected';
}

function buildGoalReport(snapshot?: SnapshotPayload) {
  if (!snapshot) return 'none';
  return snapshot.goals
    .map((g) => `${g.name} (${g.priority ?? 'medium'}): ${g.currentAmount}/${g.targetAmount}`)
    .join('; ');
}

function buildDiaryReport(snapshot?: SnapshotPayload) {
  if (!snapshot || snapshot.diary.length === 0) return 'no diary entries';
  return snapshot.diary
    .slice(0, 5)
    .map((d) => `${d.date.toISOString?.() ?? d.date}: emotion=${d.emotion ?? 'neutral'} note=${d.body.slice(0, 120)}`)
    .join('; ');
}

function buildTrend(snapshot?: SnapshotPayload) {
  if (!snapshot) return 'no transactions';
  const last7 = snapshot.transactions
    .filter((t) => {
      const date = new Date(t.date);
      const diff = Date.now() - date.getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    })
    .filter((t) => t.type === 'expense');
  const total = last7.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return `last7day_spend=${total.toFixed(2)} across ${last7.length} tx`;
}

function buildPredictiveHint(snapshot?: SnapshotPayload) {
  if (!snapshot) return 'insufficient data';
  const avg = snapshot.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t, _, arr) => sum + Math.abs(t.amount) / Math.max(arr.length, 1), 0);
  return `expected_next_7d_spend ~= ${(avg * 7).toFixed(2)} based on average daily spend.`;
}

export function buildCoachPrompt({ userPrompt, persona, history, snapshot }: BuildPromptParams) {
  const historyBlock = renderHistory(history);
  const overspend = buildOverspendReport(snapshot);
  const goals = buildGoalReport(snapshot);
  const diary = buildDiaryReport(snapshot);
  const trend = buildTrend(snapshot);
  const forecast = buildPredictiveHint(snapshot);
  const incomes = snapshot?.incomes.map((i) => `${i.source}: ${i.amount}`).join('; ') ?? 'none';
  const savings = snapshot?.savings.map((s) => `${s.amount} from ${s.from ?? 'account'} to ${s.to ?? 'savings'}`).join('; ') ?? 'none';
  const bursaries = snapshot?.bursaries.map((b) => `${b.provider} next ${b.nextPaymentDate.toISOString?.() ?? b.nextPaymentDate}`).join('; ') ?? 'none';
  const level = snapshot?.gamification.level ?? 1;
  const xp = snapshot?.gamification.xp ?? 0;
  const streak = snapshot?.gamification.streak ?? 0;
  const totals = snapshot?.totals ?? { spending: 0, income: 0, savings: 0 };

  return `You are FinancePlay, an AI financial coach built to help the user improve their financial habits, understand their spending patterns, stay motivated, and achieve their goals.
Persona tone: ${personaTone[persona]}.

You ALWAYS personalize your responses to the user using the real data provided. DO NOT fabricate data.

USER SNAPSHOT
- totals: spending=${totals.spending}, income=${totals.income}, savings=${totals.savings}
- categories: ${JSON.stringify(snapshot?.categories ?? {})}
- overspent categories: ${overspend}
- goals: ${goals}
- diary: ${diary}
- bursaries/allowances: ${bursaries}
- incomes: ${incomes}
- savings transfers: ${savings}
- weekly trend: ${trend}
- forecast: ${forecast}
- gamification: level=${level}, xp=${xp}, streak=${streak}, badges=${snapshot?.gamification.badges.join(', ') ?? ''}

If any section is empty, ignore it—never invent information.

HISTORY:
${historyBlock}

USER_PROMPT:
${userPrompt}

COACHING BEHAVIORS
1. Identify overspending (>80% envelope, >100% give a 3-step correction plan).
2. Emotional spending: use diary emotions and spending spikes.
3. Goal reinforcement: highlight top-priority goals and acceleration tips.
4. Day-by-day spending pattern: detect spikes and suggest alternatives.
5. Weekly predictions: flag categories likely to exceed limits.
6. Income + bursary awareness: warn if payday/allowance is far; suggest savings after income.
7. Gamification: award XP for savings, low-spend days, challenges, journaling; respect persona tone.
8. Budget optimization: suggest envelope tweaks and missing categories.

RESPONSE STRUCTURE (always follow):
1. 🎯 Insight headline
2. 📊 Personalized Analysis (use snapshot data directly)
3. 💡 Actionable Suggestions (2–4 tips)
4. 🎮 Gamified Motivation (XP, streaks, challenges)
5. 🙌 Persona Tone (friendly/strict/humorous)
`;
}
