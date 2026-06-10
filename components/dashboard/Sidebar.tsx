import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Wallet,
  Send,
  Target,
  Zap,
  GraduationCap,
  Leaf,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  viewMode: 'client' | 'business';
  onViewModeChange: (mode: 'client' | 'business') => void;
}

export default function Sidebar({ viewMode, onViewModeChange }: SidebarProps) {
  const router = useRouter();

  const clientNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Accounts', icon: Wallet, href: '/accounts' },
    { label: 'Transactions', icon: Send, href: '/transactions' },
    { label: 'Goals', icon: Target, href: '/goals' },
    { label: 'Loans & Debt', icon: Zap, href: '/loans-debt' },
    { label: 'Bursaries', icon: GraduationCap, href: '/bursaries' },
  ];

  const businessNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Invoicing', icon: Send, href: '/invoicing' },
    { label: 'Payroll', icon: Wallet, href: '/payroll' },
    { label: 'Tax & VAT', icon: BarChart3, href: '/tax-vat' },
    { label: 'Vendor Tracking', icon: Zap, href: '/vendors' },
    { label: 'Client Billing', icon: Target, href: '/client-billing' },
  ];

  const commonNavItems = [
    { label: 'Finance Guide', icon: BookOpen, href: '/finance-guide' },
    { label: 'Islamic Finance', icon: Leaf, href: '/islamic-finance' },
    { label: 'Reports', icon: BarChart3, href: '/reports', badge: 'New' },
  ];

  const navItems = viewMode === 'client' ? clientNavItems : businessNavItems;
  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-slate-900/40 to-slate-950/40 backdrop-blur-xl border-r border-white/[0.08] flex flex-col">
      {/* Logo Section */}
      <motion.div
        className="p-6 border-b border-white/[0.08]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            XPFinance
          </h1>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        className="px-6 py-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/[0.08] rounded-xl mx-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            M
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-slate-300">Welcome back!</p>
            <p className="text-base font-semibold text-white">mraaziqp</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Level 1 Explorer</span>
            <span className="text-xs font-mono text-emerald-400">0 XP</span>
          </div>
          <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: '0%' }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div
        className="px-4 py-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2 p-1 bg-white/[0.05] rounded-lg border border-white/[0.08]">
          {(['client', 'business'] as const).map((mode) => (
            <motion.button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                viewMode === mode
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {mode === 'client' ? 'Personal' : 'Business'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href}>
                <motion.a
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden group ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg"
                      transition={{ type: 'spring', damping: 20 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-sm font-medium relative z-10">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-2 py-1 bg-gradient-to-r from-emerald-500/40 to-cyan-500/40 text-emerald-300 rounded-full font-semibold border border-emerald-500/40 relative z-10">
                      {item.badge}
                    </span>
                  )}
                </motion.a>
              </Link>
            </motion.div>
          );
        })}

        {/* Common Items Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-white/0 via-white/[0.08] to-white/0" />

        {commonNavItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (navItems.length + index) * 0.05 }}
            >
              <Link href={item.href}>
                <motion.a
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden group ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg"
                      transition={{ type: 'spring', damping: 20 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-sm font-medium relative z-10">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-2 py-1 bg-gradient-to-r from-emerald-500/40 to-cyan-500/40 text-emerald-300 rounded-full font-semibold border border-emerald-500/40 relative z-10">
                      {item.badge}
                    </span>
                  )}
                </motion.a>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <motion.div
        className="border-t border-white/[0.08] px-4 py-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/settings">
          <motion.a
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </motion.a>
        </Link>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
