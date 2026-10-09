import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { toast } from '~/components/ui/toast';
import { useConnectBluesky } from '~/hooks/use-connected-accounts';
import { isApiError } from '~/lib/api-client';

interface Props {
  workspaceId: string;
  open: boolean;
  onClose: () => void;
}

const EMPTY = { handle: '', appPassword: '' };

export function BlueskyConnectDialog({ workspaceId, open, onClose }: Props) {
  const [form, setForm] = useState(EMPTY);
  const { mutate: connect, isPending } = useConnectBluesky(workspaceId);

  function patch(field: keyof typeof EMPTY, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    connect(
      { handle: form.handle, appPassword: form.appPassword },
      {
        onSuccess: () => {
          toast.success('Bluesky account connected.');
          setForm(EMPTY);
          onClose();
        },
        onError: (err) => {
          toast.error(isApiError(err) ? err.message : 'Failed to connect Bluesky account.');
        },
      },
    );
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) { setForm(EMPTY); onClose(); }
  }

  const canSubmit = form.handle.trim() && form.appPassword.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Bluesky</DialogTitle>
          <DialogDescription>
            Use an app password, not your account password. Create one in Bluesky → Settings → App Passwords.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Handle (e.g. you.bsky.social)"
            value={form.handle}
            onChange={(e) => patch('handle', e.target.value)}
            disabled={isPending}
            required
            autoFocus
            autoComplete="username"
          />
          <Input
            type="password"
            placeholder="App password"
            value={form.appPassword}
            onChange={(e) => patch('appPassword', e.target.value)}
            disabled={isPending}
            required
            autoComplete="current-password"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending ? 'Connecting…' : 'Connect'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
