'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { containerVariants, itemVariants } from '@/lib/animations';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream-ivory pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-h1 font-playfair font-bold text-heritage-navy mb-4">
            Get in Touch
          </motion.h1>
          <motion.p variants={itemVariants} className="text-body-lg text-hierarchy-1 max-w-2xl mx-auto">
            Have questions? Ready to discuss your wealth management strategy? {`We're`} here to help.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-8">
              Contact Information
            </h2>

            <motion.div variants={itemVariants} className="space-y-6 mb-12">
              {/* Email */}
              <a
                href="mailto:info@familywealthcustodians.co.za"
                className="flex items-start gap-4 p-6 bg-off-white-linen border border-champagne-beige rounded-md hover:shadow-elevation-2 transition-all duration-200"
              >
                <Mail className="w-6 h-6 text-muted-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-heritage-navy mb-1">Email</h3>
                  <p className="text-body text-hierarchy-2">info@familywealthcustodians.co.za</p>
                  <p className="text-caption text-hierarchy-3 mt-2">Typically responds within 24 hours</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+27218883388"
                className="flex items-start gap-4 p-6 bg-off-white-linen border border-champagne-beige rounded-md hover:shadow-elevation-2 transition-all duration-200"
              >
                <Phone className="w-6 h-6 text-muted-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-heritage-navy mb-1">Phone</h3>
                  <p className="text-body text-hierarchy-2">+27 (0)21 888 3388</p>
                  <p className="text-caption text-hierarchy-3 mt-2">Monday—Friday, 9 AM—5 PM SAST</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4 p-6 bg-off-white-linen border border-champagne-beige rounded-md">
                <MapPin className="w-6 h-6 text-muted-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-heritage-navy mb-1">Office</h3>
                  <p className="text-body text-hierarchy-2">Paarl, South Africa</p>
                  <p className="text-caption text-hierarchy-3 mt-2">Virtual meetings available worldwide</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Button variant="primary" size="lg" asChild className="w-full">
                <Link href="/book-call">Schedule a Free Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Links & Resources */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-h2 font-playfair font-semibold text-heritage-navy mb-8">Helpful Resources</h2>

            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              <a
                href="/insights"
                className="flex items-center justify-between p-4 bg-off-white-linen border border-champagne-beige rounded-md hover:shadow-elevation-2 transition-all duration-200 group"
              >
                <div>
                  <h3 className="font-semibold text-heritage-navy group-hover:text-slate-blue transition-colors">
                    Blog & Insights
                  </h3>
                  <p className="text-caption text-hierarchy-2 mt-1">Market perspectives and planning tips</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-blue group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>

              <a
                href="/services"
                className="flex items-center justify-between p-4 bg-off-white-linen border border-champagne-beige rounded-md hover:shadow-elevation-2 transition-all duration-200 group"
              >
                <div>
                  <h3 className="font-semibold text-heritage-navy group-hover:text-slate-blue transition-colors">
                    Our Services
                  </h3>
                  <p className="text-caption text-hierarchy-2 mt-1">Estate planning, retirement, tax optimization</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-blue group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>

              <a
                href="/team"
                className="flex items-center justify-between p-4 bg-off-white-linen border border-champagne-beige rounded-md hover:shadow-elevation-2 transition-all duration-200 group"
              >
                <div>
                  <h3 className="font-semibold text-heritage-navy group-hover:text-slate-blue transition-colors">
                    Meet Our Team
                  </h3>
                  <p className="text-caption text-hierarchy-2 mt-1">Advisors with 25+ years experience</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-blue group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>

              <a
                href="/about"
                className="flex items-center justify-between p-4 bg-off-white-linen border border-champagne-beige rounded-md hover:shadow-elevation-2 transition-all duration-200 group"
              >
                <div>
                  <h3 className="font-semibold text-heritage-navy group-hover:text-slate-blue transition-colors">
                    About FWC
                  </h3>
                  <p className="text-caption text-hierarchy-2 mt-1">Our story, mission, and values</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-blue group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </a>
            </motion.div>

            {/* FAQ Notice */}
            <motion.div
              variants={itemVariants}
              className="bg-soft-sage/10 border border-soft-sage/30 rounded-md p-6"
            >
              <h3 className="font-semibold text-heritage-navy mb-2">Common Questions?</h3>
              <p className="text-body-sm text-hierarchy-2 mb-4">
                Check out our resources or reach out directly—we love helping families understand their options.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          className="bg-heritage-navy rounded-md p-12 text-center text-cream-ivory"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 variants={itemVariants} className="text-h2 font-playfair font-bold mb-4">
            {`Ready to Discuss Your Wealth Strategy?`}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-body-lg text-cream-ivory/90 mb-8 max-w-2xl mx-auto">
            Schedule a free 30-minute exploration call with one of our advisors.
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
