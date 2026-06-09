'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { containerVariants, itemVariants, sectionVariants } from '@/lib/animations';
import { PieChart, TrendingUp, BarChart3, DollarSign, Heart } from 'lucide-react';

const services = [
  {
    icon: PieChart,
    title: 'Estate Planning',
    description: "Structured succession plans that preserve your family's legacy and minimize taxes.",
    details: [
      'Will & trust structuring',
      'Probate avoidance strategies',
      'Multi-generational planning',
      'Asset protection',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Retirement Planning',
    description: 'Personalized strategies to secure your retirement and maintain your lifestyle.',
    details: [
      'Income projections',
      'Pension optimization',
      'Tax-efficient withdrawals',
      'Longevity planning',
    ],
  },
  {
    icon: BarChart3,
    title: 'Investment Management',
    description: 'Strategic portfolio management aligned with your goals and risk tolerance.',
    details: [
      'Personalized asset allocation',
      'Rebalancing & monitoring',
      'Risk management',
      'Global diversification',
    ],
  },
  {
    icon: DollarSign,
    title: 'Tax Optimization',
    description: 'Efficient tax strategies that legally minimize your liability.',
    details: [
      'Tax-loss harvesting',
      'Strategic giving',
      'Retirement account optimization',
      'International tax planning',
    ],
  },
  {
    icon: Heart,
    title: 'Wealth Preservation',
    description: 'Protecting and growing your assets for future generations.',
    details: [
      'Insurance strategies',
      'Liability protection',
      'Asset structuring',
      'Legacy planning',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream-ivory pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-h1 font-playfair font-bold text-heritage-navy mb-4">
            Our Services
          </motion.h1>
          <motion.p variants={itemVariants} className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            Comprehensive wealth management solutions designed for families like yours
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20"
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
                    <p className="text-body-sm text-hierarchy-2 mb-4 flex-grow">{service.description}</p>
                    <ul className="text-caption text-hierarchy-2 space-y-1 mb-4">
                      {service.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-muted-gold mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Process Section */}
        <motion.section
          className="mb-20"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-12 text-center">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Assessment', desc: 'Understand your goals and situation' },
              { num: '2', title: 'Strategy', desc: 'Develop tailored recommendations' },
              { num: '3', title: 'Implementation', desc: 'Execute your wealth plan' },
              { num: '4', title: 'Monitoring', desc: 'Review and adjust as needed' },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-off-white-linen border border-champagne-beige rounded-md p-6 text-center"
              >
                <div className="text-4xl font-playfair font-bold text-muted-gold mb-3">{step.num}</div>
                <h3 className="text-h3 font-semibold text-heritage-navy mb-2">{step.title}</h3>
                <p className="text-body-sm text-hierarchy-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.div
          className="bg-heritage-navy rounded-md p-12 text-center text-cream-ivory"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={itemVariants} className="text-h2 font-playfair font-bold mb-4">
            {`Let's Find the Right Solution for Your Family`}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-body-lg text-cream-ivory/90 mb-8">
            Schedule a free consultation to discuss which services are right for you.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button variant="primary" size="lg" asChild>
              <Link href="/book-call">Book Your Exploration Call</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
