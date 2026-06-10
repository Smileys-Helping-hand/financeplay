import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Car,
  Coffee,
  Utensils,
  Zap,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import {
  DashboardLayout,
  MetricCards,
  QuickAddTiles,
  TransactionFilterBar,
  EmptyState,
  ProTipsBanner,
  AICoachWidget,
} from '@/components/dashboard';

const mockMetrics = [
  {
    label: 'Total Income',
    value: 45000,
    trend: 'up' as const,
    trendValue: '+12.5%',
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    color: 'emerald' as const,
    data: [0, 1000, 2000, 1500, 3000, 2500, 4000],
  },
  {
    label: 'Total Expenses',
    value: 12500,
    trend: 'down' as const,
    trendValue: '+8.2%',
    icon: <TrendingDown className="w-5 h-5 text-rose-400" />,
    color: 'rose' as const,
    data: [100, 150, 200, 180, 220, 190, 250],
  },
  {
    label: 'Net Balance',
    value: 32500,
    trend: 'up' as const,
    trendValue: '+4.3%',
    icon: <Wallet className="w-5 h-5 text-blue-400" />,
    color: 'blue' as const,
    data: [500, 850, 1800, 1320, 2780, 2310, 3750],
  },
];

const mockQuickAddTiles = [
  { id: '1', label: 'Uber to Campus', amount: 'R35', icon: Car, color: 'purple' as const },
  { id: '2', label: 'Coffee at Vida', amount: 'R28', icon: Coffee, color: 'pink' as const },
  { id: '3', label: 'Lunch at Canteen', amount: 'R45', icon: Utensils, color: 'blue' as const },
  { id: '4', label: 'Taxi Home', amount: 'R25', icon: Car, color: 'amber' as const },
  { id: '5', label: 'Electricity Top-up', amount: 'R100', icon: Zap, color: 'cyan' as const },
  { id: '6', label: 'Data Bundle', amount: 'R149', icon: ShoppingBag, color: 'indigo' as const },
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

export default function ComponentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showEmptyState, setShowEmptyState] = useState(true);

  const handleQuickAdd = (tile: any) => {
    console.log('Quick add clicked:', tile);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Component Showcase</h1>
        <p className="text-slate-400">
          Complete demonstration of all dashboard components and design system
        </p>
      </motion.div>

      {/* Section 1: Metric Cards */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          MetricCards Component
        </h2>
        <p className="text-slate-400 mb-6">
          Responsive cards displaying financial metrics with embedded sparkline charts.
        </p>
        <MetricCards metrics={mockMetrics} />
      </motion.section>

      {/* Section 2: Quick Add Tiles */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          QuickAddTiles Component
        </h2>
        <p className="text-slate-400 mb-6">
          Interactive tiles for quick transaction shortcuts with hover effects.
        </p>
        <QuickAddTiles tiles={mockQuickAddTiles} onTileClick={handleQuickAdd} />
      </motion.section>

      {/* Section 3: Transaction Filter Bar */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          TransactionFilterBar Component
        </h2>
        <p className="text-slate-400 mb-6">
          Unified search, filtering, and sorting controls with fluid category pills.
        </p>
        <TransactionFilterBar
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
        />

        <div className="mt-6 p-4 rounded-lg bg-white/[0.05] border border-white/[0.08]">
          <p className="text-sm text-slate-400">
            <span className="font-mono text-purple-400">selectedCategory:</span>{' '}
            <span className="text-white">{selectedCategory}</span>
          </p>
          <p className="text-sm text-slate-400 mt-2">
            <span className="font-mono text-purple-400">searchQuery:</span>{' '}
            <span className="text-white">{searchQuery || '(empty)'}</span>
          </p>
          <p className="text-sm text-slate-400 mt-2">
            <span className="font-mono text-purple-400">sortBy:</span>{' '}
            <span className="text-white">{sortBy}</span>
          </p>
        </div>
      </motion.section>

      {/* Section 4: Empty State */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          EmptyState Component
        </h2>
        <p className="text-slate-400 mb-6">
          Elegant placeholder for zero-data scenarios with animated background.
        </p>

        <div className="mb-6">
          <motion.button
            onClick={() => setShowEmptyState(!showEmptyState)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            {showEmptyState ? 'Hide' : 'Show'} Empty State
          </motion.button>
        </div>

        {showEmptyState && (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters or search terms to find what you're looking for."
            icon={<DollarSign className="w-16 h-16" />}
            actionLabel="Clear Filters"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        )}
      </motion.section>

      {/* Section 5: Pro Tips Banner */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          ProTipsBanner Component
        </h2>
        <p className="text-slate-400 mb-6">
          Dismissible carousel banner with rotating financial tips and insights.
        </p>
        <ProTipsBanner tips={mockProTips} />
      </motion.section>

      {/* Section 6: AI Coach Widget */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          AICoachWidget Component
        </h2>
        <p className="text-slate-400 mb-6">
          Floating chat interface for AI-powered financial coaching and nudges. Check bottom-right
          corner.
        </p>
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">Widget Active</span>
          </div>
          <p className="text-slate-400 text-sm">
            The AI Coach widget is ready for interaction. Look for the floating button in the
            bottom-right corner of the page.
          </p>
        </div>
      </motion.section>

      {/* Design System Reference */}
      <motion.section
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
          Design System
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colors */}
          <motion.div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Color Palette</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500" />
                <div>
                  <p className="text-sm font-medium text-white">Income</p>
                  <p className="text-xs text-slate-500">#10b981 (Emerald)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-red-500" />
                <div>
                  <p className="text-sm font-medium text-white">Expenses</p>
                  <p className="text-xs text-slate-500">#ef4444 (Crimson)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500" />
                <div>
                  <p className="text-sm font-medium text-white">Primary CTA</p>
                  <p className="text-xs text-slate-500">#8b5cf6 (Amethyst)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Typography</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Heading</p>
                <p className="text-2xl font-bold text-white">Aa Heading Text</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Body</p>
                <p className="text-sm text-slate-300">Regular body text for descriptions</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Monospace</p>
                <p className="text-sm font-mono text-purple-300">R1,234.56</p>
              </div>
            </div>
          </motion.div>

          {/* Spacing */}
          <motion.div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Spacing Scale</h3>
            <div className="space-y-2">
              {[2, 4, 8, 12, 16, 20, 24].map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-slate-500">{size}px</div>
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 rounded"
                    style={{ width: `${size * 4}px`, height: '8px' }}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Animations */}
          <motion.div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Animations</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Entrance</p>
                <motion.div
                  className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm text-slate-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Fade + Slide
                </motion.div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Hover</p>
                <motion.div
                  className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm text-slate-300"
                  whileHover={{ y: -4 }}
                >
                  Lift (-4px)
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Coach Widget */}
      <AICoachWidget />
    </DashboardLayout>
  );
}
