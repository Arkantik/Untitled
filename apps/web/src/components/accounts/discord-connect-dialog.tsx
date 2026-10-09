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
import { useConnectDiscord } from '~/hooks/use-connected-accounts';
import { isApiError } from '~/lib/api-client';

interface Props {
  workspaceId: string;
  open: boolean;
  onClose: () => void;
}

export function DiscordConnectDialog({ workspaceId, open, onClose }: Props) {
  const [webhookUrl, setWebhookUrl] = useState('');
  const { mutate: connect, isPending } = useConnectDiscord(workspaceId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    connect(
      { webhookUrl },
      {
        onSuccess: () => {
          toast.success('Discord channel connected.');
          setWebhookUrl('');
          onClose();
        },
        onError: (err) => {
          toast.error(isApiError(err) ? err.message : 'Failed to connect Discord channel.');
        },
      },
    );
  }

  function handleOpenChange(open: boolean) {
    if (!open) { setWebhookUrl(''); onClose(); }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Discord</DialogTitle>
          <DialogDescription>
            Paste a webhook URL from a Discord channel. Find it in channel settings → Integrations → Webhooks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="url"
            placeholder="https://discord.com/api/webhooks/…"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={isPending}
            required
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !webhookUrl}>
              {isPending ? 'Connecting…' : 'Connect'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
