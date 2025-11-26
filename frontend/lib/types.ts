export type TransactionCategory = 'food' | 'transport' | 'rent' | 'fun' | 'education' | 'savings' | 'utilities' | 'income' | string;

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: 'expense' | 'income' | 'savings';
  note?: string;
  createdAt?: string;
}

export interface Income {
  id: string;
  userId: string;
  source: string;
  amount: number;
  date: string;
  note?: string;
  createdAt?: string;
}

export interface SavingsTransfer {
  id: string;
  userId: string;
  amount: number;
  from?: string | null;
  to?: string | null;
  date: string;
  createdAt?: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'low' | 'medium' | 'high';
  createdAt?: string;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  title?: string | null;
  body: string;
  emotion?: string | null;
  date: string;
  createdAt?: string;
}

export interface BudgetCategory {
  id: string;
  userId: string;
  name: string;
  limit?: number | null;
  icon?: string | null;
  createdAt?: string;
}

export interface Bursary {
  id: string;
  userId: string;
  provider: string;
  monthlyAmount: number;
  nextPaymentDate: string;
  notes?: string;
}

export interface Gamification {
  userId: string;
  level: number;
  xp: number;
  streak: number;
  badges: string[];
  dailyChallenge: string;
  persona: 'friendly' | 'strict' | 'humorous';
  lastXpGain?: number;
}

export interface SnapshotTotals {
  spending: number;
  income: number;
  savings: number;
}

export interface SnapshotPayload {
  user?: { id: string; email: string; name?: string | null };
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
}

export interface Insight {
  title: string;
  description: string;
  action?: string;
}

export interface FinancialHealth {
  score: number;
  category: 'poor' | 'fair' | 'good';
  summary: string;
}
