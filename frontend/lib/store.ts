import { create } from 'zustand';
import { Bursary, Budget, FinancialHealth, Gamification, Goal, Insight, Loan, Transaction } from './types';
import { getUserId, persistXpGain } from './api';
import { MONTHLY_BUDGET, XP_PER_LEVEL } from './config';

interface FinanceState {
  user: { id: string; email: string; name?: string | null };
  transactions: Transaction[];
  goals: Goal[];
  bursaries: Bursary[];
  loans: Loan[];
  budgets: Budget[];
  gamification: Gamification;
  insights: Insight[];
  health: FinancialHealth;
  theme: 'light' | 'dark';
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  addTransaction: (tx: Transaction) => void;
  registerXpGain: (xp: number) => void;
  setPersona: (persona: Gamification['persona']) => void;
  setUser: (user: { id: string; email: string; name?: string | null }) => void;
  toggleTheme: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  user: { id: '', email: '', name: null },
  transactions: [],
  goals: [],
  bursaries: [],
  loans: [],
  budgets: [],
  gamification: {
    userId: '',
    level: 1,
    xp: 0,
    xpToNext: XP_PER_LEVEL, // correct: 500 XP to level 2
    streak: 0,
    persona: 'friendly',
    dailyChallenge: 'Add your first transaction',
    badges: []
  },
  insights: [],
  health: {
    score: 0,
    category: 'poor',
    summary: 'Start adding transactions to see your financial health'
  },
  theme: 'dark',
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (goal) =>
    set((state) => ({ goals: state.goals.map((g) => (g.id === goal.id ? { ...g, ...goal } : g)) })),
  removeGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
  addTransaction: (tx) =>
    set((state) => {
      const skip = new Set(['income', 'allowance', 'savings']);
      // Update streak: bump if today's date not already in transactions
      const today = new Date().toISOString().slice(0, 10);
      const alreadyLoggedToday = state.transactions.some(
        (t) => !skip.has(t.category) && t.date.slice(0, 10) === today
      );
      const streak = !skip.has(tx.category) && !alreadyLoggedToday
        ? state.gamification.streak + 1
        : state.gamification.streak;
      return {
        transactions: [tx, ...state.transactions],
        gamification: { ...state.gamification, streak },
      };
    }),
  registerXpGain: (xp) => {
    set((state) => {
      const updatedXp = state.gamification.xp + xp;
      const newLevel = levelFromXp(updatedXp);
      // xpToNext = XP needed to reach the threshold of the NEXT level
      const nextLevelThreshold = newLevel * XP_PER_LEVEL;
      const newState = {
        gamification: {
          ...state.gamification,
          xp: updatedXp,
          lastXpGain: xp,
          level: newLevel,
          xpToNext: nextLevelThreshold - updatedXp,
        }
      };
      persistXpGain({ xp: updatedXp, level: newLevel }).catch(() => {});
      return newState;
    });
  },
  setPersona: (persona) => set((state) => ({ gamification: { ...state.gamification, persona } })),
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
}));

export const generateXpGain = (amount: number) => {
  if (amount <= 0) return 0;
  if (amount >= 1000) return 200;
  if (amount >= 500) return 120;
  return 60;
};

export const levelFromXp = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

// ── Shared spend calculation ──────────────────────────────────────────────
const SKIP_CATEGORIES = new Set(['income', 'allowance', 'savings']);

export function getMonthlySpent(transactions: Transaction[]): number {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return transactions
    .filter((t) => t.date.startsWith(ym) && !SKIP_CATEGORIES.has(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getBurnRateRemaining(transactions: Transaction[]): number {
  return Math.max(0, MONTHLY_BUDGET - getMonthlySpent(transactions));
}

// ── Canonical XP award amounts ────────────────────────────────────────────
export const XP_AWARDS = {
  LOG_EXPENSE:        50,   // +50  XP — user logs any expense
  SAVINGS_MILESTONE:  200,  // +200 XP — vault hits a 25/50/75/100% milestone
  MONTH_UNDER_BUDGET: 500,  // +500 XP — user ends the month under their Burn Rate
} as const;

// ── Player level title based on XP ───────────────────────────────────────
export function getPlayerTitle(level: number): string {
  if (level >= 20) return 'Legendary Treasurer';
  if (level >= 15) return 'Diamond Saver';
  if (level >= 10) return 'Gold Strategist';
  if (level >= 7)  return 'Silver Tactician';
  if (level >= 5)  return 'Bronze Hustler';
  if (level >= 3)  return 'Iron Apprentice';
  return 'Rookie Explorer';
}

// User ID from localStorage
export const getUserIdFromStore = () => getUserId() || '';
