import { Link, useRouterState } from '@tanstack/react-router';
import type { LinkProps } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import {
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
  UserGroupIcon,
  Key01Icon,
  PencilEdit02Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
  Settings01Icon,
  Logout01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';
import { useMediaQuery } from '~/hooks/use-media-query';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { Separator } from '~/components/ui/separator';
import type { IconSvgElement } from '@hugeicons/react';

const iconAnim = '[&_svg]:transition-transform [&_svg]:duration-120 [&_svg]:ease-out [&:hover_svg]:scale-110 [&:hover_svg]:-rotate-6' as const;

type NavLeaf = {
  kind: 'item';
  to: LinkProps['to'];
  label: string;
  icon: IconSvgElement;
  badge?: number;
};

type NavGroup = {
  kind: 'group';
  id: string;
  label: string;
  icon: IconSvgElement;
  basePath: string;
  defaultOpen?: boolean;
  children: NavLeaf[];
};

type NavEntry = NavLeaf | NavGroup;

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { t } = useTranslation();
  const { location } = useRouterState();
  const pathname = location.pathname;

  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const effectiveCollapsed = isDesktop && collapsed;

  const mainNav: NavEntry[] = [
    { kind: 'item', to: '/dashboard', label: t('nav.dashboard'), icon: Home01Icon },
    {
      kind: 'group',
      id: 'posts',
      label: t('nav.posts'),
      icon: FileEditIcon,
      basePath: '/posts',
      defaultOpen: true,
      children: [
        { kind: 'item', to: '/posts', label: t('nav.posts'), icon: FileEditIcon },
        { kind: 'item', to: '/posts/calendar', label: t('nav.calendar'), icon: Calendar01Icon },
      ],
    },
    { kind: 'item', to: '/queue', label: t('nav.queue'), icon: Clock01Icon },
    { kind: 'item', to: '/accounts', label: t('nav.accounts'), icon: UserMultiple02Icon },
    { kind: 'item', to: '/engagement', label: t('nav.engagement'), icon: MessageMultiple01Icon },
    { kind: 'item', to: '/messages', label: t('nav.messages'), icon: BubbleChatIcon },
    { kind: 'item', to: '/analytics', label: t('nav.analytics'), icon: BarChartIcon },
    { kind: 'item', to: '/sync', label: t('nav.sync'), icon: RepeatIcon },
  ];

  const workspaceNav: NavLeaf[] = [
    {
      kind: 'item',
      to: '/workspace/overview',
      label: t('workspace.overview'),
      icon: Building03Icon,
    },
    { kind: 'item', to: '/workspace/members', label: t('workspace.members'), icon: UserGroupIcon },
    { kind: 'item', to: '/workspace/api-keys', label: t('workspace.apiKeys'), icon: Key01Icon },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card',
          'transition-[width,transform] duration-200 ease-in-out',
          effectiveCollapsed ? 'w-16' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full regular:translate-x-0',
        )}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-border px-3">
          {!effectiveCollapsed && (
            <span className="flex-1 truncate pl-1 text-sm font-semibold tracking-tight">
              Pulsarr
            </span>
          )}

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation"
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground',
              'transition-colors hover:bg-muted hover:text-foreground regular:hidden',
              iconAnim,
              effectiveCollapsed && 'mx-auto',
            )}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden />
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground',
              'transition-colors hover:bg-muted hover:text-foreground regular:flex',
              iconAnim,
              effectiveCollapsed && 'mx-auto',
            )}
          >
            <HugeiconsIcon
              icon={effectiveCollapsed ? SidebarRight01Icon : SidebarLeft01Icon}
              className="size-4"
              aria-hidden
            />
          </button>
        </div>

        <div className="shrink-0 p-3">
          {effectiveCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="icon" className="w-full" asChild>
                  <Link to="/dashboard" preload="intent" onClick={onMobileClose}>
                    <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" aria-hidden />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('nav.compose')}</TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="default" className="w-full" asChild>
              <Link to="/dashboard" preload="intent" onClick={onMobileClose}>
                <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" aria-hidden />
                {t('nav.compose')}
              </Link>
            </Button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          <ul className="space-y-0.5" role="list">
            {mainNav.map((entry) =>
              entry.kind === 'item' ? (
                <li key={String(entry.to)}>
                  <NavItem
                    item={entry}
                    collapsed={effectiveCollapsed}
                    pathname={pathname}
                    onNavigate={onMobileClose}
                  />
                </li>
              ) : (
                <li key={entry.id}>
                  <CollapsibleGroup
                    group={entry}
                    collapsed={effectiveCollapsed}
                    pathname={pathname}
                    onNavigate={onMobileClose}
                  />
                </li>
              ),
            )}
          </ul>

          <Separator className="my-3" />

          {!effectiveCollapsed && (
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('nav.workspace')}
            </p>
          )}

          <ul className="space-y-0.5" role="list">
            {workspaceNav.map((item) => (
              <li key={String(item.to)}>
                <NavItem
                  item={item}
                  collapsed={effectiveCollapsed}
                  pathname={pathname}
                  onNavigate={onMobileClose}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-border p-2">
          <UserArea collapsed={effectiveCollapsed} onNavigate={onMobileClose} />
        </div>
      </aside>
    </TooltipProvider>
  );
}

function CollapsibleGroup({
  group,
  collapsed,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  collapsed: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  const storageKey = `pulsarr-nav-${group.id}-open`;
  const [open, setOpen] = useState(group.defaultOpen ?? false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) setOpen(stored === 'true');
    } catch {}
  }, [storageKey]);

  function toggle() {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(storageKey, String(next));
    } catch {}
  }

  const groupActive = pathname === group.basePath || pathname.startsWith(group.basePath + '/');

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={group.basePath as string & '/'}
            preload="intent"
            onClick={onNavigate}
            className={cn(
              'mx-auto flex h-9 w-10 items-center justify-center rounded-md transition-colors',
              iconAnim,
              groupActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={groupActive ? 'page' : undefined}
          >
            <HugeiconsIcon icon={group.icon} className="size-4 shrink-0" aria-hidden />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{group.label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn(
          'group flex h-9 w-full items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors',
          groupActive
            ? 'text-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <HugeiconsIcon
          icon={group.icon}
          className="size-4 shrink-0 transition-transform duration-120 ease-out group-hover:scale-110 group-hover:-rotate-6"
          aria-hidden
        />
        <span className="flex-1 truncate text-left">{group.label}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn(
            'size-3.5 shrink-0 transition-transform duration-150',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-150',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="mt-0.5 space-y-0.5 pl-3" role="list">
          {group.children.map((child) => (
            <li key={String(child.to)}>
              <Link
                to={child.to}
                preload="intent"
                onClick={onNavigate}
                className={cn(
                  'flex h-8 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors',
                  iconAnim,
                  pathname === child.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                aria-current={pathname === child.to ? 'page' : undefined}
              >
                <HugeiconsIcon icon={child.icon} className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{child.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NavItem({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavLeaf;
  collapsed: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = isActive(pathname, item.to);

  const link = (
    <Link
      to={item.to}
      preload="intent"
      onClick={onNavigate}
      className={cn(
        'flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors',
        iconAnim,
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'mx-auto w-10 justify-center px-0',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" aria-hidden />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge ? (
        <span className="ml-auto rounded-full bg-primary px-1.5 py-px text-[10px] font-medium leading-4 text-primary-foreground">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function UserArea({ collapsed, onNavigate }: { collapsed: boolean; onNavigate: () => void }) {
  const { t } = useTranslation();

  const trigger = (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left',
        'transition-colors hover:bg-muted',
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
        className={cn('flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', iconAnim)}
      >
        <HugeiconsIcon icon={Settings01Icon} className="size-3.5 shrink-0" aria-hidden />
        {t('nav.settings')}
      </Link>
      <button
        type="button"
        className={cn('flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground', iconAnim)}
      >
        <HugeiconsIcon icon={Logout01Icon} className="size-3.5 shrink-0" aria-hidden />
        {t('nav.signOut')}
      </button>
    </div>
  );
}

function isActive(pathname: string, to: LinkProps['to']) {
  const path = typeof to === 'string' ? to : '';
  if (path === '/dashboard') return pathname === '/dashboard';
  return pathname === path || pathname.startsWith(path + '/');
}
