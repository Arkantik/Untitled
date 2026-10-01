import { useState } from 'react';
import { useParams, useRouterState } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { UnfoldMoreIcon, Add01Icon, CheckIcon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Skeleton } from '~/components/ui/skeleton';
import { useWorkspaceContext } from '~/contexts/workspace-context';
import { CreateWorkspaceDialog } from '~/components/workspace/create-workspace-dialog';
import type { WorkspaceRow } from '~/contexts/workspace-context';

function WorkspaceLogo({ initial, avatarUrl, size = 'md' }: { initial: string; avatarUrl?: string | null; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-5 w-5 text-[9px]' : 'h-6 w-6 text-[10px]';
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        aria-hidden
        className={`${dim} shrink-0 rounded-md object-cover`}
      />
    );
  }
  return (
    <div className={`flex ${dim} shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground`}>
      <span className="font-bold leading-none">{initial}</span>
    </div>
  );
}

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const { t } = useTranslation();
  const { workspaces, isLoading } = useWorkspaceContext();
  const { location } = useRouterState();
  const params = useParams({ strict: false }) as { workspaceId?: string };
  const [createOpen, setCreateOpen] = useState(false);

  const activeWorkspace =
    workspaces.find((w) => w.id === params.workspaceId) ?? workspaces[0] ?? null;
  const initial = activeWorkspace?.name.charAt(0).toUpperCase() ?? 'W';
  const avatarUrl = activeWorkspace?.avatarUrl ?? null;

  function switchTo(ws: WorkspaceRow) {
    const wsRouteMatch = location.pathname.match(/^\/workspace\/([^/]+)\/(.+)$/);
    if (wsRouteMatch) {
      navigate({ to: `/workspace/${ws.id}/${wsRouteMatch[2]}` as never });
    }
  }

  function handleCreated(_ws: WorkspaceRow) {
    setCreateOpen(false);
  }

  if (isLoading) {
    return collapsed ? (
      <div className="flex items-center justify-center">
        <Skeleton className="size-6 rounded-md" />
      </div>
    ) : (
      <Skeleton className="h-11 w-full rounded-md" />
    );
  }

  if (workspaces.length === 0) {
    if (collapsed) {
      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex items-center justify-center rounded-md border border-dashed border-border p-1 text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t('workspace.new')}
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{t('workspace.new')}</TooltipContent>
          </Tooltip>
          <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={handleCreated} />
        </>
      );
    }
    return (
      <>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-md border border-dashed border-border p-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground">
            <HugeiconsIcon icon={Add01Icon} className="size-3.5" aria-hidden />
          </div>
          <span className="block truncate text-[0.8rem] font-semibold leading-snug text-muted-foreground">
            {t('workspace.new')}
          </span>
        </button>
        <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={handleCreated} />
      </>
    );
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <WorkspaceLogo initial={initial} avatarUrl={avatarUrl} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">{activeWorkspace?.name ?? '…'}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex w-full cursor-pointer items-center gap-2.5 rounded-md border border-border p-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <WorkspaceLogo initial={initial} avatarUrl={avatarUrl} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8rem] font-semibold leading-snug">
              {activeWorkspace?.name}
            </span>
            <span className="block truncate text-xs capitalize leading-snug text-muted-foreground">
              {activeWorkspace?.plan ?? 'workspace'}
            </span>
          </span>
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width)"
          side="bottom"
          align="start"
        >
          {workspaces.map((ws) => (
            <DropdownMenuItem key={ws.id} onClick={() => switchTo(ws)}>
              <WorkspaceLogo
                initial={ws.name.charAt(0).toUpperCase()}
                avatarUrl={ws.avatarUrl}
                size="sm"
              />
              <span className="flex-1 truncate">{ws.name}</span>
              {ws.id === activeWorkspace?.id && (
                <HugeiconsIcon icon={CheckIcon} className="ml-auto size-3.5 text-primary" aria-hidden />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} className="size-3.5" aria-hidden />
            {t('workspace.new')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
      />
    </>
  );
}
