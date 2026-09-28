import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import type { Invitation } from './members';

const INV_BADGE: Record<Invitation['role'], 'warning' | 'success' | 'neutral'> = {
  admin: 'warning', editor: 'success', viewer: 'neutral',
};

const INV_ROLE_LABEL: Record<Invitation['role'], string> = {
  admin: 'Admin', editor: 'Editor', viewer: 'Viewer',
};

export function PendingInvitations({ invitations }: { invitations: Invitation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Pending invitations{' '}
          <span className="text-sm font-normal text-muted-foreground">({invitations.length})</span>
        </CardTitle>
        <CardDescription>These people have been invited but haven't accepted yet.</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-0">
        <div className="divide-y divide-border">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex items-center gap-3 py-3">
              <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted/50 text-xs font-bold text-muted-foreground">
                ?
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-muted-foreground">{inv.email}</p>
                <p className="text-xs text-muted-foreground">
                  Invited as{' '}
                  <Badge tone={INV_BADGE[inv.role]} className="px-1.5 py-0 text-[10px]">
                    {INV_ROLE_LABEL[inv.role]}
                  </Badge>
                  {' · '}{inv.sentAt}
                </p>
              </div>
              <Button variant="ghost" size="sm" type="button" className="text-muted-foreground">Resend</Button>
              <Button variant="ghost" size="sm" type="button" className="text-destructive hover:text-destructive">Cancel</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const ROLES = [
  {
    name: 'Owner', tone: 'brand' as const,
    perms: ['Full workspace control', 'Billing and plan management', 'Invite, remove, and reassign members', 'Delete the workspace'],
  },
  {
    name: 'Admin', tone: 'warning' as const,
    perms: ['Manage members and roles', 'Connect and disconnect accounts', 'Create and revoke API keys', 'All editor permissions'],
  },
  {
    name: 'Editor', tone: 'success' as const,
    perms: ['Create, edit, and publish posts', 'Manage the content queue', 'View analytics'],
  },
  {
    name: 'Viewer', tone: 'neutral' as const,
    perms: ['View posts and calendar', 'View analytics', 'Cannot create or publish'],
  },
];

export function RolePermissionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role permissions</CardTitle>
        <CardDescription>What each role can do in this workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <div key={r.name} className="rounded-md border border-border p-3">
              <Badge tone={r.tone}>{r.name}</Badge>
              <ul className="mt-2 space-y-1">
                {r.perms.map((p) => <li key={p} className="text-xs text-muted-foreground">{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
