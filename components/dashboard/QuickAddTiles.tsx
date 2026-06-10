import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuickAddTile {
  id: string;
  label: string;
  amount: string;
  icon: LucideIcon;
  color: 'purple' | 'pink' | 'blue' | 'amber' | 'cyan' | 'indigo';
}

interface QuickAddTilesProps {
  tiles: QuickAddTile[];
  onTileClick: (tile: QuickAddTile) => void;
}

const colorMap = {
  purple: { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', icon: 'text-purple-400', hover: 'group-hover:from-purple-500/30 group-hover:to-pink-500/30' },
  pink: { bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', icon: 'text-pink-400', hover: 'group-hover:from-pink-500/30 group-hover:to-rose-500/30' },
  blue: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', icon: 'text-blue-400', hover: 'group-hover:from-blue-500/30 group-hover:to-cyan-500/30' },
  amber: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', icon: 'text-amber-400', hover: 'group-hover:from-amber-500/30 group-hover:to-orange-500/30' },
  cyan: { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400', hover: 'group-hover:from-cyan-500/30 group-hover:to-blue-500/30' },
  indigo: { bg: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500/30', icon: 'text-indigo-400', hover: 'group-hover:from-indigo-500/30 group-hover:to-purple-500/30' },
};

export default function QuickAddTiles({ tiles, onTileClick }: QuickAddTilesProps) {
  return (
    <div className="mb-8">
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
        <h3 className="text-lg font-semibold text-white">Quick Add</h3>
        <span className="text-sm text-slate-500 ml-auto">Popular transactions</span>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          const colors = colorMap[tile.color];

          return (
            <motion.button
              key={tile.id}
              onClick={() => onTileClick(tile)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} ${colors.hover} backdrop-blur-sm p-4 transition-all duration-300 text-left`}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white rounded-xl blur-xl transition-opacity"
                initial={false}
              />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className={`w-10 h-10 rounded-lg bg-white/[0.08] flex items-center justify-center mb-3 group-hover:bg-white/[0.12] transition-colors`}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </motion.div>

                <p className="text-sm font-medium text-white line-clamp-2">
                  {tile.label}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {tile.amount}
                </p>
              </div>

              {/* Border accent */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                initial={false}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
