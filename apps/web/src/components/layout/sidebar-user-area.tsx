import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useMediaQuery } from '~/hooks/use-media-query';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings01Icon,
  Logout01Icon,
  StarIcon,
  FavouriteIcon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { APP_GITHUB_URL } from '@pulsarr/shared';
import { authClient } from '~/lib/auth-client';
import { useCurrentUser } from '~/hooks/use-session';
import { useUserProfile } from '~/hooks/use-profile';
import { SponsorDialog } from './sidebar-sponsor-dialog';

function UserAvatar({
  image,
  name,
  initials,
}: {
  image: string | null | undefined;
  name: string;
  initials: string;
}) {
  return (
    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground">
      {initials}
      {image && (
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full rounded-full object-cover"
        />
      )}
    </span>
  );
}

export function UserArea({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useCurrentUser();
  const profile = useUserProfile();
  const [sponsorOpen, setSponsorOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 64rem)');

  async function handleSignOut() {
    await authClient.signOut();
    await router.navigate({ to: '/login' });
  }

  const name = profile.name ?? session.name;
  const avatarUrl = profile.avatarUrl ?? profile.image;
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const trigger = (
    <button
      type="button"
      className={cn(
        'group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted',
        collapsed && 'justify-center px-0',
      )}
    >
      <UserAvatar image={avatarUrl} name={name} initials={initials} />
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{session.email}</p>
          </div>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className="ml-auto size-3 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </>
      )}
    </button>
  );

  const content = (
    <DropdownMenuContent
      side={isDesktop ? 'right' : 'top'}
      align={isDesktop ? 'end' : 'start'}
      sideOffset={10}
      collisionPadding={10}
      className="w-(--radix-dropdown-menu-trigger-width)"
    >
      <DropdownMenuItem asChild className="group gap-2.5">
        <Link to="/profile/settings" search={{ tab: 'profile' }} preload="intent" onClick={onNavigate}>
          <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
            <HugeiconsIcon icon={Settings01Icon} className="size-3.5 shrink-0" aria-hidden />
          </span>
          {t('nav.settings')}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="group gap-2.5">
        <a href={APP_GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
            <HugeiconsIcon icon={StarIcon} className="size-3.5 shrink-0" aria-hidden />
          </span>
          {t('nav.starOnGithub')}
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem className="group gap-2.5" onClick={() => setSponsorOpen(true)}>
        <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <HugeiconsIcon
            icon={FavouriteIcon}
            className="size-3.5 shrink-0 text-rose-500"
            aria-hidden
          />
        </span>
        {t('nav.sponsor')}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="group gap-2.5 text-destructive focus:text-destructive"
        onClick={() => {
          void handleSignOut();
        }}
      >
        <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <HugeiconsIcon icon={Logout01Icon} className="size-3.5 shrink-0" aria-hidden />
        </span>
        {t('nav.signOut')}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <>
      <DropdownMenu>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{t('nav.viewProfile')}</TooltipContent>
          </Tooltip>
        ) : (
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        )}
        {content}
      </DropdownMenu>
      <SponsorDialog open={sponsorOpen} onOpenChange={setSponsorOpen} />
    </>
  );
}
