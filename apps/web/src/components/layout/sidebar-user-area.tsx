import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

export function UserArea({ collapsed, onNavigate }: { collapsed: boolean; onNavigate: () => void }) {
  const { t } = useTranslation();

  const trigger = (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted',
        collapsed && 'justify-center px-0',
      )}
    >
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src="" alt="" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">User</p>
          <p className="truncate text-[10px] text-muted-foreground">user@example.com</p>
        </div>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="right">{t('nav.viewProfile')}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-0.5">
      {trigger}
      <Link
        to="/settings/profile"
        preload="intent"
        onClick={onNavigate}
        className="group flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <HugeiconsIcon icon={Settings01Icon} className="size-3.5 shrink-0" aria-hidden />
        </span>
        {t('nav.settings')}
      </Link>
      <button
        type="button"
        className="group flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <HugeiconsIcon icon={Logout01Icon} className="size-3.5 shrink-0" aria-hidden />
        </span>
        {t('nav.signOut')}
      </button>
    </div>
  );
}
