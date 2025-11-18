import { Bursary, FinancialHealth, Gamification, Goal, Insight, Transaction, TransactionCategory } from './types';

export const mockUserId = 'user_123';

const categories: TransactionCategory[] = ['food', 'transport', 'rent', 'fun', 'education', 'savings', 'utilities'];

const randomAmount = (min: number, max: number) => Number((Math.random() * (max - min) + min).toFixed(2));

const randomDateInMonth = (month = 3, year = 2024) => {
  const day = Math.floor(Math.random() * 28) + 1;
  const padded = String(day).padStart(2, '0');
  const paddedMonth = String(month).padStart(2, '0');
  return `${year}-${paddedMonth}-${padded}`;
};

const generateMonthlyTransactions = (month: number, year: number): Transaction[] => {
  const txs: Transaction[] = [];
  // Income injection
  txs.push({
    id: `inc-${month}-${year}`,
    userId: mockUserId,
    date: `${year}-${String(month).padStart(2, '0')}-01`,
    amount: 4200,
    category: 'income',
    description: 'Monthly NSFAS + side gigs'
  });

  // Rent/utilities anchors
  txs.push({
    id: `rent-${month}-${year}`,
    userId: mockUserId,
    date: `${year}-${String(month).padStart(2, '0')}-03`,
    amount: 1200,
    category: 'rent',
    description: 'Student housing rent'
  });
  txs.push({
    id: `util-${month}-${year}`,
    userId: mockUserId,
    date: `${year}-${String(month).padStart(2, '0')}-05`,
    amount: 280,
    category: 'utilities',
    description: 'Electricity & WiFi'
  });

  // Daily small transactions + weekend spikes
  for (let i = 0; i < 30; i++) {
    const dayCategory = categories[Math.floor(Math.random() * categories.length)];
    const isWeekend = i % 7 === 5 || i % 7 === 6;
    const spike = isWeekend && dayCategory === 'fun';
    const amount = spike ? randomAmount(120, 280) : randomAmount(15, 120);
    txs.push({
      id: `tx-${month}-${i}`,
      userId: mockUserId,
      date: randomDateInMonth(month, year),
      amount,
      category: dayCategory,
      description: spike ? 'Weekend outing' : 'Daily spend'
    });
  }

  // Savings sweeps
  txs.push({
    id: `save-${month}-${year}`,
    userId: mockUserId,
    date: `${year}-${String(month).padStart(2, '0')}-18`,
    amount: -250,
    category: 'savings',
    description: 'Auto-savings sweep'
  });

  return txs;
};

export const mockTransactions: Transaction[] = [
  ...generateMonthlyTransactions(3, 2024)
];

export const mockGoals: Goal[] = [
  { id: 'g1', userId: mockUserId, name: 'Emergency Fund', targetAmount: 5000, currentAmount: 2400, deadline: '2024-12-31', priority: 'high' },
  { id: 'g2', userId: mockUserId, name: 'New Laptop', targetAmount: 1500, currentAmount: 800, deadline: '2024-08-15', priority: 'medium' },
  { id: 'g3', userId: mockUserId, name: 'Cape Town Trip', targetAmount: 2000, currentAmount: 300, deadline: '2025-01-05', priority: 'low' }
];

export const mockBursaries: Bursary[] = [
  { id: 'b1', userId: mockUserId, provider: 'NSFAS', monthlyAmount: 1500, nextPaymentDate: '2024-03-15', notes: 'Accommodation and food' },
  { id: 'b2', userId: mockUserId, provider: 'STEM Excellence Scholarship', monthlyAmount: 1000, nextPaymentDate: '2024-03-28', notes: 'Book allowance upcoming' }
];

export const mockGamification: Gamification = {
  userId: mockUserId,
  level: 6,
  xp: 3120,
  streak: 12,
  badges: ['Budget Ninja', 'Savings Sprinter', 'Streak Keeper'],
  dailyChallenge: 'Spend R50 less on takeaways this week',
  persona: 'friendly',
  lastXpGain: 40
};

export const mockInsights: Insight[] = [
  {
    title: 'Food spending down 8% vs last month',
    description: 'Nice work! You kept takeout in check. Try a Sunday meal prep challenge for bonus XP.',
    action: 'Log a meal prep session to earn +75 XP'
  },
  {
    title: 'You are one transfer away from Level 7',
    description: 'Shifting R200 to your Emergency Fund will push you over the XP threshold.',
    action: 'Move R200 to savings goal'
  },
  {
    title: 'NSFAS allowance incoming',
    description: 'Next disbursement on 15 Mar. Plan transport and food envelopes ahead of time.'
  }
];

export const mockHealth: FinancialHealth = {
  score: 74,
  category: 'good',
  summary: 'You are pacing to hit 3/4 goals. Slight overspending on weekends; transport under control.'
};
