import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BudgetCategory,
  Bursary,
  DiaryEntry,
  FinancialHealth,
  Gamification,
  Goal,
  Income,
  Insight,
  SavingsTransfer,
  SnapshotPayload,
  Transaction
} from './types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FinanceState {
  transactions: Transaction[];
  incomes: Income[];
  savings: SavingsTransfer[];
  goals: Goal[];
  budgetCategories: BudgetCategory[];
  bursaries: Bursary[];
  gamification: Gamification;
  insights: Insight[];
  health: FinancialHealth;
  diary: DiaryEntry[];
  loading: boolean;
  theme: 'light' | 'dark';
  totals: SnapshotPayload['totals'];
  categories: SnapshotPayload['categories'];
  loadSnapshot: () => Promise<void>;
  addTransaction: (input: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  addIncome: (input: Omit<Income, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  addSavings: (input: Omit<SavingsTransfer, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  addGoal: (input: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateGoalProgress: (id: string, currentAmount: number) => Promise<void>;
  addDiaryEntry: (input: Omit<DiaryEntry, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  setPersona: (persona: Gamification['persona']) => void;
}

const emptyTotals = { spending: 0, income: 0, savings: 0 };
const defaultGamification: Gamification = {
  userId: '',
  level: 1,
  xp: 0,
  streak: 0,
  badges: [],
  dailyChallenge: 'Complete a no-spend day',
  persona: 'friendly'
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      incomes: [],
      savings: [],
      goals: [],
      budgetCategories: [],
      bursaries: [],
      gamification: defaultGamification,
      insights: [],
      diary: [],
      loading: false,
      totals: emptyTotals,
      categories: {},
      health: { score: 72, category: 'good', summary: 'You are on-track with your spending plan.' },
      theme: 'dark',
      async loadSnapshot() {
        set({ loading: true });
        try {
          const res = await fetch(`${apiUrl}/snapshot`);
          if (!res.ok) throw new Error('snapshot');
          const data: SnapshotPayload = await res.json();
          set({
            transactions: data.transactions,
          incomes: data.incomes,
          savings: data.savings,
          goals: data.goals,
          budgetCategories: data.budgetCategories,
          bursaries: data.bursaries,
          diary: data.diary,
          gamification: data.gamification ?? defaultGamification,
          totals: data.totals,
          categories: data.categories,
          loading: false
        });
      } catch (err) {
          console.error(err);
          set({ loading: false });
        }
      },
      async addTransaction(input) {
        await fetch(`${apiUrl}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        await get().loadSnapshot();
      },
      async addIncome(input) {
        await fetch(`${apiUrl}/income`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        await get().loadSnapshot();
      },
      async addSavings(input) {
        await fetch(`${apiUrl}/savings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        await get().loadSnapshot();
      },
      async addGoal(input) {
        await fetch(`${apiUrl}/goals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        await get().loadSnapshot();
      },
      async updateGoalProgress(id, currentAmount) {
        await fetch(`${apiUrl}/goals/${id}/progress`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentAmount })
        });
        await get().loadSnapshot();
      },
      async addDiaryEntry(input) {
        await fetch(`${apiUrl}/diary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });
        await get().loadSnapshot();
      },
      setTheme: (theme) => set({ theme }),
      setPersona: (persona) => set((state) => ({ gamification: { ...state.gamification, persona } }))
    }),
    { name: 'finance-play-store' }
  )
);

export const generateXpGain = (amount: number) => {
  if (amount <= 0) return 0;
  if (amount >= 1000) return 200;
  if (amount >= 500) return 120;
  return 60;
};

export const levelFromXp = (xp: number) => Math.floor(xp / 500) + 1;
