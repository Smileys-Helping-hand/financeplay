'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '../../lib/store';
import { Card } from '../../components/ui/card';
import { format } from 'date-fns';

export default function HistoryPage() {
  const { transactions, loadSnapshot, loading } = useFinanceStore((s) => ({
    transactions: s.transactions,
    loadSnapshot: s.loadSnapshot,
    loading: s.loading
  }));

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaction History</h1>
          <p className="text-sm text-slate-400">Search and review your past entries.</p>
        </div>
      </div>
      <Card className="p-4 overflow-auto">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && transactions.length === 0 && <p className="text-sm text-slate-400">No transactions recorded yet.</p>}
        {!loading && transactions.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-2">Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Note</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-slate-800">
                  <td className="py-2">{format(new Date(tx.date), 'MMM dd')}</td>
                  <td className="capitalize">{tx.category}</td>
                  <td className="capitalize">{tx.type}</td>
                  <td>{tx.note ?? '-'}</td>
                  <td className="text-right">R{Math.abs(tx.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
