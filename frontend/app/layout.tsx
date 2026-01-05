import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { LayoutContent } from '../components/layout-content';

export const metadata = {
  title: 'FinancePlay',
  description: 'AI-powered personal finance planner and gamified budgeting platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
