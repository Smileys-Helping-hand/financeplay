import { cn } from '../../lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 bg-white border-2 border-hierarchy-4 rounded text-base font-inter text-hierarchy-1 placeholder:text-hierarchy-3 placeholder:italic focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition-all duration-200 disabled:bg-hierarchy-5 disabled:text-hierarchy-3 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});
