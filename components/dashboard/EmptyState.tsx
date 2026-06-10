import React from 'react';
import { motion } from 'framer-motion';
import { Archive, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No transactions yet',
  description = 'Start tracking your finances by adding your first transaction. It only takes a few seconds.',
  icon = <Archive className="w-16 h-16" />,
  actionLabel = 'Add Transaction',
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/20 to-slate-950/20 backdrop-blur-xl px-8 py-16 flex flex-col items-center justify-center min-h-96"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [-10, 10, -10],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Icon */}
      <motion.div
        className="relative z-10 mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/[0.08] flex items-center justify-center text-slate-400">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {icon}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 mb-8 leading-relaxed">{description}</p>

        {/* Action Button */}
        {onAction && (
          <motion.button
            onClick={onAction}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all group"
          >
            {actionLabel}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      {/* Decorative lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#grid)" />
      </svg>
    </motion.div>
  );
}
