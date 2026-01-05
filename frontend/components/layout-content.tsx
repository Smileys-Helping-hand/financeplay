'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './dashboard/navbar';
import { AiCoachPanel } from './coach/ai-coach-panel';
import { ThemeToggle } from './ui/theme-toggle';
import { ErrorBoundary } from './ui/error-boundary';
import { isAuthenticated } from '../lib/api';

const publicPaths = ['/', '/login', '/signup'];

export function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    // Show navbar only if user is authenticated and not on public pages
    const isPublicPath = publicPaths.includes(pathname);
    const isAuth = isAuthenticated();
    setShowNav(!isPublicPath && isAuth);
  }, [pathname]);

  // For public pages (login, signup, landing)
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // For authenticated pages
  return (
    <div className="flex min-h-screen">
      {showNav && <Navbar />}
      <main className={`flex-1 p-6 pb-24 md:pb-10 ${!showNav ? 'max-w-7xl mx-auto' : ''}`}>
        {showNav && (
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
        )}
        {children}
      </main>
      {showNav && (
        <ErrorBoundary>
          <AiCoachPanel />
        </ErrorBoundary>
      )}
    </div>
  );
}
