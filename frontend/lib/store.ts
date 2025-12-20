import { create } from 'zustand';
import { Bursary, FinancialHealth, Gamification, Goal, Insight, Transaction } from './types';
import { getUserId } from './api';

interface FinanceState {
  user: { id: string; email: string; name?: string | null };
  transactions: Transaction[];
  goals: Goal[];
  bursaries: Bursary[];
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
  toggleTheme: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  user: { id: '', email: '', name: null },
  transactions: [],
  goals: [],
  bursaries: [],
  gamification: {
    userId: '',
    level: 1,
    xp: 0,
    xpToNext: 100,
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
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  registerXpGain: (xp) =>
    set((state) => {
      const updatedXp = state.gamification.xp + xp;
      return {
        gamification: {
          ...state.gamification,
          xp: updatedXp,
          lastXpGain: xp,
          level: levelFromXp(updatedXp)
        }
      };
    }),
  setPersona: (persona) => set((state) => ({ gamification: { ...state.gamification, persona } })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
}));

export const generateXpGain = (amount: number) => {
  if (amount <= 0) return 0;
  if (amount >= 1000) return 200;
  if (amount >= 500) return 120;
  return 60;
};

export const levelFromXp = (xp: number) => Math.floor(xp / 500) + 1;

// User ID from localStorage
export const getUserIdFromStore = () => getUserId() || '';
