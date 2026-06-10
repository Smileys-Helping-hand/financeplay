import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SparklineProps {
  data: number[];
  color: 'emerald' | 'rose' | 'blue';
}

const colorMap = {
  emerald: { stroke: '#10b981', fill: '#10b98120' },
  rose: { stroke: '#f43f5e', fill: '#f43f5e20' },
  blue: { stroke: '#3b82f6', fill: '#3b82f620' },
};

export default function Sparkline({ data, color }: SparklineProps) {
  const width = 100;
  const height = 48;
  const padding = 4;

  const points = useMemo(() => {
    if (!data || data.length === 0) return [];

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const xStep = (width - padding * 2) / (data.length - 1 || 1);

    return data.map((value, i) => ({
      x: padding + i * xStep,
      y: height - padding - ((value - min) / range) * (height - padding * 2),
    }));
  }, [data, width, height, padding]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';

    const path = points
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return path;
  }, [points]);

  const areaPathD = useMemo(() => {
    if (points.length === 0) return '';

    const path =
      pathD +
      ` L ${points[points.length - 1]?.x ?? 0} ${height} L ${padding} ${height} Z`;

    return path;
  }, [pathD, points, height, padding]);

  const colors = colorMap[color];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area Fill */}
      <motion.path
        d={areaPathD}
        fill={`url(#gradient-${color})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Line */}
      <motion.path
        d={pathD}
        stroke={colors.stroke}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* End Point Dot */}
      {points.length > 0 && (
        <motion.circle
          cx={points[points.length - 1]?.x ?? 0}
          cy={points[points.length - 1]?.y ?? 0}
          r="2"
          fill={colors.stroke}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        />
      )}
    </svg>
  );
}
