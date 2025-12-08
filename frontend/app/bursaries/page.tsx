'use client';

import { Clock3, PiggyBank, Shield, Plus, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { FormEvent, useEffect, useState } from 'react';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

type Bursary = {
  id: string;
  provider: string;
  monthlyAmount: number;
  nextPaymentDate: string;
  notes?: string | null;
};

export default function BursariesPage() {
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [provider, setProvider] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchBursaries();
  }, []);

  const fetchBursaries = async () => {
    try {
      const response = await axios.get(`${API_URL}/data/snapshot`);
      setBursaries(response.data.bursaries || []);
    } catch (error) {
      console.error('Failed to fetch bursaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!provider || !monthlyAmount) return;

    try {
      await axios.post(`${API_URL}/data/bursaries`, {
        provider,
        monthlyAmount: parseFloat(monthlyAmount),
        nextPaymentDate: new Date(nextPaymentDate).toISOString(),
        notes
      });
      
      setProvider('');
      setMonthlyAmount('');
      setNotes('');
      setNextPaymentDate(new Date().toISOString().split('T')[0]);
      setShowForm(false);
      fetchBursaries();
    } catch (error) {
      console.error('Failed to add bursary:', error);
      alert('Failed to add bursary. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bursary?')) return;
    
    try {
      await axios.delete(`${API_URL}/data/bursaries/${id}`);
      fetchBursaries();
    } catch (error) {
      console.error('Failed to delete bursary:', error);
      alert('Failed to delete bursary.');
    }
  };

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
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bursary
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">New Bursary/Allowance</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Provider</label>
                  <Input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="e.g., NSFAS, Company Bursary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Amount (R)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Next Payment Date</label>
                <Input
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <Input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Covers accommodation and meals"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Bursary</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bursaries.length === 0 && (
            <Card className="p-8 col-span-full text-center text-slate-400">
              <p>No bursaries yet. Click "Add Bursary" to get started!</p>
            </Card>
          )}
          {bursaries.map((bursary) => (
            <Card key={bursary.id} className="space-y-3 relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(bursary.id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{bursary.provider}</span>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-semibold">R{bursary.monthlyAmount.toFixed(2)}</div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock3 className="h-4 w-4 text-amber-400" />
                Next payment {new Date(bursary.nextPaymentDate).toLocaleDateString()}
              </div>
              {bursary.notes && <p className="text-xs text-slate-500">{bursary.notes}</p>}
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
