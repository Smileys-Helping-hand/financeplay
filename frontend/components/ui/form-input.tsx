'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef } from 'react';
import { Input } from './input';
import { cn } from '../../lib/utils';
import { errorVariants } from '../../lib/animations';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { label, error, helperText, required, className, ...props },
  ref
) {
  return (
    <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {label && (
        <label className="block text-hierarchy-1 font-inter font-medium text-body-sm mb-2">
          {label}
          {required && <span className="text-muted-gold ml-1">*</span>}
        </label>
      )}
      <Input ref={ref} required={required} className={cn(error && 'border-red-500 focus:ring-red-500/10')} {...props} />
      {error && (
        <motion.p variants={errorVariants} initial="hidden" animate="visible" className="mt-2 text-red-600 text-body-sm">
          {error}
        </motion.p>
      )}
      {helperText && !error && <p className="mt-2 text-hierarchy-3 text-caption italic">{helperText}</p>}
    </motion.div>
  );
});
