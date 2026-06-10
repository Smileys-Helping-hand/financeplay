import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  viewMode: 'client' | 'business';
  onViewModeChange: (mode: 'client' | 'business') => void;
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function Header({
  viewMode,
  onViewModeChange,
  onMenuClick,
  isMobile,
}: HeaderProps) {
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <header className="border-b border-white/[0.08] bg-gradient-to-b from-slate-900/40 to-slate-950/40 backdrop-blur-xl px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-300" />
            </motion.button>
          )}
          <div>
            <motion.h2
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {viewMode === 'client' ? 'Your Financial Overview' : 'Business Dashboard'}
            </motion.h2>
            <motion.p
              className="text-sm text-slate-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {new Date().toLocaleDateString('en-ZA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
          >
            {darkMode ? (
              <Moon className="w-5 h-5 text-slate-300" />
            ) : (
              <Sun className="w-5 h-5 text-slate-300" />
            )}
          </motion.button>

          {/* Quick Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            + Add Transaction
          </motion.button>
        </div>
      </div>
    </header>
  );
}
