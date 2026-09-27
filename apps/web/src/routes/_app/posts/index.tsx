import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileEditIcon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/posts/')({
  component: PostsPage,
});

function PostsPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={FileEditIcon} />}
      title="Posts"
      description="All your scheduled, published, and draft posts will appear here."
    />
  );
}
