'use client';

import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { TransactionCategory } from '../../lib/types';
import { useFinanceStore } from '../../lib/store';

const SPENDING_CATEGORIES: TransactionCategory[] = [
  'food', 'coffee', 'transport', 'uber', 'rent', 'education', 'shopping',
  'clothing', 'entertainment', 'fun', 'phone', 'electricity', 'water',
  'wifi', 'gas', 'utilities', 'other'
];

const categoryColors: Partial<Record<TransactionCategory, string>> = {
  food: 'from-amber-400 to-orange-500',
  coffee: 'from-yellow-400 to-amber-500',
  transport: 'from-emerald-400 to-green-500',
  uber: 'from-green-400 to-teal-500',
  rent: 'from-blue-400 to-indigo-500',
  education: 'from-cyan-400 to-sky-500',
  shopping: 'from-fuchsia-400 to-pink-500',
  clothing: 'from-rose-400 to-pink-500',
  entertainment: 'from-violet-400 to-purple-500',
  fun: 'from-pink-400 to-fuchsia-500',
  phone: 'from-slate-400 to-slate-500',
  electricity: 'from-yellow-300 to-yellow-500',
  water: 'from-teal-400 to-cyan-500',
  wifi: 'from-sky-400 to-blue-500',
  gas: 'from-orange-400 to-red-500',
  utilities: 'from-slate-400 to-slate-500',
  savings: 'from-purple-400 to-violet-500',
  income: 'from-emerald-200 to-emerald-300',
  allowance: 'from-green-300 to-emerald-400',
  other: 'from-slate-300 to-slate-400',
};

export function CategoryBreakdown() {
  const transactions = useFinanceStore((s) => s.transactions);

  const totals: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.category === 'income' || t.category === 'savings' || t.category === 'allowance') return;
    totals[t.category] = (totals[t.category] ?? 0) + Math.abs(t.amount);
  });

  const filteredTotals = SPENDING_CATEGORIES
    .filter(cat => (totals[cat] ?? 0) > 0)
    .map(cat => [cat, totals[cat] ?? 0] as [TransactionCategory, number])
    .sort((a, b) => b[1] - a[1]);

  const totalAmount = filteredTotals.reduce((sum, [, v]) => sum + v, 0);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Spending categories</p>
          <p className="text-lg font-semibold">Budget envelopes</p>
        </div>
        <span className="text-xs text-slate-500">{totalAmount ? `R${totalAmount.toFixed(0)} total` : 'No spend yet'}</span>
      </div>
      <div className="space-y-3">
        {filteredTotals.map(([category, amount]) => {
          const pct = totalAmount ? Math.round((amount / totalAmount) * 100) : 0;
          const gradient = categoryColors[category] ?? 'from-slate-400 to-slate-500';
          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{category}</span>
                <span className="text-slate-400">R{amount.toFixed(0)} <span className="text-xs text-slate-600">({pct}%)</span></span>
              </div>
              <Progress value={pct} className={`bg-slate-900 [&>div]:bg-gradient-to-r [&>div]:${gradient}`} />
            </div>
          );
        })}
        {totalAmount === 0 && (
          <p className="text-xs text-slate-500 text-center">Add a transaction to see your envelopes.</p>
        )}
      </div>
    </Card>
  );
}
