'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { useFinanceStore } from '../../lib/store';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';

export default function GoalsPage() {
  const { goals, addGoal, loadSnapshot, loading } = useFinanceStore((s) => ({
    goals: s.goals,
    addGoal: s.addGoal,
    loadSnapshot: s.loadSnapshot,
    loading: s.loading
  }));
  const [name, setName] = useState('');
  const [target, setTarget] = useState(0);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    addGoal({ name, targetAmount: target, currentAmount: 0, priority });
    setName('');
    setTarget(0);
    setPriority('medium');
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Savings goals</p>
            <h1 className="text-2xl font-semibold">Design goals that feel achievable</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4 card">
          <Input placeholder="Goal name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Target amount" type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="w-full rounded-md border border-slate-800 bg-slate-900 p-2 text-sm"
          >
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
          <Button type="submit">Add goal</Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.length === 0 && <p className="text-sm text-slate-400">No goals yet. Add your first target.</p>}
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <Card key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{goal.name}</p>
                  <span className="text-xs uppercase tracking-wide text-primary">{goal.priority}</span>
                </div>
                <Progress value={pct} />
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>R{goal.currentAmount}</span>
                  <span>Target R{goal.targetAmount}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
