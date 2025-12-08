'use client';

import { Wallet, TrendingUp, Calendar, Target } from 'lucide-react';
import { Card } from '../ui/card';
import { useFinanceStore } from '../../lib/store';
import { Goal } from '../../lib/types';

export function OverviewCards() {
  const transactions = useFinanceStore((s) => s.transactions);
  const goals = useFinanceStore((s) => s.goals);
  const bursaries = useFinanceStore((s) => s.bursaries);
  const spendingTotal = transactions
    .filter((t) => t.category !== 'income' && t.category !== 'savings')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const savings = transactions
    .filter((t) => t.category === 'savings')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const nextAllowance = bursaries[0]?.nextPaymentDate ?? 'Not scheduled';
  const priorityRank: Record<Goal['priority'], number> = { high: 3, medium: 2, low: 1 };
  const priorityValue = (priority?: Goal['priority']) => priorityRank[priority ?? 'medium'] ?? 0;
  const topGoal = [...goals].sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority))[0];

  const cards = [
    { title: 'Spend this month', value: spendingTotal > 0 ? `R${spendingTotal.toFixed(0)}` : 'R0', icon: Wallet, subtitle: 'Food, transport, rent' },
    { title: 'Saved so far', value: savings > 0 ? `R${savings.toFixed(0)}` : 'R0', icon: TrendingUp, subtitle: 'Auto-transfer & round-ups' },
    { title: 'Next allowance', value: nextAllowance, icon: Calendar, subtitle: bursaries.length > 0 ? 'NSFAS + Scholarships' : 'Add a bursary to track' },
    {
      title: 'Top priority goal',
      value: topGoal?.name ?? 'No goals yet',
      icon: Target,
      subtitle: topGoal ? `R${topGoal.currentAmount} / R${topGoal.targetAmount}` : 'Create your first savings goal'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{card.title}</span>
            <card.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-semibold">{card.value}</div>
          <div className="text-xs text-slate-500">{card.subtitle}</div>
        </Card>
      ))}
    </div>
  );
}
