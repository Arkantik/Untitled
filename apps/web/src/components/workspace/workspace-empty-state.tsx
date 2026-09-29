import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserMultiple02Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { Button } from '~/components/ui/button';
import { EmptyState } from '~/components/ui/empty-state';
import { CreateWorkspaceDialog } from './create-workspace-dialog';
import type { WorkspaceRow } from '~/contexts/workspace-context';

export function WorkspaceEmptyState() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleCreated(ws: WorkspaceRow) {
    navigate({ to: '/workspace/$workspaceId/overview', params: { workspaceId: ws.id } });
  }

  return (
    <>
      <EmptyState
        size="lg"
        icon={<HugeiconsIcon icon={UserMultiple02Icon} className="size-8 text-primary" aria-hidden />}
        title="No workspace yet"
        description="Create a workspace to organize your team, schedule content, and publish across platforms."
        action={
          <Button type="button" onClick={() => setOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} className="size-4" aria-hidden />
            Create workspace
          </Button>
        }
      />
      <CreateWorkspaceDialog open={open} onOpenChange={setOpen} onCreated={handleCreated} />
    </>
  );
}
