import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from './Sparkline';

interface MetricCard {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ReactNode;
  color: 'emerald' | 'rose' | 'blue';
  data: number[];
}

interface MetricCardsProps {
  metrics: MetricCard[];
}

const colorMap = {
  emerald: {
    bg: 'from-emerald-500/10 to-cyan-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    trend: 'text-emerald-400',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  rose: {
    bg: 'from-rose-500/10 to-red-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    trend: 'text-rose-400',
    gradient: 'from-rose-500 to-red-500',
  },
  blue: {
    bg: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    trend: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
};

export default function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const colors = colorMap[metric.color];
        const TrendIcon =
          metric.trend === 'up' ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-xl p-6 transition-all cursor-pointer`}
          >
            {/* Animated gradient border on hover */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`}
              initial={false}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-slate-400">
                  {metric.label}
                </span>
                <motion.div
                  className={`p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]`}
                  whileHover={{ scale: 1.1 }}
                >
                  {metric.icon}
                </motion.div>
              </div>

              {/* Value */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <p className="text-4xl font-bold text-white font-mono tracking-tight">
                  R{metric.value.toLocaleString('en-ZA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </motion.div>

              {/* Sparkline Chart */}
              <div className="mb-4 h-12">
                <Sparkline data={metric.data} color={metric.color} />
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <TrendIcon className={`w-4 h-4 ${colors.trend}`} />
                <span className={`text-sm font-medium ${colors.trend}`}>
                  {metric.trendValue}
                </span>
                <span className="text-xs text-slate-500">this month</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
