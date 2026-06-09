'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { FormInput } from './ui/form-input';
import { Select } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { containerVariants, itemVariants } from '../lib/animations';
import { CheckCircle2 } from 'lucide-react';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  services: string[];
  goal: string;
  preferredDate?: string;
  preferredTime?: string;
}

const services = [
  { id: 'estate', label: 'Estate Planning' },
  { id: 'retirement', label: 'Retirement Planning' },
  { id: 'investment', label: 'Investment Strategy' },
  { id: 'tax', label: 'Tax Optimization' },
  { id: 'preservation', label: 'Wealth Preservation' },
  { id: 'other', label: 'Other' },
];

const countries = [
  { value: 'za', label: 'South Africa' },
  { value: 'bw', label: 'Botswana' },
  { value: 'na', label: 'Namibia' },
  { value: 'zw', label: 'Zimbabwe' },
  { value: 'other', label: 'Other' },
];

const timeSlots = [
  { value: '09:00', label: '9:00 AM SAST' },
  { value: '10:00', label: '10:00 AM SAST' },
  { value: '11:00', label: '11:00 AM SAST' },
  { value: '14:00', label: '2:00 PM SAST' },
  { value: '15:00', label: '3:00 PM SAST' },
  { value: '16:00', label: '4:00 PM SAST' },
  { value: '17:00', label: '5:00 PM SAST' },
];

interface BookingFormProps {
  onSubmit?: (data: BookingFormData) => void;
  onSuccess?: () => void;
}

export function BookingForm({ onSubmit, onSuccess }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    country: 'za',
    services: [],
    goal: '',
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.services.length === 0) newErrors.services = 'Select at least one service';
      if (!formData.goal.trim()) newErrors.goal = 'Please tell us your goal';
    }

    if (currentStep === 2) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';
      if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (onSubmit) {
        onSubmit(formData);
      }

      setSubmitted(true);

      // Call success callback after showing confirmation
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to book call. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          <CheckCircle2 className="w-16 h-16 text-soft-sage mx-auto" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-h2 font-playfair font-bold text-heritage-navy mb-4"
        >
          {`All Set!`}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-body-lg text-hierarchy-1 mb-4"
        >
          Your exploration call is confirmed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-off-white-linen border border-champagne-beige rounded-md p-6 my-8 text-left max-w-md mx-auto"
        >
          <p className="text-body-sm text-hierarchy-2 mb-4">
            <strong>Date:</strong> {formData.preferredDate}
          </p>
          <p className="text-body-sm text-hierarchy-2 mb-4">
            <strong>Time:</strong> {formData.preferredTime} SAST
          </p>
          <p className="text-body-sm text-hierarchy-2">
            <strong>Email:</strong> {formData.email}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-body text-hierarchy-2 mb-8"
        >
          {`A confirmation email has been sent to ${formData.email}. You'll receive a Zoom link 24 hours before the call.`}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-caption text-hierarchy-3 mb-8"
        >
          Not ready yet?{' '}
          <a
            href="/insights"
            className="text-slate-blue hover:text-heritage-navy transition-colors font-semibold"
          >
            Explore our resources
          </a>
        </motion.p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <motion.div
            key="step-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="mb-8">
              <h3 className="text-h3 font-playfair font-semibold text-heritage-navy mb-2">
                Step 1 of 2: Tell Us About Yourself
              </h3>
              <p className="text-body-sm text-hierarchy-2">
                {`Let's start with the basics. This is a complimentary, confidential conversation.`}
              </p>
            </div>

            <motion.div variants={itemVariants} className="space-y-6 mb-8">
              <FormInput
                label="Full Name"
                placeholder="e.g., Margaret Williams"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
              />

              <FormInput
                label="Email Address"
                type="email"
                placeholder="margaret@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <FormInput
                label="Phone Number"
                type="tel"
                placeholder="+27 (0)21 888 3388"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />

              <div>
                <Label htmlFor="country">Country / Region</Label>
                <Select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  options={countries}
                />
              </div>

              <div>
                <Label className="mb-4">Which services interest you?</Label>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-3">
                      <Checkbox
                        id={service.id}
                        checked={formData.services.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              services: [...formData.services, service.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              services: formData.services.filter((s) => s !== service.id),
                            });
                          }
                        }}
                      />
                      <label htmlFor={service.id} className="text-body cursor-pointer text-hierarchy-1">
                        {service.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.services && <p className="text-red-600 text-body-sm mt-2">{errors.services}</p>}
              </div>

              <div>
                <Label htmlFor="goal">{`What's your primary wealth goal?`}</Label>
                <textarea
                  id="goal"
                  placeholder="e.g., Secure generational wealth, plan for retirement, optimize tax liability..."
                  required
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-hierarchy-4 rounded text-base font-inter text-hierarchy-1 placeholder:text-hierarchy-3 placeholder:italic focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition-all duration-200 resize-none h-24"
                />
                {errors.goal && <p className="text-red-600 text-body-sm mt-2">{errors.goal}</p>}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <Button variant="primary" size="default" onClick={handleNext} className="flex-1">
                Next → Step 2
              </Button>
              <Button variant="secondary" size="default" asChild className="flex-1">
                <a href="/">Cancel</a>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <motion.div
            key="step-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="mb-8">
              <h3 className="text-h3 font-playfair font-semibold text-heritage-navy mb-2">
                Step 2 of 2: Choose Your Time
              </h3>
              <p className="text-body-sm text-hierarchy-2">
                Our advisors are available for 30-minute calls within the next 7 days.
              </p>
            </div>

            <motion.div variants={itemVariants} className="space-y-6 mb-8">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <input
                  id="date"
                  type="date"
                  required
                  value={formData.preferredDate || ''}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-hierarchy-4 rounded text-base font-inter text-hierarchy-1 focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition-all duration-200"
                />
                {errors.preferredDate && (
                  <p className="text-red-600 text-body-sm mt-2">{errors.preferredDate}</p>
                )}
              </div>

              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select
                  id="time"
                  value={formData.preferredTime || ''}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  options={timeSlots}
                />
                {errors.preferredTime && (
                  <p className="text-red-600 text-body-sm mt-2">{errors.preferredTime}</p>
                )}
              </div>

              <div className="bg-hierarchy-5 rounded-md p-4 border border-hierarchy-4">
                <p className="text-caption text-hierarchy-2">
                  <strong>Duration:</strong> 30 minutes
                </p>
                <p className="text-caption text-hierarchy-2 mt-2">
                  <strong>Format:</strong> Zoom (link sent 24 hours before)
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <Button variant="primary" size="default" type="submit" disabled={loading} className="flex-1">
                {loading ? 'Confirming...' : 'Confirm & Book Call'}
              </Button>
              <Button variant="secondary" size="default" onClick={handleBack} className="flex-1">
                ← Back to Step 1
              </Button>
            </motion.div>

            {errors.submit && (
              <p className="text-red-600 text-body-sm mt-4 text-center">{errors.submit}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
