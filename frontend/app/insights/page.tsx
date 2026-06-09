'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { containerVariants, itemVariants, sectionVariants } from '@/lib/animations';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    title: 'Estate Planning Essentials for High-Net-Worth Families',
    excerpt: 'A comprehensive guide to protecting your legacy and minimizing taxes for your heirs.',
    category: 'Estate Planning',
    date: 'June 5, 2025',
    readTime: '8 min read',
  },
  {
    title: 'Retirement Planning in Uncertain Times',
    excerpt: 'How to build a resilient retirement strategy that adapts to market changes.',
    category: 'Retirement',
    date: 'May 28, 2025',
    readTime: '6 min read',
  },
  {
    title: 'Tax-Efficient Investing Strategies',
    excerpt: 'Maximize returns by understanding tax-loss harvesting and strategic asset location.',
    category: 'Tax Planning',
    date: 'May 21, 2025',
    readTime: '7 min read',
  },
  {
    title: 'Protecting Your Wealth from Liability',
    excerpt: 'Asset protection strategies for business owners and high-net-worth individuals.',
    category: 'Wealth Preservation',
    date: 'May 15, 2025',
    readTime: '9 min read',
  },
  {
    title: 'The Multi-Generational Wealth Conversation',
    excerpt: 'How to discuss money, values, and expectations with your family.',
    category: 'Family Planning',
    date: 'May 8, 2025',
    readTime: '10 min read',
  },
  {
    title: 'Investment Fundamentals for Wealth Building',
    excerpt: 'Core principles for building a diversified, balanced investment portfolio.',
    category: 'Investing',
    date: 'April 30, 2025',
    readTime: '8 min read',
  },
];

export default function InsightsPage() {
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
            Insights & Resources
          </motion.h1>
          <motion.p variants={itemVariants} className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            Market perspectives, planning strategies, and wealth insights tailored for South African families
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-3 justify-center mb-12"
        >
          {['All', 'Estate Planning', 'Retirement', 'Tax Planning', 'Investing'].map((filter) => (
            <Button
              key={filter}
              variant={filter === 'All' ? 'primary' : 'secondary'}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {articles.map((article, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full flex flex-col hover:shadow-elevation-3 cursor-pointer group">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-hierarchy-5 group-hover:bg-hierarchy-4 transition-colors" />

                <CardHeader>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="inline-block px-3 py-1 bg-muted-gold/10 text-muted-gold text-caption font-semibold rounded">
                      {article.category}
                    </span>
                    <span className="text-caption text-hierarchy-3">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-h3 group-hover:text-slate-blue transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  <p className="text-body text-hierarchy-2 mb-6 flex-grow">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-hierarchy-3">{article.date}</span>
                    <ArrowRight className="w-5 h-5 text-slate-blue group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter CTA */}
        <motion.section
          className="bg-heritage-navy rounded-md p-12 text-center text-cream-ivory"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={itemVariants} className="text-h2 font-playfair font-bold mb-4">
            Stay Updated with Our Latest Insights
          </motion.h2>
          <motion.p variants={itemVariants} className="text-body-lg text-cream-ivory/90 mb-8">
            Subscribe to receive wealth planning tips and market perspectives delivered to your inbox.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 bg-cream-ivory text-heritage-navy rounded text-base font-inter focus:outline-none focus:ring-4 focus:ring-muted-gold/20"
            />
            <Button variant="primary" size="default">
              Subscribe
            </Button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
