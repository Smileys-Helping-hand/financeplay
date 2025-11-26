import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { Navbar } from '../components/dashboard/navbar';
import { AiCoachPanel } from '../components/coach/ai-coach-panel';
import { ThemeToggle } from '../components/ui/theme-toggle';
import { ErrorBoundary } from '../components/ui/error-boundary';
import { GlobalActions } from '../components/global-actions';

export const metadata = {
  title: 'FinancePlay',
  description: 'AI-powered personal finance planner and gamified budgeting platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-6 pb-24 md:pb-10">
              <div className="flex justify-end mb-4">
                <ThemeToggle />
              </div>
              {children}
            </main>
          </div>
          <GlobalActions />
          <ErrorBoundary>
            <AiCoachPanel />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
