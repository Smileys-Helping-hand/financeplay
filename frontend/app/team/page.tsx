'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { containerVariants, itemVariants, sectionVariants } from '@/lib/animations';

const teamMembers = [
  {
    name: 'Margaret Williams',
    title: 'Founder & Chief Wealth Advisor',
    credentials: 'CFA, CFP, 28 years experience',
    specialties: ['Estate Planning', 'Wealth Preservation', 'Leadership'],
  },
  {
    name: 'David Nkosi',
    title: 'Senior Investment Advisor',
    credentials: 'CFA, MBA, 22 years experience',
    specialties: ['Investment Strategy', 'Portfolio Management', 'Risk Analysis'],
  },
  {
    name: 'Sarah Mitchell',
    title: 'Tax & Retirement Specialist',
    credentials: 'CPA, Tax Specialist, 18 years experience',
    specialties: ['Tax Optimization', 'Retirement Planning', 'Compliance'],
  },
];

export default function TeamPage() {
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
            Meet Our Team
          </motion.h1>
          <motion.p variants={itemVariants} className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            {`Experienced advisors dedicated to your family's financial success`}
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {teamMembers.map((member, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                {/* Placeholder for Photo */}
                <div className="w-full h-56 bg-hierarchy-5 flex items-center justify-center">
                  <p className="text-hierarchy-2">Professional photo</p>
                </div>
                <CardHeader>
                  <CardTitle className="text-h3">{member.name}</CardTitle>
                  <p className="text-body font-inter font-semibold text-slate-blue mt-2">{member.title}</p>
                  <p className="text-caption text-hierarchy-2 mt-1">{member.credentials}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-body-sm text-hierarchy-2 mb-4">Specialties:</p>
                  <ul className="space-y-2">
                    {member.specialties.map((specialty, j) => (
                      <li key={j} className="text-caption text-hierarchy-2 flex items-center gap-2">
                        <span className="text-muted-gold">•</span> {specialty}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Connect Section */}
        <motion.section
          className="bg-off-white-linen border border-champagne-beige rounded-md p-12"
          variants={sectionVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-4 text-center">
            Ready to Connect?
          </h2>
          <p className="text-body-lg text-hierarchy-1 text-center max-w-2xl mx-auto mb-8">
            Schedule an initial consultation with one of our advisors. {`It's`} complimentary and confidential.
          </p>
          <div className="flex justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/book-call">Book Your Exploration Call</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
