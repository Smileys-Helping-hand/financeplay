'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, PieChart, TrendingUp, DollarSign, Heart } from 'lucide-react';
import { containerVariants, itemVariants, sectionVariants } from '../../lib/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

const services = [
  {
    icon: PieChart,
    title: 'Estate Planning',
    description: "Structured succession plans that preserve your family's legacy and minimize taxes.",
    href: '/services/estate-planning',
  },
  {
    icon: TrendingUp,
    title: 'Retirement Planning',
    description: 'Personalized strategies to secure your retirement and maintain your lifestyle.',
    href: '/services/retirement',
  },
  {
    icon: BarChart3,
    title: 'Investment Management',
    description: 'Strategic portfolio management aligned with your goals and risk tolerance.',
    href: '/services/investments',
  },
  {
    icon: DollarSign,
    title: 'Tax Optimization',
    description: 'Efficient tax strategies that legally minimize your liability.',
    href: '/services/tax',
  },
  {
    icon: Heart,
    title: 'Wealth Preservation',
    description: 'Protecting and growing your assets for future generations.',
    href: '/services/preservation',
  },
];

export function ServicesSection() {
  return (
    <section className="bg-cream-ivory py-20 lg:py-32 px-6 lg:px-12">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-center mb-16">
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-4">
            Our Integrated Wealth Management Approach
          </h2>
          <p className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            Comprehensive strategies designed for families like yours
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full flex flex-col hover:shadow-elevation-3">
                  <CardHeader>
                    <Icon className="w-10 h-10 text-muted-gold mb-3" strokeWidth={1.5} />
                    <CardTitle className="text-h3">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-body-sm text-hierarchy-2 mb-4 flex-grow">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      className="text-slate-blue font-inter font-semibold text-body-sm hover:text-heritage-navy transition-colors"
                    >
                      Learn More →
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
