'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '../ui/button';
import { sectionVariants, itemVariants, containerVariants } from '../../lib/animations';

export function FinalCTA() {
  return (
    <section className="bg-heritage-navy py-20 lg:py-32 px-6 lg:px-12">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-h1 font-playfair font-bold text-cream-ivory mb-4"
        >
          {`Ready to Secure Your Family's Financial Future?`}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-body-lg text-cream-ivory/90 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Schedule a free, confidential exploration call with one of our advisors.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/book-call">Book Your Exploration Call</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/services">View Our Services</Link>
          </Button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-caption text-cream-ivory/70 mt-8"
        >
          {`No obligation. This is a complimentary, confidential conversation.`}
        </motion.p>
      </motion.div>
    </section>
  );
}
