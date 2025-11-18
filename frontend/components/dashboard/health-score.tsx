'use client';

import { ProgressRing } from '../ui/progress-ring';
import { Card } from '../ui/card';
import { useFinanceStore } from '../../lib/store';

const categoryColors = {
  poor: 'text-red-400',
  fair: 'text-amber-400',
  good: 'text-emerald-400'
} as const;

export function HealthScore() {
  const health = useFinanceStore((s) => s.health);
  const label = health.category === 'good' ? 'Healthy' : health.category === 'fair' ? 'Watchlist' : 'Needs action';

  return (
    <Card className="flex items-center gap-4">
      <ProgressRing value={health.score} label={`${health.score}/100`} />
      <div className="space-y-1">
        <p className="text-xs text-slate-500">Financial Health</p>
        <p className="text-lg font-semibold">{label}</p>
        <p className={`text-sm ${categoryColors[health.category]}`}>{health.summary}</p>
      </div>
    </Card>
  );
}
