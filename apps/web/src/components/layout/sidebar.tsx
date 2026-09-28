import { useState, useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
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
  GasPipeIcon,
  InboxIcon,
  Building03Icon,
  UserGroupIcon,
  Key01Icon,
  PencilEdit02Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
  Cancel01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';
import { cn } from '~/lib/utils';
import { useMediaQuery } from '~/hooks/use-media-query';
import { Button } from '~/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import type { NavEntry, NavGroup, NavLeaf, SidebarProps } from './sidebar-types';
import { NavItem } from './sidebar-nav-item';
import { CollapsibleGroup } from './sidebar-collapsible-group';
import { UserArea } from './sidebar-user-area';
import { WorkspaceSwitcher } from './sidebar-workspace-switcher';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="whitespace-nowrap text-xs tracking-wide text-muted-foreground/70">{children}</p>
  );
}

export type { SidebarProps };

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
      id: 'content',
      label: t('nav.content'),
      icon: FileEditIcon,
      basePath: '/content',
      defaultOpen: true,
      children: [
        { kind: 'item', to: '/content/posts', label: t('nav.posts'), icon: FileEditIcon },
        { kind: 'item', to: '/content/calendar', label: t('nav.calendar'), icon: Calendar01Icon },
        { kind: 'item', to: '/content/queue', label: t('nav.queue'), icon: Clock01Icon },
      ],
    },
    {
      kind: 'group',
      id: 'inbox',
      label: t('nav.inbox'),
      icon: InboxIcon,
      basePath: '/inbox',
      defaultOpen: false,
      children: [
        { kind: 'item', to: '/inbox/engagement', label: t('nav.engagement'), icon: MessageMultiple01Icon },
        { kind: 'item', to: '/inbox/messages', label: t('nav.messages'), icon: BubbleChatIcon },
      ],
    },
    { kind: 'item', to: '/analytics', label: t('nav.analytics'), icon: BarChartIcon },
    { kind: 'item', to: '/accounts', label: t('nav.accounts'), icon: UserMultiple02Icon },
    { kind: 'item', to: '/sync', label: t('nav.pipelines'), icon: GasPipeIcon },
  ];

  const [openGroupId, setOpenGroupId] = useState<string | null>(() => {
    const match = mainNav.find(
      (e): e is NavGroup => e.kind === 'group' && (pathname === e.basePath || pathname.startsWith(e.basePath + '/')),
    );
    return match ? match.id : null;
  });

  useEffect(() => {
    const match = mainNav.find(
      (e): e is NavGroup => e.kind === 'group' && (pathname === e.basePath || pathname.startsWith(e.basePath + '/')),
    );
    setOpenGroupId(match ? match.id : null);
  }, [pathname]);

  function handleGroupToggle(id: string) {
    setOpenGroupId(prev => (prev === id ? null : id));
  }

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
          'transition-[width,translate] duration-200 ease-in-out',
          effectiveCollapsed ? 'w-16' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full regular:translate-x-0',
        )}
      >
        <div
          className={cn(
            'flex h-14 shrink-0 items-center border-b border-border',
            effectiveCollapsed ? 'justify-between px-2.5' : 'gap-2 px-3',
          )}
        >
          <WorkspaceSwitcher collapsed={effectiveCollapsed} />

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation"
            className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground regular:hidden"
          >
            <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden />
            </span>
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="group hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground regular:flex"
          >
            <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
              <HugeiconsIcon
                icon={effectiveCollapsed ? SidebarRight01Icon : SidebarLeft01Icon}
                className="size-4"
                aria-hidden
              />
            </span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-3 pb-4 pt-3">
          {effectiveCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="group mx-auto flex h-8 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span className="flex transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-6">
                    <HugeiconsIcon icon={Search01Icon} className="size-4" aria-hidden />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Search</TooltipContent>
            </Tooltip>
          ) : (
            <label className="group/search flex h-8 cursor-text items-center gap-2 overflow-clip rounded-md border-[0.8px] border-border bg-card py-2 pl-2.5 pr-2 shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-150 hover:border-muted-foreground/30 focus-within:border-muted-foreground/40 focus-within:shadow-[0_0_0_3px_rgba(156,163,175,0.12)]">
              <HugeiconsIcon
                icon={Search01Icon}
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent text-[13px] leading-none text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
                aria-label="Search"
              />
              <span
                className="flex shrink-0 items-center gap-0 transition-opacity group-focus-within/search:opacity-0"
                aria-hidden
              >
                <span className="flex h-4 w-4 items-center justify-center rounded p-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                  ⌘K
                </span>
              </span>
            </label>
          )}

          <div className="-mt-1">
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

          <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto scrollbar-none">
            <div className="flex w-full flex-col gap-3">
              {!effectiveCollapsed && <SectionLabel>{t('nav.mainNav', 'Navigation')}</SectionLabel>}
              <div className="flex w-full flex-col gap-0.5">
                {mainNav.map((entry) =>
                  entry.kind === 'item' ? (
                    <NavItem
                      key={String(entry.to)}
                      item={entry}
                      collapsed={effectiveCollapsed}
                      pathname={pathname}
                      onNavigate={onMobileClose}
                    />
                  ) : (
                    <CollapsibleGroup
                      key={entry.id}
                      group={entry}
                      collapsed={effectiveCollapsed}
                      pathname={pathname}
                      onNavigate={onMobileClose}
                      open={openGroupId === entry.id}
                      onToggle={() => handleGroupToggle(entry.id)}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3">
              {!effectiveCollapsed ? (
                <SectionLabel>{t('nav.workspace')}</SectionLabel>
              ) : (
                <div className="border-t border-border" />
              )}
              <div className="flex w-full flex-col gap-0.5">
                {workspaceNav.map((item) => (
                  <NavItem
                    key={String(item.to)}
                    item={item}
                    collapsed={effectiveCollapsed}
                    pathname={pathname}
                    onNavigate={onMobileClose}
                  />
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="shrink-0 border-t border-border p-2">
          <UserArea collapsed={effectiveCollapsed} onNavigate={onMobileClose} />
        </div>
      </aside>
    </TooltipProvider>
  );
}
