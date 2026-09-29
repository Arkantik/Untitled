import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

const ROLES = [
  {
    name: 'Owner', tone: 'brand' as const,
    perms: [
      'Full workspace control',
      'Billing and plan management',
      'Invite, remove, and reassign members',
      'Delete the workspace',
    ],
  },
  {
    name: 'Admin', tone: 'warning' as const,
    perms: [
      'Manage members and roles',
      'Connect and disconnect accounts',
      'Create and revoke API keys',
      'All editor permissions',
    ],
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
        <div className="grid grid-cols-1 gap-3 compact:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r.name} className="rounded-md border border-border p-3">
              <Badge tone={r.tone}>{r.name}</Badge>
              <ul className="mt-2 space-y-1">
                {r.perms.map((p) => (
                  <li key={p} className="text-xs text-muted-foreground">{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
