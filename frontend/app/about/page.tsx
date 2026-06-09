'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { containerVariants, itemVariants, sectionVariants } from '@/lib/animations';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-ivory pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero */}
        <motion.div
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-h1 font-playfair font-bold text-heritage-navy mb-4">
            About Family Wealth Custodians
          </motion.h1>
          <motion.p variants={itemVariants} className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            Trusted by families across South Africa for over 25 years
          </motion.p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          className="mb-20"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-hierarchy-5 rounded-md h-96 flex items-center justify-center">
              <p className="text-hierarchy-2">Heritage image will appear here</p>
            </div>
            <div>
              <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-6">Our Story</h2>
              <p className="text-body-lg text-hierarchy-1 mb-4 leading-relaxed">
                Founded in 1998, Family Wealth Custodians was born from a simple belief: families deserve dedicated advisors who understand their unique circumstances and long-term vision.
              </p>
              <p className="text-body-lg text-hierarchy-1 mb-4 leading-relaxed">
                What started as a boutique advisory practice has grown into a trusted partner for multi-generational wealth management, estate planning, and retirement strategy across southern Africa.
              </p>
              <p className="text-body-lg text-hierarchy-1 leading-relaxed">
                We remain committed to our founding principle: putting family values and long-term legacy at the center of every decision.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Our Values */}
        <motion.section
          className="mb-20"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Trust',
                description: 'Built on transparency, integrity, and your best interests.',
              },
              {
                title: 'Excellence',
                description: 'Deep expertise combined with meticulous attention to detail.',
              },
              {
                title: 'Legacy',
                description: 'Your wealth is your values—we protect and honor both.',
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-off-white-linen border border-champagne-beige rounded-md p-8"
              >
                <h3 className="text-h3 font-inter font-semibold text-heritage-navy mb-3">{value.title}</h3>
                <p className="text-body text-hierarchy-1">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          className="bg-heritage-navy rounded-md p-12 text-center text-cream-ivory"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={itemVariants} className="text-h2 font-playfair font-bold mb-4">
            {`Ready to Work with Us?`}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-body-lg text-cream-ivory/90 mb-8">
            {`Let's discuss how we can help your family achieve its wealth goals.`}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button variant="primary" size="lg" asChild>
              <Link href="/book-call">Schedule a Consultation</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
