'use client';

import { ReactNode, useEffect } from 'react';
import { useFinanceStore } from '../lib/store';
import { loadAllData } from '../lib/dataLoader';
import { isAuthenticated } from '../lib/api';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);
  const pathname = usePathname();
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load data from backend when authenticated
  useEffect(() => {
    if (isAuthenticated() && pathname !== '/setup' && pathname !== '/') {
      loadAllData().catch(err => {
        console.error('Failed to load initial data:', err);
      });
    }
  }, [pathname]);

  return <>{children}</>;
}
