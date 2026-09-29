import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Skeleton } from '~/components/ui/skeleton';
import { MoreVerticalIcon, UserRemove01Icon, UserSwitchIcon, UserCheck01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import type { MemberWithUser } from '~/contexts/workspace-context';

type Role = MemberWithUser['role'];

const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner', admin: 'Admin', editor: 'Editor', viewer: 'Viewer',
};
const ROLE_BADGE: Record<Role, 'brand' | 'warning' | 'success' | 'neutral'> = {
  owner: 'brand', admin: 'warning', editor: 'success', viewer: 'neutral',
};
const ROLE_AVATAR: Record<Role, string> = {
  owner: 'bg-primary/12 text-primary',
  admin: 'bg-warning/15 text-warning',
  editor: 'bg-success/15 text-success',
  viewer: 'bg-muted text-muted-foreground',
};

function initials(member: MemberWithUser): string {
  if (member.name) return member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return member.email.slice(0, 2).toUpperCase();
}

interface MemberListProps {
  members: MemberWithUser[];
  currentUserId: string | null;
  isOwner: boolean;
  isLoading?: boolean;
  onChangeRole: (m: MemberWithUser) => void;
  onTransfer: (m: MemberWithUser) => void;
  onRemove: (m: MemberWithUser) => void;
}

export function MemberList({ members, currentUserId, isOwner, isLoading, onChangeRole, onTransfer, onRemove }: MemberListProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? members.filter((m) =>
        (m.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
      )
    : members;

  return (
    <Card>
      <CardHeader className="gap-3 space-y-0 pb-4 compact:flex-row compact:items-center compact:justify-between">
        <div>
          <CardTitle>
            Members{' '}
            <span className="text-sm font-normal text-muted-foreground">({members.length})</span>
          </CardTitle>
          <CardDescription>People with access to this workspace.</CardDescription>
        </div>
        <Input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full text-xs compact:w-44"
        />
      </CardHeader>
      <CardContent className="px-6 pt-0">
        <div className="divide-y divide-border">
          {isLoading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="size-8.5 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))
          ) : filtered.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-3">
              <div className={cn('flex size-8.5 shrink-0 items-center justify-center rounded-full text-xs font-bold', ROLE_AVATAR[member.role])}>
                {initials(member)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {member.name ?? member.email}
                  {member.userId === currentUserId && (
                    <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>
              <Badge tone={ROLE_BADGE[member.role]}>{ROLE_LABELS[member.role]}</Badge>
              {isOwner && member.role !== 'owner' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Options for ${member.name ?? member.email}`}
                      className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="flex transition-transform duration-fast group-hover:scale-110 group-hover:-rotate-6">
                        <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" aria-hidden />
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onChangeRole(member)}>
                      <HugeiconsIcon icon={UserCheck01Icon} className="size-4" aria-hidden />
                      Change role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTransfer(member)}>
                      <HugeiconsIcon icon={UserSwitchIcon} className="size-4" aria-hidden />
                      Transfer ownership
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onRemove(member)}
                    >
                      <HugeiconsIcon icon={UserRemove01Icon} className="size-4" aria-hidden />
                      Remove member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
