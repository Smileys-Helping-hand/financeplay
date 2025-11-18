'use client';

import { ReactNode, useEffect } from 'react';
import { useFinanceStore } from '../lib/store';

export function Providers({ children }: { children: ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
