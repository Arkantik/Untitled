import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Field } from '~/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface OwnerProps {
  workspaceName: string;
  onDelete: () => void;
  isDeleting: boolean;
}

interface MemberProps {
  workspaceName: string;
}

export function DeleteWorkspaceCard({ workspaceName, onDelete, isDeleting }: OwnerProps) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');

  return (
    <Card className="border-destructive">
      <CardHeader className="border-b border-destructive/30">
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>Irreversible actions. Proceed with care.</CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex flex-col gap-4 compact:flex-row compact:items-center compact:justify-between">
          <div>
            <p className="text-sm font-medium">Delete workspace</p>
            <p className="text-sm text-muted-foreground">
              Permanently deletes this workspace, all posts, connected accounts, and member
              associations. This cannot be undone.
            </p>
          </div>
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) setConfirm('');
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
                  This permanently deletes <strong>{workspaceName}</strong>, including all posts,
                  accounts, and data.
                </DialogDescription>
              </DialogHeader>
              <Field label={`Type "${workspaceName}" to confirm`}>
                {(props) => (
                  <Input
                    {...props}
                    type="text"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                )}
              </Field>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setConfirm('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  disabled={confirm !== workspaceName || isDeleting}
                  onClick={onDelete}
                >
                  Delete workspace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export function LeaveWorkspaceCard({ workspaceName }: MemberProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-destructive">
      <CardHeader className="border-b border-destructive/30">
        <CardTitle className="text-destructive">Leave workspace</CardTitle>
        <CardDescription>You will lose access immediately.</CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex flex-col gap-4 compact:flex-row compact:items-center compact:justify-between">
          <div>
            <p className="text-sm font-medium">Leave {workspaceName}</p>
            <p className="max-w-md text-sm text-muted-foreground">
              You will be removed from this workspace and lose access to all its content. The owner
              can invite you back.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" type="button" className="shrink-0">
                Leave workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave workspace</DialogTitle>
                <DialogDescription>
                  You will lose access to all content in "{workspaceName}". The owner can invite you
                  back.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" type="button" onClick={() => setOpen(false)}>
                  Leave workspace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
