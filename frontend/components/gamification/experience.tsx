'use client';

import { Flame, Medal, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore, levelFromXp, getPlayerTitle, XP_AWARDS } from '../../lib/store';
import { XP_PER_LEVEL } from '../../lib/config';
import { cn } from '../../lib/utils';

export function ExperiencePanel() {
  const gamification = useFinanceStore((s) => s.gamification);
  const { xp, level, streak, dailyChallenge, lastXpGain, badges } = gamification;

  // XP progress within the current level (0–100%)
  const xpInLevel  = xp % XP_PER_LEVEL;
  const pct        = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100));
  const xpToNext   = XP_PER_LEVEL - xpInLevel;

  const progressColor =
    pct > 66 ? '#00FF6A' : pct > 33 ? '#00D4FF' : '#6F7CFF';

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Player Rank</p>
          <p className="text-base font-black text-white">
            Level {level}{' '}
            <span className="text-neon-gold">{getPlayerTitle(level)}</span>
          </p>
        </div>
        <Star className="h-5 w-5 text-neon-gold drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]" />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Flame className={cn('h-4 w-4', streak > 0 ? 'text-neon-red' : 'text-zinc-600')} />
          <span><span className="font-bold text-white">{streak}</span> day streak</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <Medal className="h-4 w-4 text-neon-blue" />
          <span className="truncate">{dailyChallenge}</span>
        </div>
      </div>

      {/* XP bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: progressColor, boxShadow: `0 0 8px ${progressColor}` }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>{xp.toLocaleString()} XP total</span>
          <span>{xpToNext} XP to Level {level + 1}</span>
        </div>
      </div>

      {/* XP gain toast */}
      <AnimatePresence>
        {lastXpGain && (
          <motion.div
            key={lastXpGain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-sm font-bold text-neon-green"
          >
            <Sparkles className="h-4 w-4" /> +{lastXpGain} XP earned!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge chips */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Suppress unused-import warning for XP_AWARDS (used indirectly via constants)
void XP_AWARDS;
