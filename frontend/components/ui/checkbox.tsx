'use client';

import { cn } from '../../lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <div className="relative inline-block">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-5 h-5 appearance-none border-1.5 border-hierarchy-4 rounded-sm bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-blue/20 checked:bg-heritage-navy checked:border-heritage-navy hover:border-slate-blue',
            className
          )}
          {...props}
        />
        <Check className="absolute left-0.5 top-0.5 w-4 h-4 text-cream-ivory pointer-events-none hidden checked:block" />
      </div>
    );
  }
);
