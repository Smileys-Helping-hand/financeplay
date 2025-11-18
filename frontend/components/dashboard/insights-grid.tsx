'use client';

import { Lightbulb, Flame, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { useFinanceStore } from '../../lib/store';

const icons = [Lightbulb, Sparkles, Flame];

export function InsightsGrid() {
  const insights = useFinanceStore((s) => s.insights);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {insights.map((insight, idx) => {
        const Icon = icons[idx % icons.length];
        return (
          <Card key={insight.title} className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Icon className="h-4 w-4 text-primary" />
              <span>{insight.title}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{insight.description}</p>
            {insight.action && <p className="text-xs text-primary">{insight.action}</p>}
          </Card>
        );
      })}
      {insights.length === 0 && <p className="text-sm text-slate-500">No insights to show right now.</p>}
    </div>
  );
}
