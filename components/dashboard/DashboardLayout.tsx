import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'client' | 'business'>('client');
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Aurora Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [-20, 20, -20],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            y: [30, 0, 30],
            x: [20, -20, 20],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            y: [-30, 0, -30],
            x: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        {!isMobile && <Sidebar viewMode={viewMode} onViewModeChange={setViewMode} />}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed left-0 top-0 h-screen w-72 z-50"
              >
                <Sidebar viewMode={viewMode} onViewModeChange={setViewMode} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            isMobile={isMobile}
          />
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
