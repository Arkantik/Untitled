import { Link, useRouterState } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import {
  Notification01Icon,
  Menu01Icon,
  Sun03Icon,
  Moon02Icon,
  Home01Icon,
  FileEditIcon,
  Calendar01Icon,
  Clock01Icon,
  UserMultiple02Icon,
  MessageMultiple01Icon,
  BubbleChatIcon,
  BarChartIcon,
  RepeatIcon,
  Building03Icon,
  Settings01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import { useTheme } from '~/hooks/use-theme';

interface TopBarProps {
  onMobileOpen: () => void;
}

type RouteMeta = {
  label: string;
  icon: IconSvgElement;
  parent?: string;
  parentTo?: string;
};

const ROUTE_META: Record<string, RouteMeta> = {
  '/dashboard': { label: 'Dashboard', icon: Home01Icon },
  '/content/posts': { label: 'Posts', icon: FileEditIcon, parent: 'Content', parentTo: '/content/posts' },
  '/content/calendar': { label: 'Calendar', icon: Calendar01Icon, parent: 'Content', parentTo: '/content/posts' },
  '/content/queue': { label: 'Queue', icon: Clock01Icon, parent: 'Content', parentTo: '/content/posts' },
  '/inbox/engagement': { label: 'Engagement', icon: MessageMultiple01Icon, parent: 'Inbox', parentTo: '/inbox/engagement' },
  '/inbox/messages': { label: 'Messages', icon: BubbleChatIcon, parent: 'Inbox', parentTo: '/inbox/engagement' },
  '/accounts': { label: 'Accounts', icon: UserMultiple02Icon },
  '/analytics': { label: 'Analytics', icon: BarChartIcon },
  '/sync': { label: 'Sync', icon: RepeatIcon },
  '/workspace/overview': {
    label: 'Overview',
    icon: Building03Icon,
    parent: 'Workspace',
    parentTo: '/workspace/overview',
  },
  '/workspace/members': {
    label: 'Members',
    icon: Building03Icon,
    parent: 'Workspace',
    parentTo: '/workspace/overview',
  },
  '/workspace/api-keys': {
    label: 'API Keys',
    icon: Building03Icon,
    parent: 'Workspace',
    parentTo: '/workspace/overview',
  },
  '/profile/settings': {
    label: 'Settings',
    icon: Settings01Icon,
    parent: 'Profile',
    parentTo: '/profile/settings',
  },
  '/profile/security': {
    label: 'Security',
    icon: Settings01Icon,
    parent: 'Profile',
    parentTo: '/profile/settings',
  },
  '/profile/notifications': {
    label: 'Notifications',
    icon: Settings01Icon,
    parent: 'Profile',
    parentTo: '/profile/settings',
  },
  '/profile/connections': {
    label: 'Connections',
    icon: Settings01Icon,
    parent: 'Profile',
    parentTo: '/profile/settings',
  },
  '/profile/appearance': {
    label: 'Appearance',
    icon: Settings01Icon,
    parent: 'Profile',
    parentTo: '/profile/settings',
  },
};

export function TopBar({ onMobileOpen }: TopBarProps) {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const meta = ROUTE_META[pathname];
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b border-border bg-background px-4 regular:px-6">
      <button
        type="button"
        onClick={onMobileOpen}
        aria-label="Open navigation"
        className={cn(
          'group mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground',
          'transition-colors hover:bg-muted hover:text-foreground regular:hidden',
        )}
      >
        <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
          <HugeiconsIcon icon={Menu01Icon} className="size-5" aria-hidden />
        </span>
      </button>

      <nav className="flex flex-1 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {meta ? (
          <>
            <span className="flex shrink-0 items-center justify-center text-muted-foreground">
              <HugeiconsIcon icon={meta.icon} className="size-4" aria-hidden />
            </span>

            {meta.parent && meta.parentTo ? (
              <>
                <Link
                  to={meta.parentTo as string & '/'}
                  preload="intent"
                  className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                >
                  {meta.parent}
                </Link>
                <span className="select-none text-muted-foreground/40">/</span>
              </>
            ) : null}

            <span className="whitespace-nowrap font-medium text-foreground">{meta.label}</span>
          </>
        ) : (
          <span className="font-medium text-foreground">Pulsarr</span>
        )}
      </nav>

      <TooltipProvider delayDuration={200}>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="group h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
              >
                <span className="flex origin-top group-hover:animate-bell-ring">
                  <HugeiconsIcon icon={Notification01Icon} className="size-4" aria-hidden />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="group h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
                  <HugeiconsIcon icon={isDark ? Sun03Icon : Moon02Icon} className="size-4" aria-hidden />
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDark ? 'Light mode' : 'Dark mode'}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </header>
  );
}
