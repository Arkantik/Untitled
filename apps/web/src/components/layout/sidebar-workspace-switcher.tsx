import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Add01Icon, CheckIcon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { cn } from '~/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '~/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

const WORKSPACES = [{ id: '1', name: 'My Workspace' }];

type Workspace = (typeof WORKSPACES)[number];

function WorkspaceLogo() {
  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <span className="text-[10px] font-bold leading-none">P</span>
    </div>
  );
}

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<Workspace>(WORKSPACES[0]);

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <WorkspaceLogo />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">{current.name}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex min-w-0 flex-1 items-center gap-2 rounded-md py-0.5 pl-0.5 pr-1 text-left transition-colors hover:bg-muted"
        >
          <WorkspaceLogo />
          <span className="truncate text-sm font-semibold tracking-tight">{current.name}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              'ml-auto size-3 shrink-0 text-muted-foreground transition-transform duration-200',
              'group-data-[state=open]:rotate-180',
            )}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="start">
        <DropdownMenuLabel>{t('workspace.switch')}</DropdownMenuLabel>
        {WORKSPACES.map((ws) => (
          <DropdownMenuItem key={ws.id} onClick={() => setCurrent(ws)}>
            <span className="flex-1 truncate">{ws.name}</span>
            {ws.id === current.id && (
              <HugeiconsIcon icon={CheckIcon} className="ml-auto size-3.5 text-primary" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={Add01Icon} className="size-3.5" aria-hidden />
          {t('workspace.new')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
