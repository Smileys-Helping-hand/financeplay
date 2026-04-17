'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './dashboard/navbar';
import { BottomNav } from './layout/bottom-nav';
import { AiCoachPanel } from './coach/ai-coach-panel';
import { ThemeToggle } from './ui/theme-toggle';
import { ErrorBoundary } from './ui/error-boundary';
import { isAuthenticated } from '../lib/api';

const publicPaths = ['/', '/login', '/signup'];

export function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const isPublicPath = publicPaths.includes(pathname);
    const isAuth = isAuthenticated();
    setShowNav(!isPublicPath && isAuth);
  }, [pathname]);

  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Desktop sidebar */}
      {showNav && <Navbar />}

      {/* Page content */}
      <main
        className={`flex-1 p-4 pb-24 md:pb-6 ${!showNav ? 'max-w-7xl mx-auto' : ''}`}
      >
        {showNav && (
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
        )}
        {children}
      </main>

      {/* AI coach panel (desktop) */}
      {showNav && (
        <ErrorBoundary>
          <AiCoachPanel />
        </ErrorBoundary>
      )}

      {/* Mobile bottom nav */}
      {showNav && <BottomNav />}
    </div>
  );
}
