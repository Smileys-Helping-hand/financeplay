"use client";

import { useEffect } from 'react';
import { OverviewCards } from '../../components/dashboard/overview-cards';
import { SpendingChart } from '../../components/dashboard/spending-chart';
import { CategoryBreakdown } from '../../components/dashboard/category-breakdown';
import { InsightsGrid } from '../../components/dashboard/insights-grid';
import { ExperiencePanel } from '../../components/gamification/experience';
import { Skeleton } from '../../components/ui/skeleton';
import { HealthScore } from '../../components/dashboard/health-score';
import { ErrorBoundary } from '../../components/ui/error-boundary';
import { useFinanceStore } from '../../lib/store';

const DashboardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-28 w-full" />
    <div className="grid gap-4 lg:grid-cols-3">
      <Skeleton className="h-80 lg:col-span-2" />
      <Skeleton className="h-80" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { loadSnapshot, loading } = useFinanceStore((s) => ({
    loadSnapshot: s.loadSnapshot,
    loading: s.loading
  }));

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  if (loading) return <DashboardSkeleton />;

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <HealthScore />
        <OverviewCards />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <SpendingChart />
            <InsightsGrid />
          </div>
          <div className="space-y-4">
            <ExperiencePanel />
            <CategoryBreakdown />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
