import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/posts/calendar')({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={Calendar01Icon} />}
      title="Calendar"
      description="Month, week, and agenda views of your scheduled posts will appear here."
    />
  );
}
