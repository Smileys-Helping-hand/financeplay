import { cn, shimmer } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('rounded-md', shimmer, className)} />;
}
