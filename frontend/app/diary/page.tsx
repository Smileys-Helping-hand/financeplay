'use client';

import { useEffect } from 'react';
import { useFinanceStore } from '../../lib/store';
import { Card } from '../../components/ui/card';
import { format } from 'date-fns';

export default function DiaryPage() {
  const { diary, loadSnapshot, loading } = useFinanceStore((s) => ({
    diary: s.diary,
    loadSnapshot: s.loadSnapshot,
    loading: s.loading
  }));

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Finance Diary</h1>
        <p className="text-sm text-slate-400">Capture reflections alongside your spending.</p>
      </div>
      {loading && <p className="text-sm text-slate-400">Loading diary...</p>}
      {!loading && diary.length === 0 && <p className="text-sm text-slate-400">No diary entries yet.</p>}
      <div className="space-y-3">
        {diary.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                <h3 className="font-semibold">{entry.title || 'Untitled'}</h3>
              </div>
              {entry.emotion && <span className="text-xs text-emerald-300">{entry.emotion}</span>}
            </div>
            <p className="text-sm text-slate-200 mt-2 whitespace-pre-line">{entry.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
