'use client';

import { Flame, Medal, Sparkles, Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { useFinanceStore, levelFromXp } from '../../lib/store';
import { Badge } from '../ui/badge';
import { ProgressRing } from '../ui/progress-ring';
import { motion, AnimatePresence } from 'framer-motion';

export function ExperiencePanel() {
  const gamification = useFinanceStore((s) => s.gamification);
  const nextLevelXp = (levelFromXp(gamification.xp) + 1) * 500;
  const progress = Math.min(100, Math.round((gamification.xp / nextLevelXp) * 100));

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Gamification</p>
          <p className="text-lg font-semibold">Level {gamification.level} Pathfinder</p>
        </div>
        <Star className="h-5 w-5 text-primary" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Streak {gamification.streak} days</span>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-emerald-400" />
            <span>Daily: {gamification.dailyChallenge}</span>
          </div>
        </div>
        <ProgressRing value={progress} label={`${progress}%`} className="scale-90" />
      </div>
      <div className="space-y-2">
        <Progress value={progress} />
        <div className="text-xs text-slate-400">{gamification.xp} XP · {nextLevelXp - gamification.xp} XP to next level</div>
      </div>
      <AnimatePresence>
        {gamification.lastXpGain && (
          <motion.div
            key={gamification.lastXpGain}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-sm text-emerald-300"
          >
            <Sparkles className="h-4 w-4" /> You earned +{gamification.lastXpGain} XP!
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-wrap gap-2 pt-2">
        {[...gamification.badges, 'Budget Master', 'Savings Hero', 'Streak Legend'].map((badge) => (
          <Badge key={badge} label={badge} className="bg-secondary/10 text-secondary" />
        ))}
      </div>
    </Card>
  );
}
