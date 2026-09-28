import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserAdd01Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Field } from '~/components/ui/field';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '~/components/ui/select';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '~/components/ui/card';

export function InviteSection({ isOwnerOrAdmin }: { isOwnerOrAdmin: boolean }) {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  if (!isOwnerOrAdmin) return null;

  function handleCancel() {
    setShowForm(false);
    setEmail('');
    setRole('editor');
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-md border border-primary/30 bg-primary/8 p-4">
        <div className="shrink-0 text-primary">
          <HugeiconsIcon icon={UserAdd01Icon} className="size-5" aria-hidden />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">Invite your team</p>
          <p className="text-xs text-muted-foreground">Members get access based on their role. Roles can be changed any time.</p>
        </div>
        <Button size="sm" type="button" onClick={() => setShowForm((v) => !v)}>
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" aria-hidden />
          Invite member
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader className="border-b border-primary/20 bg-primary/8">
            <CardTitle className="text-primary text-sm">Invite a member</CardTitle>
            <CardDescription>They'll receive an email with a link to join.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <Field label="Email address">
              {(props) => (
                <Input
                  {...props}
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Field>
            <Field label="Role">
              {({ id }) => (
                <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                  <SelectTrigger id={id}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin — manage members and accounts</SelectItem>
                    <SelectItem value="editor">Editor — create and publish posts</SelectItem>
                    <SelectItem value="viewer">Viewer — read-only access</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
          </CardContent>
          <CardFooter className="gap-2 border-t border-border px-6 py-4">
            <Button type="button" disabled={!email.trim()}>Send invite</Button>
            <Button variant="ghost" type="button" onClick={handleCancel}>Cancel</Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
