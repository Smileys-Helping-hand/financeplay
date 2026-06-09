'use client';

import { motion } from 'framer-motion';
import { Award, BarChart3, Shield } from 'lucide-react';
import { containerVariants, itemVariants, sectionVariants } from '../../lib/animations';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const trustAnchors = [
  {
    icon: Award,
    title: '25+ Years Experience',
    description: 'Trusted by 150+ high-net-worth families',
  },
  {
    icon: BarChart3,
    title: '$2.3B+ AUM',
    description: 'Median AUM per family: $5M+',
  },
  {
    icon: Shield,
    title: 'ISO 27001 Certified',
    description: 'Your data security is our top priority',
  },
];

export function TrustAnchors() {
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
            Why Choose Us
          </h2>
          <p className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            Trusted by families across South Africa for generational wealth management
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {trustAnchors.map((anchor, i) => {
            const Icon = anchor.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4">
                      <Icon className="w-12 h-12 text-muted-gold" strokeWidth={1.5} />
                    </div>
                    <CardTitle>{anchor.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body text-hierarchy-2">{anchor.description}</p>
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
