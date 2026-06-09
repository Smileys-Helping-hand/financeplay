import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-inter font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-blue/20 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-heritage-navy text-cream-ivory rounded hover:bg-slate-charcoal shadow-elevation-1 hover:shadow-elevation-2 active:shadow-elevation-1',
        secondary: 'border-1.5 border-heritage-navy bg-transparent text-heritage-navy rounded hover:bg-heritage-navy/5 active:bg-heritage-navy/10',
        tertiary: 'bg-transparent text-slate-blue rounded-none border-b border-slate-blue hover:text-heritage-navy hover:border-heritage-navy',
        ghost: 'bg-transparent text-heritage-navy hover:bg-cream-ivory/50',
      },
      size: {
        sm: 'px-4 py-2 text-body-sm',
        default: 'px-8 py-4 text-body',
        lg: 'px-10 py-5 text-body-lg',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp ref={ref as any} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});
Button.displayName = 'Button';
