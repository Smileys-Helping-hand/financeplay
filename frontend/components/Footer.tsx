import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-heritage-navy text-cream-ivory">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="font-playfair font-bold text-h3 mb-4">
              Family Wealth Custodians
            </div>
            <p className="text-body-sm text-cream-ivory/80 mb-6">
              Expert wealth management, estate planning, and retirement strategies for South African families.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter font-semibold text-body mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                { label: 'Estate Planning', href: '/services/estate-planning' },
                { label: 'Retirement Planning', href: '/services/retirement' },
                { label: 'Investment Management', href: '/services/investments' },
                { label: 'Tax Optimization', href: '/services/tax' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-cream-ivory/70 hover:text-muted-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-inter font-semibold text-body mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Team', href: '/team' },
                { label: 'Insights', href: '/insights' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-cream-ivory/70 hover:text-muted-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-inter font-semibold text-body mb-4">Contact</h4>
            <div className="space-y-4">
              <a
                href="mailto:info@familywealthcustodians.co.za"
                className="flex items-center gap-2 text-body-sm text-cream-ivory/70 hover:text-muted-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@fwc.co.za</span>
              </a>
              <a
                href="tel:+27218883388"
                className="flex items-center gap-2 text-body-sm text-cream-ivory/70 hover:text-muted-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+27 (0)21 888 3388</span>
              </a>
              <div className="flex items-start gap-2 text-body-sm text-cream-ivory/70">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Paarl, South Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-champagne-beige/30 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between text-body-sm text-cream-ivory/60">
          <p>&copy; {currentYear} Family Wealth Custodians. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-muted-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-muted-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-muted-gold transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
