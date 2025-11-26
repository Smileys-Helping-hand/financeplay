'use client';

import axios from 'axios';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ErrorBoundary } from '../../components/ui/error-boundary';

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get('/api/reports/weekly', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      setLink(url);
    } catch (err) {
      setError('Could not generate your report right now. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <p className="text-xs text-slate-500">Insights</p>
          <h1 className="text-2xl font-semibold">Weekly AI Report</h1>
        </div>
        <Card className="space-y-3">
          <p className="text-sm text-slate-300">Generate a PDF summary of your spending, goals, and challenges powered by AI.</p>
          <Button onClick={generateReport} disabled={loading}>
            {loading ? 'Generating…' : 'Generate report'}
          </Button>
          {error && <p className="text-xs text-amber-400">{error}</p>}
          {link && (
            <a href={link} download="financeplay-report.pdf" className="text-primary text-sm">
              Download your report
            </a>
          )}
        </Card>
      </div>
    </ErrorBoundary>
  );
}
