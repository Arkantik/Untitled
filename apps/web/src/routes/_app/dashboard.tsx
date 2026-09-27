import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={Home01Icon} />}
      title="Dashboard"
      description="Your activity feed and composer will appear here."
    />
  );
}
