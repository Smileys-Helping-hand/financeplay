'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { pageVariants, itemVariants, containerVariants } from '../../lib/animations';

export function HeroSection() {
  return (
    <section className="min-h-screen bg-cream-ivory flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-display font-playfair font-bold text-heritage-navy mb-6"
            >
              Generational Wealth, Personal Care
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-body-lg text-hierarchy-1 mb-8 max-w-lg leading-relaxed"
            >
              Expert estate planning, retirement strategies, and wealth preservation for families across South Africa.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-body text-hierarchy-2 mb-8 max-w-lg leading-relaxed"
            >
              {`At Family Wealth Custodians, we understand that your family's financial legacy is more than numbers—it's a reflection of your values and vision. Our advisors specialize in bespoke wealth management, tax-efficient strategies, and estate planning that protect what matters most.`}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="primary" size="lg" asChild>
                <Link href="/book-call">Book Your Exploration Call</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/services">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-hierarchy-5 rounded-md shadow-elevation-3 aspect-square flex items-center justify-center overflow-hidden">
              {/* Placeholder - replace with actual image */}
              <div className="text-center p-8">
                <p className="text-hierarchy-2 font-inter">
                  Multi-generational family image will appear here
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
