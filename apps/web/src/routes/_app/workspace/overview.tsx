import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Field } from '~/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export const Route = createFileRoute('/_app/workspace/overview')({
  component: WorkspaceOverviewPage,
});

const IS_OWNER = true;

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
];

function WorkspaceOverviewPage() {
  const [name, setName] = useState('My Workspace');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Workspace settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace preferences, team, and integrations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>
            How this workspace appears across Pulsarr and in shared links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="flex size-17 shrink-0 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-1.5">
              <Button variant="outline" size="sm" type="button">
                Upload photo
              </Button>
              <span className="text-xs text-muted-foreground">JPG, PNG or GIF · 1 MB max</span>
            </div>
          </div>
          <Field label="Workspace name" hint="Visible to all members.">
            {(props) => (
              <Input
                {...props}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </Field>
          <Field label="Default timezone" hint="Default timezone for post scheduling.">
            {({ id }) => (
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id={id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
        </CardContent>
        <CardFooter className="gap-2 border-t border-border px-6 py-4">
          <Button type="button">Save changes</Button>
          <Button variant="ghost" type="button">
            Reset
          </Button>
        </CardFooter>
      </Card>

      {IS_OWNER && (
        <Card className="border-destructive">
          <CardHeader className="border-b border-destructive/30">
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>Irreversible actions. Proceed with care.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Delete workspace</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Permanently deletes this workspace, all posts, connected accounts, and member
                  associations. This cannot be undone.
                </p>
              </div>
              <Dialog
                open={deleteOpen}
                onOpenChange={(o) => {
                  setDeleteOpen(o);
                  if (!o) setConfirmName('');
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" type="button" className="shrink-0">
                    Delete workspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete workspace</DialogTitle>
                    <DialogDescription>
                      This permanently deletes <strong>{name}</strong>, including all posts,
                      accounts, and data.
                    </DialogDescription>
                  </DialogHeader>
                  <Field label={`Type "${name}" to confirm`}>
                    {(props) => (
                      <Input
                        {...props}
                        type="text"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                      />
                    )}
                  </Field>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setDeleteOpen(false);
                        setConfirmName('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" type="button" disabled={confirmName !== name}>
                      Delete workspace
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {!IS_OWNER && (
        <Card className="border-destructive">
          <CardHeader className="border-b border-destructive/30">
            <CardTitle className="text-destructive">Leave workspace</CardTitle>
            <CardDescription>You will lose access immediately.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Leave {name}</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  You will be removed from this workspace and lose access to all its content. The
                  owner can invite you back.
                </p>
              </div>
              <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" type="button" className="shrink-0">
                    Leave workspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Leave workspace</DialogTitle>
                    <DialogDescription>
                      You will lose access to all content in "{name}". The owner can invite you
                      back.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setLeaveOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" type="button">
                      Leave workspace
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
