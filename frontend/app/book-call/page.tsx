'use client';

import { useState } from 'react';
import { BookingForm } from '@/components/BookingForm';
import { useRouter } from 'next/navigation';

export default function BookCallPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    // Redirect after successful booking
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cream-ivory pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 font-playfair font-bold text-heritage-navy mb-4">
            Schedule Your Exploration Call
          </h1>
          <p className="text-body-lg text-hierarchy-1 max-w-xl mx-auto">
            {`Let's discuss your family's wealth management goals. This is a complimentary, confidential 30-minute conversation with one of our advisors.`}
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-white border border-champagne-beige rounded-md p-12 shadow-elevation-2">
          <BookingForm onSuccess={handleSuccess} />
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-body-sm text-hierarchy-2 mb-6">
            We take your privacy seriously. Your information is secure and confidential.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-caption text-hierarchy-3">
            <div>🔒 ISO 27001 Certified</div>
            <div>📞 Phone support available</div>
            <div>✓ No spam, ever</div>
          </div>
        </div>
      </div>
    </div>
  );
}
