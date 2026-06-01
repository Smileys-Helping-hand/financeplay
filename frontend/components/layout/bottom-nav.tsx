'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Vault, PlusCircle, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',   icon: Home },
  { href: '/vaults',      label: 'Vaults',       icon: Vault },
  { href: '/log',         label: 'Log Loot',     icon: PlusCircle },
  { href: '/trophy',      label: 'Trophy Room',  icon: Trophy },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900/95 border-t border-zinc-800 bottom-nav-safe backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all duration-150',
                active
                  ? 'text-neon-green'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-all',
                  active && 'drop-shadow-[0_0_6px_rgba(0,255,106,0.8)]'
                )}
              />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
