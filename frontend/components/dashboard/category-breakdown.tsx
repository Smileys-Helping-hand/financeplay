'use client';

import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { TransactionCategory } from '../../lib/types';
import { useFinanceStore } from '../../lib/store';

const colors: Record<TransactionCategory, string> = {
  food: 'from-amber-400 to-orange-500',
  transport: 'from-emerald-400 to-green-500',
  rent: 'from-blue-400 to-indigo-500',
  fun: 'from-pink-400 to-fuchsia-500',
  education: 'from-cyan-400 to-sky-500',
  savings: 'from-purple-400 to-violet-500',
  utilities: 'from-slate-400 to-slate-500',
  income: 'from-emerald-200 to-emerald-300'
};

export function CategoryBreakdown() {
  const transactions = useFinanceStore((s) => s.transactions);
  const totals: Record<TransactionCategory, number> = {
    food: 0,
    transport: 0,
    rent: 0,
    fun: 0,
    education: 0,
    savings: 0,
    utilities: 0,
    income: 0
  };

  transactions.forEach((t) => {
    if (t.category === 'income' || t.category === 'savings') return;
    totals[t.category] += Math.abs(t.amount);
  });

  const filteredTotals = Object.entries(totals).filter(
    ([category]) => category !== 'income' && category !== 'savings'
  );

  const totalAmount = filteredTotals.reduce((sum, [, value]) => sum + value, 0);

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
            const pct = totalAmount ? Math.round((amount / (totalAmount || 1)) * 100) : 0;
            return (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{category}</span>
                  <span className="text-slate-400">R{amount.toFixed(0)}</span>
                </div>
                <Progress value={pct} className={`bg-slate-900`}>
                  <div className={`h-2 w-full rounded-full bg-gradient-to-r ${colors[category as TransactionCategory]}`}></div>
                </Progress>
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
