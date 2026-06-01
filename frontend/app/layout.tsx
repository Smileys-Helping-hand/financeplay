import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { LayoutContent } from '../components/layout-content';

export const metadata = {
  title: 'FinancePlay',
  description: 'AI-powered personal finance planner and gamified budgeting platform',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FinancePlay" />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
