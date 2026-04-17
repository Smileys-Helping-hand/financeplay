'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore, getPlayerTitle, XP_AWARDS, getMonthlySpent, levelFromXp } from '../../lib/store';
import { MONTHLY_BUDGET, XP_PER_LEVEL } from '../../lib/config';
import { cn } from '../../lib/utils';
import type { Transaction, Gamification } from '../../lib/types';

// ── Badge definitions ─────────────────────────────────────────────────────

interface TrophyBadge {
  id: string;
  icon: string;
  name: string;
  description: string;
  xpReward: number;
  check: (data: BadgeCheckData) => boolean;
}

interface BadgeCheckData {
  transactions: Transaction[];
  gamification: Gamification;
  xp: number;
}

function getBurnRateRemaining(transactions: Transaction[]): number {
  return Math.max(0, MONTHLY_BUDGET - getMonthlySpent(transactions));
}

const BADGES: TrophyBadge[] = [
  {
    id: 'spartan',
    icon: '🛡️',
    name: 'The Spartan',
    description: 'End the month with > 20% of your Burn Rate remaining.',
    xpReward: 500,
    check: ({ transactions }) => {
      const remaining = getBurnRateRemaining(transactions);
      return remaining / MONTHLY_BUDGET > 0.2;
    },
  },
  {
    id: 'vault-hunter',
    icon: '🚀',
    name: 'Vault Hunter',
    description: 'Fully fund a Dream Vault over R5,000.',
    xpReward: 300,
    // Stub: would check DreamVault store in production
    check: () => false,
  },
  {
    id: 'iceberg',
    icon: '🧊',
    name: 'The Iceberg',
    description: 'Go 3 days in a row without logging a discretionary expense.',
    xpReward: 150,
    check: ({ transactions }) => {
      const skip = new Set(['income', 'allowance', 'savings']);
      const sorted = [...transactions]
        .filter((t: Transaction) => !skip.has(t.category))
        .map((t) => t.date.slice(0, 10))
        .sort((a, b) => b.localeCompare(a));
      if (sorted.length === 0) return true;
      const today = new Date();
      for (let i = 0; i < 3; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        if (sorted.includes(key)) return false;
      }
      return true;
    },
  },
  {
    id: 'first-log',
    icon: '📝',
    name: 'First Loot',
    description: 'Log your very first expense.',
    xpReward: 50,
    check: ({ transactions }) => transactions.length > 0,
  },
  {
    id: 'century',
    icon: '💯',
    name: 'Century Club',
    description: 'Log 100 expenses total.',
    xpReward: 200,
    check: ({ transactions }) => transactions.filter((t) => t.category !== 'income').length >= 100,
  },
  {
    id: 'high-roller',
    icon: '🎰',
    name: 'Reformed High Roller',
    description: 'Spend under your Burn Rate for 2 months running.',
    xpReward: 750,
    check: () => false, // multi-month history needed
  },
];

// ── XP progress helper ────────────────────────────────────────────────────

function xpProgressInLevel(xp: number) {
  const lvlXp = xp % XP_PER_LEVEL;
  return { current: lvlXp, max: XP_PER_LEVEL, pct: Math.round((lvlXp / XP_PER_LEVEL) * 100) };
}

// ── XP breakdown items ────────────────────────────────────────────────────

const XP_BREAKDOWN = [
  { icon: '📝', action: 'Log an expense',              reward: `+${XP_AWARDS.LOG_EXPENSE} XP`  },
  { icon: '🏦', action: 'Hit a savings milestone',     reward: `+${XP_AWARDS.SAVINGS_MILESTONE} XP`  },
  { icon: '🏆', action: 'End month under Burn Rate',   reward: `+${XP_AWARDS.MONTH_UNDER_BUDGET} XP` },
];

// ── Trophy Room Page ──────────────────────────────────────────────────────

export default function TrophyPage() {
  const rawTransactions = useFinanceStore((s) => s.transactions);
  const gamification = useFinanceStore((s) => s.gamification);
  const { level, xp } = gamification;
  const title = getPlayerTitle(level);
  const { current: lvlXp, max: lvlMax, pct: lvlPct } = xpProgressInLevel(xp);

  const badgeData = useMemo<(TrophyBadge & { unlocked: boolean })[]>(
    () => {
      const transactions = rawTransactions ?? [];
      return BADGES.map((b) => ({
        ...b,
        unlocked: b.check({ transactions, gamification, xp }),
      }));
    },
    [rawTransactions, gamification, xp]
  );

  const unlockedCount = badgeData.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Trophy <span className="text-neon-gold">Room</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Your financial hall of fame.</p>
      </div>

      {/* Player Level card ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card card-glow-gold"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">Player Rank</p>
            <p className="text-3xl font-black text-neon-gold">Level {level}</p>
            <p className="text-base font-bold text-white mt-0.5">{title}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Total XP</p>
            <p className="text-2xl font-black text-white">{xp.toLocaleString('en-ZA')}</p>
          </div>
        </div>

        {/* XP bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Level {level}</span>
            <span>{lvlXp} / {lvlMax} XP</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-neon-gold bar-pulse-green"
              initial={{ width: 0 }}
              animate={{ width: `${lvlPct}%` }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: 'linear-gradient(90deg, #FFD700, #FF9500)' }}
            />
          </div>
          <p className="text-xs text-zinc-500 text-right">{lvlMax - lvlXp} XP to Level {level + 1}</p>
        </div>
      </motion.div>

      {/* XP Breakdown ── */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-3">How to Earn XP</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {XP_BREAKDOWN.map((item) => (
            <div key={item.action} className="card flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-zinc-400">{item.action}</p>
                <p className="text-sm font-black text-neon-green">{item.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badges ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Badges</h2>
          <span className="text-xs text-zinc-500">{unlockedCount}/{BADGES.length} unlocked</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {badgeData.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                'card flex items-start gap-4 transition-all',
                badge.unlocked
                  ? 'card-glow-gold'
                  : 'opacity-50 grayscale'
              )}
            >
              <span className="text-4xl mt-0.5">{badge.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={cn('font-black text-base', badge.unlocked ? 'text-neon-gold' : 'text-zinc-500')}>
                  {badge.name}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{badge.description}</p>
                <p className="text-xs font-bold text-neon-green mt-1">+{badge.xpReward} XP</p>
              </div>
              {badge.unlocked && (
                <span className="text-xs bg-neon-gold/10 border border-neon-gold/30 text-neon-gold px-2 py-0.5 rounded-full font-bold shrink-0">
                  Earned
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
