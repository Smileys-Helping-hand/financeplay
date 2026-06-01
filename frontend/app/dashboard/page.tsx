"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useFinanceStore, getMonthlySpent, getBurnRateRemaining, getPlayerTitle } from '../../lib/store';
import { MONTHLY_BUDGET, XP_PER_LEVEL } from '../../lib/config';
import { BurnRateBar } from '../../components/dashboard/burn-rate-bar';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import {
  Zap, TrendingDown, TrendingUp, Flame, X, Plus, ArrowRight,
  Target, Wallet, Calendar, Star, ChevronRight, Heart, Shield,
  PiggyBank, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachAlert } from '../../lib/useCoachAlert';
import { calculateFinancialHealth } from '../../lib/dataLoader';
import { Button } from '../../components/ui/button';

function getDaysLeftInMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const categoryEmoji: Record<string, string> = {
  food: '🍕', coffee: '☕', transport: '🚌', uber: '🚗', rent: '🏠',
  education: '🎓', shopping: '🛍️', clothing: '👕', entertainment: '🎬',
  phone: '📱', electricity: '⚡', water: '💧', wifi: '📶', gas: '⛽',
  utilities: '💡', savings: '💰', income: '💵', allowance: '🎁', other: '📦'
};

const DashboardSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-24 bg-zinc-800/50 rounded-2xl" />
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-zinc-800/50 rounded-2xl" />
      <div className="h-24 bg-zinc-800/50 rounded-2xl" />
    </div>
    <div className="h-40 bg-zinc-800/50 rounded-2xl" />
    <div className="h-64 bg-zinc-800/50 rounded-2xl" />
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const transactions = useFinanceStore((s) => s.transactions);
  const goals = useFinanceStore((s) => s.goals);
  const gamification = useFinanceStore((s) => s.gamification);
  const user = useFinanceStore((s) => s.user);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const spent     = useMemo(() => getMonthlySpent(transactions), [transactions]);
  const remaining = useMemo(() => getBurnRateRemaining(transactions), [transactions]);
  const daysLeft  = getDaysLeftInMonth();
  const { alert: coachAlert, dismiss: dismissCoach } = useCoachAlert();

  // Financial health score
  const health = useMemo(() => {
    const spendingTotals = { total: spent, byCategory: {} };
    return calculateFinancialHealth(transactions, goals, spendingTotals);
  }, [transactions, goals, spent]);

  // Totals
  const totalIncome   = useMemo(() => transactions.filter(t => t.category === 'income' || t.category === 'allowance').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalSavings  = useMemo(() => transactions.filter(t => t.category === 'savings').reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);

  // Recent 5 transactions
  const recent = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [transactions]
  );

  // Active goals progress
  const topGoals = useMemo(
    () => [...goals].sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)).slice(0, 3),
    [goals]
  );

  // XP progress
  const xpInLevel = gamification.xp % XP_PER_LEVEL;
  const xpPct = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100));

  // Daily spending rate
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysPassed  = daysInMonth - daysLeft;
  const dailyAvg    = daysPassed > 0 ? spent / daysPassed : 0;
  const projectedTotal = dailyAvg * daysInMonth;

  const healthColor = health.category === 'good' ? 'text-neon-green' : health.category === 'fair' ? 'text-neon-amber' : 'text-neon-red';
  const healthBg    = health.category === 'good' ? 'bg-green-500/10 border-green-500/20' : health.category === 'fair' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';

  if (loading) return <DashboardSkeleton />;

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <ErrorBoundary>
      <div className="space-y-5 pb-6 max-w-2xl mx-auto md:max-w-none">

        {/* ── Greeting header ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">{getGreeting()}, <span className="text-white font-semibold">{firstName}</span> 👋</p>
              <h1 className="text-2xl font-black tracking-tight text-white">Your Financial Overview</h1>
              <p className="text-xs text-zinc-500 mt-0.5">{new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <Link href="/transactions">
              <Button size="sm" className="gap-1.5 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ── AI Coach Alert ── */}
        <AnimatePresence>
          {coachAlert && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="card border-primary/30 bg-primary/5 flex items-start gap-3"
            >
              <span className="text-xl">🤖</span>
              <p className="flex-1 text-sm text-zinc-200 leading-relaxed">{coachAlert}</p>
              <button onClick={dismissCoach} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Financial Health Score ── */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
          <div className={`card border ${healthBg} flex items-center gap-4`}>
            <div className="relative">
              <svg width="60" height="60" className="-rotate-90">
                <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <circle
                  cx="30" cy="30" r="24" fill="none"
                  stroke={health.category === 'good' ? '#00FF6A' : health.category === 'fair' ? '#FF9500' : '#FF3B5C'}
                  strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - health.score / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-black ${healthColor}`}
                style={{ transform: 'rotate(0deg)' }}>
                {health.score}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className={`h-4 w-4 ${healthColor}`} />
                <span className={`text-sm font-bold capitalize ${healthColor}`}>
                  Financial Health: {health.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{health.summary}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Monthly Budget Overview ── */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card card-glow-green"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-4 w-4 text-neon-red" />
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Monthly Budget Tracker</span>
            <span className="ml-auto text-xs text-zinc-500">{daysLeft} days left</span>
          </div>
          <BurnRateBar budget={MONTHLY_BUDGET} spent={spent} daysLeft={daysLeft} />
          {projectedTotal > MONTHLY_BUDGET && (
            <p className="mt-3 text-xs text-neon-red/80 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              At this rate you&apos;ll spend R{Math.round(projectedTotal).toLocaleString('en-ZA')} by month end — R{Math.round(projectedTotal - MONTHLY_BUDGET).toLocaleString('en-ZA')} over budget.
            </p>
          )}
          {projectedTotal <= MONTHLY_BUDGET && spent > 0 && (
            <p className="mt-3 text-xs text-neon-green/80 flex items-center gap-1.5">
              <TrendingDown className="h-3.5 w-3.5" />
              On track! Projected total: R{Math.round(projectedTotal).toLocaleString('en-ZA')} — well within budget. 🎉
            </p>
          )}
        </motion.section>

        {/* ── Quick stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <TrendingDown className="h-3.5 w-3.5 text-neon-red" /> Spent this month
            </div>
            <p className="text-2xl font-black text-neon-red">
              R{spent.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </p>
            {dailyAvg > 0 && <p className="text-[10px] text-zinc-500">R{Math.round(dailyAvg)}/day average</p>}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-neon-green" /> Budget remaining
            </div>
            <p className="text-2xl font-black text-neon-green">
              R{remaining.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </p>
            {daysLeft > 0 && <p className="text-[10px] text-zinc-500">R{Math.round(remaining / daysLeft)}/day to spend</p>}
          </motion.div>
          {totalIncome > 0 && (
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                <Wallet className="h-3.5 w-3.5 text-neon-blue" /> Income recorded
              </div>
              <p className="text-2xl font-black text-neon-blue">
                R{totalIncome.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
              </p>
              {totalIncome > 0 && <p className="text-[10px] text-zinc-500">{Math.round((spent / totalIncome) * 100)}% of income spent</p>}
            </motion.div>
          )}
          {totalSavings > 0 && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                <PiggyBank className="h-3.5 w-3.5 text-purple-400" /> Total saved
              </div>
              <p className="text-2xl font-black text-purple-400">
                R{totalSavings.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
              </p>
              {totalIncome > 0 && <p className="text-[10px] text-zinc-500">{Math.round((totalSavings / totalIncome) * 100)}% savings rate</p>}
            </motion.div>
          )}
        </div>

        {/* ── XP / Level panel ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card card-glow-gold"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-neon-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Your Progress</span>
            </div>
            <Link href="/trophy" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              Trophy Room <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-gold/20 to-neon-amber/20 border border-neon-gold/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-neon-gold" />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1">Level {gamification.level}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-neon-gold">{getPlayerTitle(gamification.level)}</span>
                <span className="text-zinc-500">{gamification.xp.toLocaleString()} XP</span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-gold to-neon-amber"
                  style={{ boxShadow: '0 0 8px rgba(255,215,0,0.5)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>{xpPct}% to Level {gamification.level + 1}</span>
                <span>{gamification.streak > 0 ? `🔥 ${gamification.streak}-day streak` : 'Start a streak!'}</span>
              </div>
            </div>
          </div>
          {gamification.dailyChallenge && (
            <div className="mt-3 p-2.5 bg-zinc-800/60 rounded-xl">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Daily Challenge</p>
              <p className="text-xs text-zinc-200">{gamification.dailyChallenge}</p>
            </div>
          )}
        </motion.section>

        {/* ── Active goals ── */}
        {topGoals.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Savings Goals</span>
              </div>
              <Link href="/goals" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                All goals <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {topGoals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                const daysToDeadline = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{goal.name}</span>
                      <span className="text-xs text-zinc-400">
                        R{goal.currentAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })} / R{goal.targetAmount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-neon-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>{pct}% complete</span>
                      <span>{daysToDeadline > 0 ? `${daysToDeadline} days left` : 'Overdue'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* ── Recent Transactions ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Recent Transactions</span>
            </div>
            <Link href="/transactions" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-4xl">💸</div>
              <p className="text-sm text-zinc-400">No transactions yet.</p>
              <p className="text-xs text-zinc-500">Start logging your spending to track where your money goes.</p>
              <Link href="/transactions">
                <Button size="sm" variant="outline" className="mt-2">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add First Transaction
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {recent.map((tx) => {
                const isIncome = tx.category === 'income' || tx.category === 'allowance';
                const emoji = categoryEmoji[tx.category] || '📦';
                return (
                  <li key={tx.id} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5 hover:bg-zinc-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-base">{emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">{tx.description}</p>
                        <p className="text-[10px] text-zinc-500 capitalize">{tx.category.replace(/-/g, ' ')} · {new Date(tx.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${isIncome ? 'text-neon-green' : 'text-neon-red'}`}>
                      {isIncome ? '+' : '-'}R{Math.abs(tx.amount).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.section>

        {/* ── Quick links ── */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <p className="section-label mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              { href: '/reports', icon: BarChart2, label: 'View Reports', color: 'text-primary', bg: 'bg-primary/10' },
              { href: '/goals', icon: Target, label: 'Manage Goals', color: 'text-green-400', bg: 'bg-green-500/10' },
              { href: '/vaults', icon: Heart, label: 'Dream Vaults', color: 'text-pink-400', bg: 'bg-pink-500/10' },
              { href: '/loans', icon: Wallet, label: 'Loan Tracker', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(({ href, icon: Icon, label, color, bg }) => (
              <Link key={href} href={href}>
                <div className="card card-hover flex items-center gap-3 cursor-pointer">
                  <div className={`p-2 rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{label}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-600 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </ErrorBoundary>
  );
}

