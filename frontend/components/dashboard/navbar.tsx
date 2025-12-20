'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart2, Goal, Home, PiggyBank, Settings, Sparkles, ArrowLeftRight, Wallet, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { useFinanceStore } from '../../lib/store';
import { clearUserId } from '../../lib/api';
import { Button } from '../ui/button';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/goals', label: 'Goals', icon: Goal },
  { href: '/bursaries', label: 'Bursaries', icon: PiggyBank },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const level = useFinanceStore((s) => s.gamification.level);
  const userName = useFinanceStore((s) => s.user?.name || '');
  
  const handleLogout = () => {
    clearUserId();
    router.push('/');
  };
  
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950/40 px-4 py-6 md:block">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <div className="font-semibold text-lg">XPFinance</div>
        </div>
        <div className="text-xs text-slate-400">
          {userName && <div className="font-medium text-white mb-1">Welcome, {userName}!</div>}
          <div>Level {level} Explorer</div>
        </div>
      </div>
      <nav className="space-y-2 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-slate-900',
                active ? 'bg-slate-900 text-white' : 'text-slate-300'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {href === '/reports' && <Badge label="New" className="ml-auto" />}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-slate-800">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-400 hover:text-slate-200"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
