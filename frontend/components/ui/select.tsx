'use client';

import { cn } from '../../lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options = [], ...props },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-3 bg-white border-2 border-hierarchy-4 rounded text-base font-inter text-hierarchy-1 appearance-none focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition-all duration-200 disabled:bg-hierarchy-5 disabled:text-hierarchy-3 disabled:cursor-not-allowed pr-10',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hierarchy-3 pointer-events-none" />
    </div>
  );
});
