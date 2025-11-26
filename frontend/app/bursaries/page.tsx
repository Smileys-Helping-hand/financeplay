'use client';

import { Clock3, PiggyBank, Shield } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { useEffect } from 'react';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { useFinanceStore } from '../../lib/store';

export default function BursariesPage() {
  const { bursaries, loadSnapshot, loading } = useFinanceStore((s) => ({
    bursaries: s.bursaries,
    loadSnapshot: s.loadSnapshot,
    loading: s.loading
  }));

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Bursaries & NSFAS</p>
            <h1 className="text-2xl font-semibold">Track allowances and plan disbursements</h1>
          </div>
          <Button variant="subtle">Export schedule</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bursaries.length === 0 && <p className="text-sm text-slate-400">No bursaries loaded yet.</p>}
          {bursaries.map((bursary) => (
            <Card key={bursary.id} className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{bursary.provider}</span>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-semibold">R{bursary.monthlyAmount}</div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock3 className="h-4 w-4 text-amber-400" />
                Next payment {bursary.nextPaymentDate}
              </div>
              <p className="text-xs text-slate-500">{bursary.notes}</p>
              <Button variant="outline" className="w-full">Optimize spend</Button>
            </Card>
          ))}
        </div>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2"><PiggyBank className="h-4 w-4" />How to use allowances better</p>
            <p className="text-xs text-slate-400">Split your bursary into food, transport, and hustle envelopes to protect your goals.</p>
          </div>
          <Button>Generate AI plan</Button>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
