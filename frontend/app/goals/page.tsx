'use client';

import { FormEvent, useEffect, useState } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { useFinanceStore } from '../../lib/store';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';

export default function GoalsPage() {
  const goals = useFinanceStore((s) => s.goals);
  const addGoal = useFinanceStore((s) => s.addGoal);
  const [name, setName] = useState('');
  const [target, setTarget] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    addGoal({ id: nanoid(), userId: 'user_123', name, targetAmount: target, currentAmount: 0, deadline, priority: 'medium' });
    setName('');
    setTarget(0);
    setDeadline('');
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
          <Input placeholder="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <Button type="submit">Add goal</Button>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.length === 0 && <p className="text-sm text-slate-400">No goals yet. Add your first target.</p>}
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <Card key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{goal.deadline}</p>
                    <p className="text-lg font-semibold">{goal.name}</p>
                  </div>
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
