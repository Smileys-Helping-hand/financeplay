'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { Wallet, Building2, PiggyBank, TrendingUp, Plus, Trash2, Edit } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string | null;
  icon?: string | null;
};

const accountTypes = [
  { value: 'wallet', label: 'Cash Wallet', icon: Wallet, color: 'bg-green-500' },
  { value: 'bank', label: 'Bank Account', icon: Building2, color: 'bg-blue-500' },
  { value: 'savings', label: 'Savings Account', icon: PiggyBank, color: 'bg-purple-500' },
  { value: 'investment', label: 'Investment', icon: TrendingUp, color: 'bg-orange-500' },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState('');
  const [type, setType] = useState('wallet');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('ZAR');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/data/accounts`);
      setAccounts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    const selectedType = accountTypes.find(t => t.value === type);

    try {
      await axios.post(`${API_URL}/data/accounts`, {
        name,
        type,
        balance: parseFloat(balance),
        currency,
        color: selectedType?.color,
        icon: selectedType?.value
      });
      
      setName('');
      setBalance('');
      setType('wallet');
      setCurrency('ZAR');
      setShowForm(false);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to add account:', error);
      alert('Failed to add account. Please try again.');
    }
  };

  const handleUpdateBalance = async (accountId: string, currentBalance: number) => {
    const newBalance = prompt(`Update balance (current: R${currentBalance.toFixed(2)}):`);
    if (!newBalance) return;

    try {
      await axios.put(`${API_URL}/data/accounts/${accountId}`, {
        balance: parseFloat(newBalance)
      });
      fetchAccounts();
    } catch (error) {
      console.error('Failed to update account:', error);
      alert('Failed to update account.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this account? This will not delete associated transactions.')) return;
    
    try {
      await axios.delete(`${API_URL}/data/accounts/${id}`);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account.');
    }
  };

  const getAccountIcon = (type: string) => {
    const accountType = accountTypes.find(t => t.value === type);
    const Icon = accountType?.icon || Wallet;
    return <Icon className="h-5 w-5" />;
  };

  const getAccountColor = (type: string) => {
    const accountType = accountTypes.find(t => t.value === type);
    return accountType?.color || 'bg-slate-500';
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Financial Accounts</p>
            <h1 className="text-2xl font-semibold">Wallets & Accounts</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Total Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Balance</p>
              <h2 className="text-4xl font-bold mt-2">R{totalBalance.toFixed(2)}</h2>
              <p className="text-sm text-slate-300 mt-1">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="p-4 bg-primary/20 rounded-full">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
        </Card>

        {showForm && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Account Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Main Wallet, FNB Checking"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                  >
                    {accountTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Balance</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
                  >
                    <option value="ZAR">ZAR (South African Rand)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Account</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.length === 0 && (
            <Card className="p-8 col-span-full text-center text-slate-400">
              <p>No accounts yet. Click "Add Account" to track your wallets and bank accounts!</p>
            </Card>
          )}
          {accounts.map((account) => (
            <Card key={account.id} className="p-6 space-y-4 relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(account.id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${getAccountColor(account.type)}/20`}>
                  <div className={`${getAccountColor(account.type).replace('bg-', 'text-')}`}>
                    {getAccountIcon(account.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-400 capitalize">{account.type}</p>
                  <p className="font-semibold">{account.name}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Balance</p>
                <p className="text-2xl font-bold">{account.currency} {account.balance.toFixed(2)}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleUpdateBalance(account.id, account.balance)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Balance
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Pro Tip
          </h3>
          <p className="text-sm text-slate-400">
            Keep separate accounts for different purposes: daily spending (wallet), savings, and emergency funds. 
            This helps you track where your money goes and prevents overspending.
          </p>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
