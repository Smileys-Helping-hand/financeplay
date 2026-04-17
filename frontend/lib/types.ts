
export type HalalStatus = 'halal' | 'haram' | 'doubtful';
export type TransactionCategory =
  | 'food' | 'coffee' | 'transport' | 'uber' | 'rent' | 'education'
  | 'shopping' | 'clothing' | 'entertainment' | 'fun' | 'phone'
  | 'electricity' | 'water' | 'wifi' | 'gas' | 'utilities'
  | 'savings' | 'income' | 'allowance' | 'other';

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string | null;
  loanId?: string | null;
  date: string;
  amount: number;
  category: TransactionCategory | string;
  description: string;
  halalStatus?: HalalStatus;
  isRecurring?: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  autoSave?: boolean;
  autoSaveAmount?: number;
}

export interface Bursary {
  id: string;
  userId: string;
  provider: string;
  monthlyAmount: number;
  nextPaymentDate: string;
  notes?: string;
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  notes?: string | null;
}

export interface Loan {
  id: string;
  userId: string;
  name: string;
  loanType: string;       // personal | mortgage | vehicle | student | home-improvement | other
  totalAmount: number;
  remainingBalance: number;
  interestRate: number;   // Annual %
  monthlyPayment: number;
  startDate: string;
  endDate?: string | null;
  purpose?: string | null;
  lender?: string | null;
  isIslamic: boolean;
  notes?: string | null;
  payments: LoanPayment[];
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  month: string;          // "2026-03"
}

export interface Gamification {
  userId: string;
  level: number;
  xp: number;
  xpToNext: number;
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
  loans: Loan[];
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
  message?: string;
}

// ── Dream Vaults ────────────────────────────────────────────
export type VaultMilestone = '25' | '50' | '75' | '100';

export interface DreamVault {
  id: string;
  userId: string;
  title: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  isMultiplayer: boolean;
  locked: boolean;
  milestonesBadges: VaultMilestone[]; // unlocked milestone keys
  createdAt: string;
  updatedAt: string;
}

