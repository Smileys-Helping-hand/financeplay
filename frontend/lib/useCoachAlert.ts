'use client';

import { useEffect, useRef, useState } from 'react';
import { useFinanceStore, getMonthlySpent } from './store';
import { MONTHLY_BUDGET } from './config';

function getDaysInfo() {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed  = now.getDate();
  return { daysElapsed, daysInMonth };
}

export function useCoachAlert() {
  const transactions = useFinanceStore((s) => s.transactions);
  const [alert, setAlert] = useState<string | null>(null);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const spentSoFar = getMonthlySpent(transactions);
    const { daysElapsed, daysInMonth } = getDaysInfo();

    fetch('/api/ai/coach-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spentSoFar, budget: MONTHLY_BUDGET, daysElapsed, daysInMonth }),
    })
      .then((r) => r.json())
      .then((data) => { if (data.alert && data.message) setAlert(data.message); })
      .catch(() => {/* silent – coach alert is non-critical */});
  }, [transactions]);

  return { alert, dismiss: () => setAlert(null) };
}
