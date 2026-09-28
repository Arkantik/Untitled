import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import type { NavLeaf } from './sidebar-types';
import { isActive } from './sidebar-types';

export function NavItem({
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
        'group/nav flex w-full items-center justify-between rounded-md border-[0.8px] border-transparent px-2.5 text-left text-[13px] leading-none outline-none transition-[background-color,color] duration-150',
        'h-8',
        active
          ? 'bg-accent text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'mx-auto w-10 justify-center px-0',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <span className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
        <span className="flex transition-transform duration-200 ease-out group-hover/nav:scale-110 group-hover/nav:-rotate-6">
          <HugeiconsIcon icon={item.icon} className="size-4 shrink-0" aria-hidden />
        </span>
        {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
      </span>
      {!collapsed && item.badge ? (
        <span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-medium leading-4 text-primary-foreground">
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
