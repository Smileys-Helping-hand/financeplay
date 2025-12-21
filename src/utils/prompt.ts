type TransactionLike = { amount: number; date: Date; category: string; description: string };
type GoalLike = { name: string; currentAmount: number; targetAmount: number };
type BursaryLike = { provider: string; nextPaymentDate: Date };
type GamificationLike = { xp?: number; streak?: number; level?: number; badges?: string | string[] };
type UserSnapshot = {
  id: string;
  email: string;
  name?: string | null;
  transactions?: TransactionLike[];
  goals?: GoalLike[];
  bursaries?: BursaryLike[];
  gamification?: GamificationLike | null;
};

export function buildCoachPrompt(
  userPrompt: string,
  persona: 'friendly' | 'strict' | 'humorous',
  history?: { role: 'assistant' | 'user'; content: string }[],
  user?: UserSnapshot
) {
  const goals = user?.goals?.map((g) => `${g.name}: ${g.currentAmount}/${g.targetAmount}`) ?? [];
  const bursaries =
    user?.bursaries?.map((b) => `${b.provider} next on ${b.nextPaymentDate.toISOString().slice(0, 10)}`) ?? [];
  const xp = user?.gamification?.xp ?? 0;
  const personaVoice =
    persona === 'strict'
      ? 'be concise and directive'
      : persona === 'humorous'
        ? 'be playful but precise'
        : 'be encouraging and supportive';
  const context = history && history.length > 0 ? history.map((h) => `${h.role}: ${h.content}`).join('\n') : 'none yet';
  return `You are FinancePlay, a South African student finance coach. Persona: ${personaVoice}. Context: ${context}. User prompt: ${userPrompt}. Goals: ${goals.join(', ')}. Allowances: ${bursaries.join(', ')}. XP: ${xp}. Give 1 short tip, 1 actionable challenge, and a reward message like "+40XP earned" when applicable.`;
}
