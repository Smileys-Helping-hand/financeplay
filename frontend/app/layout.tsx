import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../components/providers';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export const metadata = {
  title: 'Family Wealth Custodians - Wealth Management & Estate Planning',
  description: 'Expert retirement planning, estate management, and wealth preservation for South African families.',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent' }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Family Wealth Custodians" />
        <meta name="theme-color" content="#1A2332" />
      </head>
      <body className="min-h-screen bg-cream-ivory text-hierarchy-1 overflow-x-hidden">
        <Providers>
          <Navigation />
          <main className="pt-18">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
