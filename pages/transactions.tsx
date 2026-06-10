import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Car,
  Coffee,
  Utensils,
  Home,
  Zap,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MetricCards from '@/components/dashboard/MetricCards';
import QuickAddTiles from '@/components/dashboard/QuickAddTiles';
import TransactionFilterBar from '@/components/dashboard/TransactionFilterBar';
import EmptyState from '@/components/dashboard/EmptyState';
import ProTipsBanner from '@/components/dashboard/ProTipsBanner';
import AICoachWidget from '@/components/dashboard/AICoachWidget';

const mockMetrics = [
  {
    label: 'Total Income',
    value: 0,
    trend: 'up' as const,
    trendValue: '+0%',
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    color: 'emerald' as const,
    data: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    label: 'Total Expenses',
    value: 0,
    trend: 'down' as const,
    trendValue: '+0%',
    icon: <TrendingDown className="w-5 h-5 text-rose-400" />,
    color: 'rose' as const,
    data: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    label: 'Net Balance',
    value: 0,
    trend: 'neutral' as const,
    trendValue: '+0%',
    icon: <Wallet className="w-5 h-5 text-blue-400" />,
    color: 'blue' as const,
    data: [0, 0, 0, 0, 0, 0, 0],
  },
];

const mockQuickAddTiles = [
  {
    id: '1',
    label: 'Uber to Campus',
    amount: 'R35',
    icon: Car,
    color: 'purple' as const,
  },
  {
    id: '2',
    label: 'Coffee at Vida',
    amount: 'R28',
    icon: Coffee,
    color: 'pink' as const,
  },
  {
    id: '3',
    label: 'Lunch at Canteen',
    amount: 'R45',
    icon: Utensils,
    color: 'blue' as const,
  },
  {
    id: '4',
    label: 'Taxi Home',
    amount: 'R25',
    icon: Car,
    color: 'amber' as const,
  },
  {
    id: '5',
    label: 'Electricity Top-up',
    amount: 'R100',
    icon: Zap,
    color: 'cyan' as const,
  },
  {
    id: '6',
    label: 'Data Bundle',
    amount: 'R149',
    icon: ShoppingBag,
    color: 'indigo' as const,
  },
];

const mockCategories = [
  { id: 'all', label: 'All Categories' },
  { id: 'food', label: 'Food' },
  { id: 'transport', label: 'Transport' },
  { id: 'rent', label: 'Rent' },
  { id: 'education', label: 'Education' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'utilities', label: 'Utilities' },
];

const mockProTips = [
  {
    id: '1',
    title: 'Pro Tips for Better Tracking',
    description: 'Link transactions to accounts for automatic balance tracking and better insights.',
  },
  {
    id: '2',
    title: 'Use Quick Templates',
    description: 'Save time with quick templates for common expenses like utilities and subscriptions.',
  },
  {
    id: '3',
    title: 'Set Spending Limits',
    description: 'Create category budgets to stay on top of your spending and reach your financial goals.',
  },
];

export default function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const handleQuickAdd = (tile: any) => {
    console.log('Quick add:', tile);
    // TODO: Open add transaction modal
  };

  return (
    <DashboardLayout>
      {/* Page Title */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Transactions</h1>
            <p className="text-slate-400">Track, manage, and analyze all your financial activities</p>
          </div>
          <motion.span
            className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 font-medium whitespace-nowrap"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            0 Transactions
          </motion.span>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <MetricCards metrics={mockMetrics} />

      {/* Pro Tips Banner */}
      <ProTipsBanner tips={mockProTips} />

      {/* Quick Add Tiles */}
      <QuickAddTiles tiles={mockQuickAddTiles} onTileClick={handleQuickAdd} />

      {/* Filter Bar */}
      <TransactionFilterBar
        categories={mockCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

      {/* Transactions List or Empty State */}
      <div className="mb-8">
        {/* Empty State - shown when no transactions */}
        <EmptyState
          title="No transactions yet"
          description="Start tracking your finances by adding your first transaction. Use the quick add buttons above or manually create one to get started!"
          icon={<DollarSign className="w-16 h-16" />}
          actionLabel="Add First Transaction"
          onAction={() => console.log('Open add transaction modal')}
        />
      </div>

      {/* AI Coach Widget */}
      <AICoachWidget />
    </DashboardLayout>
  );
}
