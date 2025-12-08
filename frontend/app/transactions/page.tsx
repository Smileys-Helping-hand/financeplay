'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { ArrowDownLeft, ArrowUpRight, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  accountId?: string | null;
};

type Account = {
  id: string;
  name: string;
  type: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');

  const categories = ['food', 'transport', 'rent', 'education', 'entertainment', 'savings', 'income', 'other'];

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/data/accounts`);
      setAccounts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/data/snapshot`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      await axios.post(`${API_URL}/data/transactions`, {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date).toISOString(),
        accountId: accountId || null
      });
      
      setAmount('');
      setDescription('');
      setCategory('food');
      setDate(new Date().toISOString().split('T')[0]);
      setAccountId('');
      setShowForm(false);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    
    try {
      await axios.delete(`${API_URL}/data/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      alert('Failed to delete transaction.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Financial Activity</p>
            <h1 className="text-2xl font-semibold">Transactions</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {showForm && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (R)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this for?"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account (Optional)</label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                  >
                    <option value="">No account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {accountId && amount && (
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      {accounts.find(a => a.id === accountId)?.name || 'Selected Account'}
                    </span>
                    <span className={category === 'income' ? 'text-green-400' : 'text-red-400'}>
                      {category === 'income' ? '+' : '-'}R{parseFloat(amount || '0').toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {category === 'income' 
                      ? 'This amount will be added to the account balance' 
                      : 'This amount will be deducted from the account balance'}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">Add Transaction</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-2">
          {transactions.length === 0 && (
            <Card className="p-8 text-center text-slate-400">
              <p>No transactions yet. Click "Add Transaction" to get started!</p>
            </Card>
          )}
          {transactions.map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${tx.category === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {tx.category === 'income' ? (
                      <ArrowUpRight className="h-5 w-5 text-green-400" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <div className="flex gap-3 text-sm text-slate-400">
                      <span className="capitalize">{tx.category}</span>
                      <span>•</span>
                      <span>{new Date(tx.date).toLocaleDateString()}</span>
                      {tx.accountId && (
                        <>
                          <span>•</span>
                          <span className="text-primary">
                            {accounts.find(a => a.id === tx.accountId)?.name || 'Account'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-semibold ${tx.category === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.category === 'income' ? '+' : '-'}R{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tx.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-blue-500/5 border-blue-500/20">
          <h3 className="font-semibold mb-2 text-blue-400">💡 Smart Account Tracking</h3>
          <p className="text-sm text-slate-400">
            Link transactions to specific accounts to automatically track balances. When you add an expense, 
            the amount is deducted from the selected account. Income transactions add to the account balance. 
            This helps you see exactly where your money is going and how much is in each account!
          </p>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
