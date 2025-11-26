'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  value: number;
  label?: string;
  className?: string;
}

export function ProgressRing({ size = 120, strokeWidth = 10, value, label, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      <svg width={size} height={size} className="rotate-[-90deg] drop-shadow-sm">
        <circle stroke="#1f2937" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
        <motion.circle
          stroke="url(#progress-gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      {label && <p className="mt-2 text-sm text-slate-200">{label}</p>}
    </div>
  );
}
