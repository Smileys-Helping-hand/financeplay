'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface BurnRateBarProps {
  /** Total discretionary budget for the month (e.g. 3000) */
  budget: number;
  /** Amount already spent */
  spent: number;
  /** Days remaining in the month */
  daysLeft: number;
}

export function BurnRateBar({ budget, spent, daysLeft }: BurnRateBarProps) {
  const remaining = Math.max(0, budget - spent);
  const pct = budget > 0 ? (remaining / budget) * 100 : 0;
  const safePerDay = daysLeft > 0 ? remaining / daysLeft : 0;

  const { barColor, glowClass, statusLabel, statusColor } = useMemo(() => {
    if (pct > 49) {
      return {
        barColor: 'bg-neon-green',
        glowClass: 'bar-pulse-green',
        statusLabel: 'Stamina: High',
        statusColor: 'text-neon-green',
      };
    } else if (pct >= 20) {
      return {
        barColor: 'bg-neon-amber',
        glowClass: '',
        statusLabel: 'Stamina: Depleting',
        statusColor: 'text-neon-amber',
      };
    } else {
      return {
        barColor: 'bg-neon-red',
        glowClass: 'bar-pulse-red',
        statusLabel: '⚠ Critical – Slow Down',
        statusColor: 'text-neon-red',
      };
    }
  }, [pct]);

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-0.5">Monthly Play Money</p>
          <p className={cn('text-2xl font-black', statusColor)}>{statusLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">
            R{remaining.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-zinc-500">of R{budget.toLocaleString('en-ZA')} left</p>
        </div>
      </div>

      {/* The Bar */}
      <div className="relative h-6 w-full rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', barColor, glowClass)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(pct, 0.5)}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Percentage label inside bar */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold mix-blend-overlay text-white">
          {Math.round(pct)}%
        </span>
      </div>

      {/* Safe-to-spend metric */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 py-3 px-4">
        <span className="text-zinc-400 text-sm">Safe to spend:</span>
        <span className="text-xl font-black text-white">
          R{safePerDay.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
        </span>
        <span className="text-zinc-400 text-sm">/ day for {daysLeft} more days</span>
      </div>
    </div>
  );
}
