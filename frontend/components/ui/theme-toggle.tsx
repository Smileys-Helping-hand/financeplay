'use client';

import { Moon, Sun } from 'lucide-react';
import { useFinanceStore } from '../../lib/store';
import { Button } from './button';

export function ThemeToggle() {
  const theme = useFinanceStore((s) => s.theme);
  const toggle = useFinanceStore((s) => s.toggleTheme);
  return (
    <Button variant="outline" size="sm" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="ml-2 hidden md:inline">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </Button>
  );
}
