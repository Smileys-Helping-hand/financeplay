'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../ui/card';
import { useFinanceStore } from '../../lib/store';

export function SpendingChart() {
  const transactions = useFinanceStore((s) => s.transactions);
  const data = transactions
    .filter((t) => t.category !== 'income' && t.amount > 0)
    .map((t) => ({ name: t.date.slice(5), spend: t.amount }));

  const hasData = data.length > 0;

  return (
    <Card className="h-72">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500">Spending trend</p>
          <p className="text-lg font-semibold">March overview</p>
        </div>
        <span className="text-xs text-primary">-8% vs last month</span>
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
        <div className="flex h-full items-center justify-center text-sm text-slate-500">No spending data yet</div>
      )}
    </Card>
  );
}
