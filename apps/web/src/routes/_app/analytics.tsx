import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { BarChartIcon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={BarChartIcon} />}
      title="Analytics"
      description="Follower growth, engagement metrics, and top-performing posts will appear here."
    />
  );
}
