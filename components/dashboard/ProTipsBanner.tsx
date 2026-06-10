import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ProTipsBannerProps {
  tips: Tip[];
}

export default function ProTipsBanner({ tips }: ProTipsBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  if (dismissed || tips.length === 0) return null;

  const currentTip = tips[currentTipIndex];

  return (
    <AnimatePresence>
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/40 flex items-center justify-center mt-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lightbulb className="w-6 h-6 text-emerald-400" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex-1"
            key={currentTip.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold text-emerald-300 mb-1">
              💡 {currentTip.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentTip.description}
            </p>

            {/* Pagination dots */}
            {tips.length > 1 && (
              <div className="flex items-center gap-2 mt-4">
                {tips.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTipIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentTipIndex
                        ? 'w-6 bg-emerald-400'
                        : 'w-1.5 bg-white/[0.2] hover:bg-white/[0.4]'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Close Button */}
          <motion.button
            onClick={() => setDismissed(true)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-slate-300" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
