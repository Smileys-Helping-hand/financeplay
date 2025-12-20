'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { 
  ArrowDownLeft, ArrowUpRight, Trash2, Plus, Search, Filter, 
  Download, Upload, Coffee, Bus, Home, GraduationCap, 
  ShoppingBag, Heart, Zap, Smartphone, Pizza, Car, Shirt,
  Lightbulb, Wifi, Droplet, Flame, Calendar, Tag, Copy,
  TrendingUp, TrendingDown, DollarSign, Repeat, Star, Edit2
} from 'lucide-react';
import axios from 'axios';
import { loadAllData } from '../../lib/dataLoader';

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

type CategoryOption = {
  id: string;
  label: string;
  icon: any;
  color: string;
  type: 'expense' | 'income';
};

const categoryOptions: CategoryOption[] = [
  { id: 'food', label: 'Food & Dining', icon: Pizza, color: 'from-orange-500 to-amber-500', type: 'expense' },
  { id: 'coffee', label: 'Coffee & Treats', icon: Coffee, color: 'from-amber-600 to-yellow-500', type: 'expense' },
  { id: 'transport', label: 'Transport', icon: Bus, color: 'from-blue-500 to-cyan-500', type: 'expense' },
  { id: 'uber', label: 'Uber/Taxi', icon: Car, color: 'from-slate-700 to-slate-500', type: 'expense' },
  { id: 'rent', label: 'Rent & Housing', icon: Home, color: 'from-indigo-500 to-purple-500', type: 'expense' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-green-500 to-emerald-500', type: 'expense' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'from-pink-500 to-rose-500', type: 'expense' },
  { id: 'clothing', label: 'Clothing', icon: Shirt, color: 'from-purple-500 to-pink-500', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment', icon: Heart, color: 'from-red-500 to-pink-500', type: 'expense' },
  { id: 'phone', label: 'Phone & Data', icon: Smartphone, color: 'from-cyan-500 to-blue-500', type: 'expense' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: 'from-yellow-500 to-orange-500', type: 'expense' },
  { id: 'water', label: 'Water', icon: Droplet, color: 'from-blue-400 to-cyan-400', type: 'expense' },
  { id: 'wifi', label: 'Internet/WiFi', icon: Wifi, color: 'from-indigo-400 to-blue-400', type: 'expense' },
  { id: 'gas', label: 'Gas/Fuel', icon: Flame, color: 'from-red-500 to-orange-500', type: 'expense' },
  { id: 'utilities', label: 'Other Utilities', icon: Lightbulb, color: 'from-slate-500 to-gray-500', type: 'expense' },
  { id: 'savings', label: 'Savings Transfer', icon: TrendingUp, color: 'from-emerald-500 to-green-500', type: 'expense' },
  { id: 'other', label: 'Other Expense', icon: Tag, color: 'from-slate-600 to-slate-400', type: 'expense' },
  { id: 'income', label: 'Income/Salary', icon: DollarSign, color: 'from-green-400 to-emerald-400', type: 'income' },
  { id: 'allowance', label: 'Allowance/Gift', icon: Star, color: 'from-yellow-400 to-amber-400', type: 'income' },
];

const quickTemplates = [
  { name: 'Uber to Campus', category: 'uber', amount: 35 },
  { name: 'Coffee at Vida', category: 'coffee', amount: 28 },
  { name: 'Lunch at Canteen', category: 'food', amount: 45 },
  { name: 'Taxi Home', category: 'transport', amount: 25 },
  { name: 'Electricity Top-up', category: 'electricity', amount: 100 },
  { name: 'Data Bundle', category: 'phone', amount: 149 },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'visual'>('visual');
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');

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
      await loadAllData();
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    setDescription(template.name);
    setCategory(template.category);
    setAmount(template.amount.toString());
    setShowForm(true);
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

  const duplicateTransaction = (tx: Transaction) => {
    setDescription(tx.description);
    setCategory(tx.category);
    setAmount(tx.amount.toString());
    setAccountId(tx.accountId || '');
    setShowForm(true);
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
      const matchesType = filterType === 'all' || 
                         (filterType === 'income' && tx.category === 'income') ||
                         (filterType === 'expense' && tx.category !== 'income');
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount') return Math.abs(b.amount) - Math.abs(a.amount);
      return a.category.localeCompare(b.category);
    });

  const totalIncome = transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.category !== 'income').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  const getCategoryInfo = (categoryId: string) => {
    return categoryOptions.find(c => c.id === categoryId) || categoryOptions[categoryOptions.length - 1];
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

  const selectedCategory = getCategoryInfo(category);
  const CategoryIcon = selectedCategory.icon;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total Income</p>
                <p className="text-2xl font-bold text-green-400">R{totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total Expenses</p>
                <p className="text-2xl font-bold text-red-400">R{totalExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Net Balance</p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R{netBalance.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Financial Activity</p>
            <h1 className="text-2xl font-semibold">{filteredTransactions.length} Transactions</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        {/* Quick Templates */}
        {!showForm && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-300">⚡ Quick Add</h3>
              <span className="text-xs text-slate-500">Popular transactions</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {quickTemplates.map((template) => {
                const catInfo = getCategoryInfo(template.category);
                const Icon = catInfo.icon;
                return (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-primary/50 transition-all text-left group"
                  >
                    <Icon className="h-4 w-4 text-primary mb-1" />
                    <p className="text-xs font-medium text-slate-200 line-clamp-1">{template.name}</p>
                    <p className="text-xs text-slate-400">R{template.amount}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Add Transaction Form */}
        {showForm && (
          <Card className="p-6 border-2 border-primary/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedCategory.color}`}>
                  <CategoryIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">New Transaction</h2>
                  <p className="text-sm text-slate-400">{selectedCategory.label}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Visual Category Selector */}
              <div>
                <label className="block text-sm font-medium mb-3">Category</label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
                  {categoryOptions.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10 scale-105' 
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-full h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-xs font-medium text-slate-200 line-clamp-2 text-center">
                          {cat.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount and Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (R)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-10 text-lg font-semibold"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this for?"
                    className="text-lg"
                    required
                  />
                </div>
              </div>

              {/* Date and Account */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Link to Account <span className="text-slate-500">(Optional)</span>
                  </label>
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

              {/* Recurring Option */}
              <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="recurring" className="text-sm flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-primary" />
                  <span>Recurring transaction (Coming soon)</span>
                </label>
              </div>

              {/* Preview */}
              {accountId && amount && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/30">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Transaction Preview
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      {accounts.find(a => a.id === accountId)?.name || 'Selected Account'}
                    </span>
                    <span className={`text-lg font-bold ${category === 'income' || category === 'allowance' ? 'text-green-400' : 'text-red-400'}`}>
                      {category === 'income' || category === 'allowance' ? '+' : '-'}R{parseFloat(amount || '0').toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {category === 'income' || category === 'allowance'
                      ? '✓ This amount will be added to the account balance' 
                      : '✓ This amount will be deducted from the account balance'}
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button type="submit" size="lg" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {['food', 'transport', 'rent', 'education', 'entertainment', 'shopping', 'utilities'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                  filterCategory === cat 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Card>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-slate-800 rounded-full">
                  <Tag className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-300 mb-2">
                    {searchTerm || filterCategory !== 'all' ? 'No matching transactions' : 'No transactions yet'}
                  </p>
                  <p className="text-sm text-slate-400">
                    {searchTerm || filterCategory !== 'all' 
                      ? 'Try adjusting your filters or search terms' 
                      : 'Click "Add Transaction" to get started!'}
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          {viewMode === 'visual' ? (
            // Visual Card View
            <div className="grid gap-3">
              {filteredTransactions.map((tx) => {
                const catInfo = getCategoryInfo(tx.category);
                const Icon = catInfo.icon;
                const isIncome = tx.category === 'income' || tx.category === 'allowance';
                
                return (
                  <Card key={tx.id} className="p-4 hover:border-primary/50 transition-all group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${catInfo.color} flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-100 truncate">{tx.description}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {catInfo.label}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(tx.date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                            </span>
                            {tx.accountId && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-medium">
                                  {accounts.find(a => a.id === tx.accountId)?.name || 'Account'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-xl font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                            {isIncome ? '+' : '-'}R{Math.abs(tx.amount).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateTransaction(tx)}
                            className="text-primary hover:text-primary/80"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tx.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Compact List View
            <Card className="divide-y divide-slate-800">
              {filteredTransactions.map((tx) => {
                const catInfo = getCategoryInfo(tx.category);
                const Icon = catInfo.icon;
                const isIncome = tx.category === 'income' || tx.category === 'allowance';
                
                return (
                  <div key={tx.id} className="p-4 hover:bg-slate-800/50 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-slate-200">{tx.description}</p>
                        <p className="text-xs text-slate-400">{catInfo.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-slate-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                      <p className={`text-lg font-bold min-w-[100px] text-right ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                        {isIncome ? '+' : '-'}R{Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => duplicateTransaction(tx)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(tx.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        {/* Tips Card */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-primary">💡 Pro Tips for Better Tracking</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Link transactions to accounts for automatic balance tracking and better insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Use the quick templates for common expenses to save time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Add detailed descriptions to easily remember what each transaction was for</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Duplicate similar transactions instead of starting from scratch</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
