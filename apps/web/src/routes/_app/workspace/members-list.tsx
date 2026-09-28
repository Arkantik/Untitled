import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreVerticalIcon, UserRemove01Icon, UserSwitchIcon, UserCheck01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '~/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '~/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import type { Member } from './members';

const ROLE_LABELS: Record<Member['role'], string> = {
  owner: 'Owner', admin: 'Admin', editor: 'Editor', viewer: 'Viewer',
};
const ROLE_BADGE: Record<Member['role'], 'brand' | 'warning' | 'success' | 'neutral'> = {
  owner: 'brand', admin: 'warning', editor: 'success', viewer: 'neutral',
};
const ROLE_AVATAR: Record<Member['role'], string> = {
  owner: 'bg-primary/12 text-primary',
  admin: 'bg-warning/15 text-warning',
  editor: 'bg-success/15 text-success',
  viewer: 'bg-muted text-muted-foreground',
};

type DialogState =
  | { kind: 'change-role'; member: Member }
  | { kind: 'transfer'; member: Member }
  | { kind: 'remove'; member: Member }
  | null;

export function MemberList({ members, currentUserId }: { members: Member[]; currentUserId: string }) {
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<DialogState>(null);
  const [newRole, setNewRole] = useState<Member['role']>('editor');

  const isOwner = members.find((m) => m.id === currentUserId)?.role === 'owner';
  const filtered = search
    ? members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
    : members;

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-4">
          <div>
            <CardTitle>Members <span className="text-sm font-normal text-muted-foreground">({members.length})</span></CardTitle>
            <CardDescription>People with access to this workspace.</CardDescription>
          </div>
          <Input type="search" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 text-xs" />
        </CardHeader>
        <CardContent className="px-6 pt-0">
          <div className="divide-y divide-border">
            {filtered.map((member) => (
              <div key={member.id} className="flex items-center gap-3 py-3">
                <div className={cn('flex size-8.5 shrink-0 items-center justify-center rounded-full text-xs font-bold', ROLE_AVATAR[member.role])}>
                  {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.name}
                    {member.id === currentUserId && <span className="ml-1 text-xs text-muted-foreground">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
                <Badge tone={ROLE_BADGE[member.role]}>{ROLE_LABELS[member.role]}</Badge>
                {isOwner && member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" aria-label={`Options for ${member.name}`} className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <span className="flex transition-transform duration-fast group-hover:scale-110 group-hover:-rotate-6">
                          <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" aria-hidden />
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setNewRole(member.role); setDialog({ kind: 'change-role', member }); }}>
                        <HugeiconsIcon icon={UserCheck01Icon} className="size-4" aria-hidden />Change role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDialog({ kind: 'transfer', member })}>
                        <HugeiconsIcon icon={UserSwitchIcon} className="size-4" aria-hidden />Transfer ownership
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDialog({ kind: 'remove', member })}>
                        <HugeiconsIcon icon={UserRemove01Icon} className="size-4" aria-hidden />Remove member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialog?.kind === 'change-role'} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>Update the role for {dialog?.kind === 'change-role' ? dialog.member.name : ''}.</DialogDescription>
          </DialogHeader>
          <Select value={newRole} onValueChange={(v) => setNewRole(v as Member['role'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialog(null)}>Cancel</Button>
            <Button type="button" onClick={() => setDialog(null)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.kind === 'transfer'} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
            <DialogDescription>{dialog?.kind === 'transfer' ? dialog.member.name : ''} will become the owner. You will become an admin.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialog(null)}>Cancel</Button>
            <Button variant="destructive" type="button" onClick={() => setDialog(null)}>Transfer ownership</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.kind === 'remove'} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>{dialog?.kind === 'remove' ? dialog.member.name : ''} will lose access to this workspace.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setDialog(null)}>Cancel</Button>
            <Button variant="destructive" type="button" onClick={() => setDialog(null)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
