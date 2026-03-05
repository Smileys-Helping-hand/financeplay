'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/card';
import { useFinanceStore } from '../../lib/store';

export function SpendingChart() {
  const transactions = useFinanceStore((s) => s.transactions);

  const { data, currentMonthLabel, vsLastMonth } = useMemo(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
    const prevYear = curMonth === 0 ? curYear - 1 : curYear;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const spending = transactions.filter(
      (t) => t.category !== 'income' && t.category !== 'savings' && t.amount > 0
    );

    const curTotal = spending
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .reduce((s, t) => s + t.amount, 0);

    const prevTotal = spending
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
      })
      .reduce((s, t) => s + t.amount, 0);

    const pctChange = prevTotal > 0
      ? Math.round(((curTotal - prevTotal) / prevTotal) * 100)
      : null;

    const current = monthNames[curMonth] + ' ' + curYear;
    const vs = pctChange === null ? 'First month' :
      pctChange > 0 ? `+${pctChange}% vs ${monthNames[prevMonth]}`
        : `${pctChange}% vs ${monthNames[prevMonth]}`;

    const chartData = spending
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((t) => ({ name: t.date.slice(8), spend: t.amount }));

    return { data: chartData, currentMonthLabel: current, vsLastMonth: vs };
  }, [transactions]);

  const hasData = data.length > 0;

  return (
    <Card className="h-72">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500">Spending trend</p>
          <p className="text-lg font-semibold">{currentMonthLabel}</p>
        </div>
        <span className={`text-xs ${vsLastMonth.startsWith('+') ? 'text-red-400' : 'text-primary'}`}>
          {vsLastMonth}
        </span>
      </div>
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6F7CFF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6F7CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#475569" tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" tickLine={false} axisLine={false} allowDecimals={false} domain={[0, 'auto']} />
            <Tooltip contentStyle={{ background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b' }} />
            <Area type="monotone" dataKey="spend" stroke="#6F7CFF" fillOpacity={1} fill="url(#colorSpend)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">No spending data this month yet</div>
      )}
    </Card>
  );
}
