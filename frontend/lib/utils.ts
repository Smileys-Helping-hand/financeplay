import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shimmer = 'animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800';
