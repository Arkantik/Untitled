import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Key01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '~/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import type { ApiKey } from './api-keys';

const SCOPE_LABELS: Record<ApiKey['scope'], string> = {
  read_write: 'Read & Write',
  read_only: 'Read only',
};

function ApiKeyRow({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex size-8.5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
        <HugeiconsIcon icon={Key01Icon} className="size-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{apiKey.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <code className="rounded-sm border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[11px]">
            ···· {apiKey.lastFour}
          </code>
          {apiKey.lastUsedAt
            ? <span>Last used {apiKey.lastUsedAt}</span>
            : <span className="text-muted-foreground/60">Never used</span>
          }
          <Badge tone="neutral" className="text-[10px] px-1.5 py-0">{SCOPE_LABELS[apiKey.scope]}</Badge>
          <span>{apiKey.expiresAt ? `Expires ${apiKey.expiresAt}` : 'Never expires'}</span>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Revoke
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API key</DialogTitle>
            <DialogDescription>
              Revoking "{apiKey.name}" will immediately invalidate it. Any app using it will stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" type="button" onClick={() => { onRevoke(apiKey.id); setOpen(false); }}>Revoke</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ApiKeyList({
  keys,
  onRevoke,
  showCreate,
  onCreateToggle,
}: {
  keys: ApiKey[];
  onRevoke: (id: string) => void;
  showCreate: boolean;
  onCreateToggle: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-4">
        <div>
          <CardTitle>API keys</CardTitle>
          <CardDescription>Authenticate REST API requests on behalf of this workspace.</CardDescription>
        </div>
        <Button size="sm" type="button" onClick={onCreateToggle}>
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" aria-hidden />
          Create API key
        </Button>
      </CardHeader>
      <CardContent className="px-6 pt-0">
        {keys.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No API keys yet. Create one to get started.</p>
        ) : (
          <div className="divide-y divide-border">
            {keys.map((key) => (
              <ApiKeyRow key={key.id} apiKey={key} onRevoke={onRevoke} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ApiKeyInfoNote() {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      <strong className="font-medium text-foreground">API keys grant full workspace access within their scopes</strong> — treat them like passwords.
      Revoke any key that's no longer in use. Keys with read & write access can publish directly to your connected accounts.
    </p>
  );
}
