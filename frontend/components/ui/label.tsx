import { cn } from '../../lib/utils';
import { LabelHTMLAttributes } from 'react';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-hierarchy-1 font-inter font-medium text-body-sm mb-2', className)}
      {...props}
    />
  );
}
