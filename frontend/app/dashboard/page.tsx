"use client";

import { useEffect, useMemo, useState } from 'react';
import { useFinanceStore, getMonthlySpent, getBurnRateRemaining } from '../../lib/store';
import { MONTHLY_BUDGET } from '../../lib/config';
import { BurnRateBar } from '../../components/dashboard/burn-rate-bar';
import { ExperiencePanel } from '../../components/gamification/experience';
import { Skeleton } from '../../components/ui/skeleton';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { Zap, TrendingDown, TrendingUp, Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoachAlert } from '../../lib/useCoachAlert';

function getDaysLeftInMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
}

const DashboardSkeleton = () => (
  <div className="space-y-5">
    <Skeleton className="h-10 w-48" />
    <Skeleton className="h-40 w-full" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const transactions = useFinanceStore((s) => s.transactions);
  const gamification = useFinanceStore((s) => s.gamification);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const spent     = useMemo(() => getMonthlySpent(transactions), [transactions]);
  const remaining = useMemo(() => getBurnRateRemaining(transactions), [transactions]);
  const daysLeft  = getDaysLeftInMonth();
  const { alert: coachAlert, dismiss: dismissCoach } = useCoachAlert();

  // Recent 5 transactions for activity feed
  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions]
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <ErrorBoundary>
      <div className="space-y-6 pb-6">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              <span className="text-neon-green">Finance</span>Play
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Neo-Banking Arcade · {new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5">
            <Zap className="h-4 w-4 text-neon-gold" />
            <span className="text-sm font-bold text-neon-gold">{gamification.xp} XP</span>
          </div>
        </motion.div>

        {/* ── AI Coach Alert ── */}
        <AnimatePresence>
          {coachAlert && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="card border-neon-red/40 bg-neon-red/5 flex items-start gap-3"
            >
              <span className="text-2xl">🤖</span>
              <p className="flex-1 text-sm text-zinc-200 leading-relaxed">{coachAlert}</p>
              <button onClick={dismissCoach} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── THE BURN RATE – Hero Element ── */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card card-glow-green"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-neon-red" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">The Burn Rate</h2>
          </div>
          <BurnRateBar
            budget={MONTHLY_BUDGET}
            spent={spent}
            daysLeft={daysLeft}
          />
        </motion.section>

        {/* ── Quick stats row ── */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <TrendingDown className="h-3.5 w-3.5" /> Spent this month
            </div>
            <p className="text-xl font-black text-neon-red">
              R{spent.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <TrendingUp className="h-3.5 w-3.5" /> Remaining
            </div>
            <p className="text-xl font-black text-neon-green">
              R{remaining.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </p>
          </motion.div>
        </div>

        {/* ── XP / Level panel ── */}
        <ExperiencePanel />

        {/* ── Recent Activity ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">Recent Loot</h2>
          {recent.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">No transactions yet. Start logging loot!</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">{tx.description}</p>
                    <p className="text-xs text-zinc-500">{tx.category} · {tx.date.slice(0, 10)}</p>
                  </div>
                  <span className="text-sm font-bold text-neon-red">
                    -R{tx.amount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </ErrorBoundary>
  );
}
