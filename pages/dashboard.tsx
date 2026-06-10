import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Zap,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MetricCards from '@/components/dashboard/MetricCards';
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

const mockProTips = [
  {
    id: '1',
    title: 'Financial Health Insights',
    description: 'Your financial health score is based on your spending patterns, savings, and financial goals.',
  },
  {
    id: '2',
    title: 'Monthly Budget Tracker',
    description: 'Keep track of your monthly spending limits and stay on budget with our smart tracking system.',
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Greeting */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-slate-400 mb-2">Good afternoon, mraaziqp 👋</p>
        <h1 className="text-4xl font-bold text-white mb-1">Your Financial Overview</h1>
        <p className="text-slate-400">
          {new Date().toLocaleDateString('en-ZA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>

      {/* Metric Cards */}
      <MetricCards metrics={mockMetrics} />

      {/* Financial Health Score */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Health Card */}
        <motion.div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl p-8">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">Financial Health Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    50
                  </span>
                  <span className="text-sm text-amber-400 font-medium">Fair</span>
                </div>
              </div>
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-3xl">📊</span>
              </motion.div>
            </div>

            <p className="text-slate-300 mb-4">
              You're on track, but there's room for improvement. Try reducing spending or increasing savings.
            </p>

            <motion.button
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors"
            >
              View detailed analysis
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="space-y-4">
          <motion.div
            className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl p-6"
            whileHover={{ y: -2 }}
          >
            <p className="text-xs text-slate-400 font-medium mb-2">THIS MONTH</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">R0.00</p>
            <p className="text-xs text-slate-500 mt-1">Available to spend</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-red-500/10 backdrop-blur-xl p-6"
            whileHover={{ y: -2 }}
          >
            <p className="text-xs text-slate-400 font-medium mb-2">REMAINING BUDGET</p>
            <p className="text-2xl font-bold text-rose-400 font-mono">R0.00</p>
            <p className="text-xs text-slate-500 mt-1">Of planned budget</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Monthly Budget Tracker */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-2">Monthly Budget Tracker</p>
            <h2 className="text-2xl font-bold text-white">Stamina: High</h2>
          </div>
          <span className="text-sm text-slate-400 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.08]">
            20 days left
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Monthly Play Money</span>
            <span className="text-sm font-mono text-white">R3 000 / R3 000 set</span>
          </div>
          <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.08]">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Safe to Spend */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
          <p className="text-sm text-slate-400 mb-1">Safe to spend:</p>
          <p className="text-lg font-bold text-emerald-400">R150 / day for 20 more days</p>
        </div>
      </motion.div>

      {/* Your Progress - Gamification */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Your Progress
              </p>
              <h3 className="text-2xl font-bold text-white">Rookie Explorer</h3>
            </div>
            <motion.button
              whileHover={{ x: 4 }}
              className="text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              Trophy Room
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Level 1</span>
                <span className="text-sm font-mono text-slate-400">0 XP / 100 XP</span>
              </div>
              <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.08]">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 1.2, delay: 0.7 }}
                />
              </div>
            </div>

            {/* Daily Challenge */}
            <motion.div
              className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
              whileHover={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}
            >
              <p className="text-sm font-medium text-purple-300 mb-1">Daily Challenge</p>
              <p className="text-sm text-slate-400">Add your first transaction</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg transition-all"
              >
                Start Challenge
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements Preview */}
        <motion.div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-8">
          <p className="text-sm font-medium text-slate-400 mb-4">Achievements</p>
          <div className="space-y-3">
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.05] border border-white/[0.08]"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
              <span className="text-2xl">🎯</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Starter</p>
                <p className="text-xs text-slate-500">Add 1 transaction</p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] opacity-50"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
              <span className="text-2xl opacity-50">💰</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Money Tracker</p>
                <p className="text-xs text-slate-500">Add 10 transactions</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Pro Tips */}
      <ProTipsBanner tips={mockProTips} />

      {/* Recent Transactions */}
      <motion.div
        className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <motion.button
            whileHover={{ x: 4 }}
            className="text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="text-center py-12">
          <p className="text-slate-400">No recent transactions</p>
        </div>
      </motion.div>

      {/* AI Coach Widget */}
      <AICoachWidget />
    </DashboardLayout>
  );
}
