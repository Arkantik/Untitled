import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import { PLATFORM_ICON, PLATFORM_BG, PLATFORM_LABEL } from '~/lib/platforms';
import { useListPendingPages, useConfirmPendingPages } from '~/hooks/use-connected-accounts';
import { toast } from '~/components/ui/toast';
import type { PageOption, SocialPlatform } from '@veypost/shared';

interface Props {
  workspaceId: string;
  token: string | null;
  onClose: () => void;
}

export function PagePickerDialog({ workspaceId, token, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data, isLoading } = useListPendingPages(workspaceId, token);
  const { mutate: confirm, isPending } = useConfirmPendingPages(workspaceId, token ?? '');

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleConfirm() {
    confirm(
      { selectedIds: [...selected] },
      {
        onSuccess: () => {
          toast.success('Accounts connected.');
          onClose();
        },
        onError: () => toast.error('Failed to connect selected accounts.'),
      },
    );
  }

  return (
    <Dialog open={!!token} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select accounts to connect</DialogTitle>
          <DialogDescription>
            Choose which pages or profiles to add to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-72 space-y-2 overflow-y-auto py-1">
          {isLoading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-12 rounded-md" />)
            : (data?.pages ?? []).map((page: PageOption) => {
                const checked = selected.has(page.id);
                const platform = page.platformType as SocialPlatform;
                return (
                  <button
                    key={page.id}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left transition-colors hover:bg-accent data-[checked=true]:border-primary data-[checked=true]:bg-primary/5"
                    data-checked={checked}
                    onClick={() => toggle(page.id)}
                  >
                    <div className="relative size-9 shrink-0">
                      <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-border">
                        {page.avatarUrl ? (
                          <img src={page.avatarUrl} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground">
                            {page.name[0]?.toUpperCase() ?? '?'}
                          </span>
                        )}
                      </div>
                      <div
                        className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-card"
                        style={{ background: PLATFORM_BG[platform] }}
                        aria-hidden
                      >
                        <HugeiconsIcon icon={PLATFORM_ICON[platform]} size={9} className="text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{page.name}</p>
                      <p className="text-xs text-muted-foreground">{PLATFORM_LABEL[platform]}</p>
                    </div>
                    <div
                      className={`size-4 shrink-0 rounded border-2 transition-colors ${checked ? 'border-primary bg-primary' : 'border-border'}`}
                      aria-hidden
                    />
                  </button>
                );
              })}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={selected.size === 0 || isPending}
            onClick={handleConfirm}
          >
            Connect {selected.size > 0 ? `(${selected.size})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
