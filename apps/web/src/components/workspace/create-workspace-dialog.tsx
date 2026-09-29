import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '~/components/ui/dialog';
import { Field } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useCreateWorkspace } from '~/hooks/use-workspaces';
import type { WorkspaceRow } from '~/contexts/workspace-context';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (ws: WorkspaceRow) => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState('');
  const create = useCreateWorkspace((ws) => {
    onCreated(ws);
    onOpenChange(false);
    setName('');
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate({ name: name.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Workspace name">
            {(props) => (
              <Input
                {...props}
                type="text"
                placeholder="My workspace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            )}
          </Field>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={create.isPending} disabled={!name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
