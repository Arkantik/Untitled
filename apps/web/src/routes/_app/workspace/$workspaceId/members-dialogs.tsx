import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '~/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '~/components/ui/select';
import { useUpdateMemberRole, useRemoveMember } from '~/hooks/use-workspaces';
import type { MemberWithUser } from '~/contexts/workspace-context';
import type { DialogState } from './members';

interface Props {
  dialog: DialogState;
  onClose: () => void;
  workspaceId: string;
}

export function MemberDialogs({ dialog, onClose, workspaceId }: Props) {
  const [newRole, setNewRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const changeRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveMember(workspaceId);

  const target = dialog && dialog.kind !== 'transfer' ? dialog.member : null;
  const transferTarget = dialog?.kind === 'transfer' ? dialog.member : null;

  function handleChangeRole() {
    if (!target) return;
    changeRole.mutate({ userId: target.userId, role: newRole }, { onSuccess: onClose });
  }

  function handleRemove() {
    if (!target) return;
    removeMember.mutate(target.userId, { onSuccess: onClose });
  }

  return (
    <>
      <Dialog open={dialog?.kind === 'change-role'} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              Update the role for {target?.name ?? target?.email ?? ''}.
            </DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={(v) => setNewRole(v as typeof newRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="button" onClick={handleChangeRole} disabled={changeRole.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.kind === 'transfer'} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
            <DialogDescription>
              {transferTarget?.name ?? transferTarget?.email ?? ''} will become the owner. You will become an admin.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" type="button" disabled onClick={onClose}>
              Transfer ownership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.kind === 'remove'} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>
              {target?.name ?? target?.email ?? ''} will lose access to this workspace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleRemove}
              disabled={removeMember.isPending}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
