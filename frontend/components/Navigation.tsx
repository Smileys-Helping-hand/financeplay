'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Insights', href: '/insights' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-heritage-navy z-50 shadow-elevation-2">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="h-10 w-auto text-cream-ivory font-playfair font-bold text-h3">
              FWC
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-cream-ivory font-inter font-medium rounded text-body hover:bg-white/10 transition-colors duration-150 border-b-2 border-transparent hover:border-muted-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="sm"
              asChild
              className="hidden lg:inline-flex"
            >
              <Link href="/book-call">Book a Call</Link>
            </Button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden text-cream-ivory p-2"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              className="md:hidden bg-heritage-navy border-t border-white/10 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-2 text-cream-ivory font-inter font-medium rounded hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="primary"
                  size="sm"
                  asChild
                  className="w-full mt-4"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Link href="/book-call">Book a Call</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
