import { cn } from '../../lib/utils';

export function Badge({ label, className }: { label: string; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100', className)}>{label}</span>;
}
