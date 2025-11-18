export type TransactionCategory = 'food' | 'transport' | 'rent' | 'fun' | 'education' | 'savings' | 'utilities' | 'income';

export interface Transaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  description: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
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

export interface SnapshotPayload {
  user: { id: string; email: string; name?: string | null };
  transactions: Transaction[];
  goals: Goal[];
  bursaries: Bursary[];
  gamification: Gamification | null;
  spendingTotals: { total: number; byCategory: Record<string, number> };
  savingsTotal: number;
  categories: string[];
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
