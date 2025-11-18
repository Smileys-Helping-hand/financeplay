import { create } from 'zustand';
import { Bursary, FinancialHealth, Gamification, Goal, Insight, Transaction } from './types';
import { mockBursaries, mockGamification, mockGoals, mockHealth, mockInsights, mockTransactions, mockUserId } from './mockData';

interface FinanceState {
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
  transactions: mockTransactions,
  goals: mockGoals,
  bursaries: mockBursaries,
  gamification: mockGamification,
  insights: mockInsights,
  health: mockHealth,
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

export const userId = mockUserId;
