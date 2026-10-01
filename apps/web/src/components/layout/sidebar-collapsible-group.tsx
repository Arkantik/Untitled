import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import type { NavGroup } from './sidebar-types';

function TreeConnectorLine() {
  return (
    <svg
      width="9"
      height="21"
      viewBox="0 0 9 21"
      fill="none"
      className="block size-full text-muted-foreground/75"
    >
      <path
        d="M0.399902 0.399994V18.4C0.399902 19.5046 1.29533 20.4 2.3999 20.4H8.3999"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TreeConnectorDot({ active }: { active: boolean }) {
  return (
    <svg
      width="4"
      height="4"
      viewBox="0 0 4 4"
      fill="none"
      className={
        active
          ? 'absolute inset-0 block size-full text-primary'
          : 'absolute inset-0 block size-full text-muted-foreground/75'
      }
    >
      <path
        d="M2 0.400391C2.88366 0.400391 3.59961 1.11634 3.59961 2C3.59961 2.88366 2.88366 3.59961 2 3.59961C1.11634 3.59961 0.400391 2.88366 0.400391 2C0.400391 1.11634 1.11634 0.400391 2 0.400391Z"
        fill={active ? 'currentColor' : 'var(--color-card)'}
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function CollapsibleGroup({
  group,
  collapsed,
  pathname,
  onNavigate,
  open,
  onToggle,
}: {
  group: NavGroup;
  collapsed: boolean;
  pathname: string;
  onNavigate: () => void;
  open: boolean;
  onToggle: () => void;
}) {
  const childPaths = group.children.map((c) => (typeof c.to === 'string' ? c.to : ''));
  const groupActive =
    pathname === group.basePath ||
    pathname.startsWith(group.basePath + '/') ||
    childPaths.some((p) => p && (pathname === p || pathname.startsWith(p + '/')));

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={group.basePath as string & '/'}
            preload="intent"
            onClick={onNavigate}
            className={cn(
              'mx-auto flex h-8 w-10 items-center justify-center rounded-md border-[0.8px] border-transparent transition-colors duration-150',
              groupActive
                ? 'bg-accent text-primary'
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
    <div className="flex w-full flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'group/nav flex h-8 w-full items-center justify-between rounded-md border-[0.8px] border-transparent px-2.5 text-left text-[13px] leading-none outline-none transition-[background-color,color] duration-150',
          groupActive
            ? 'text-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex transition-transform duration-200 ease-out group-hover/nav:scale-110 group-hover/nav:-rotate-6">
            <HugeiconsIcon icon={group.icon} className="size-4 shrink-0" aria-hidden />
          </span>
          <span className="whitespace-nowrap">{group.label}</span>
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn(
            'size-3 shrink-0 text-muted-foreground transition-transform duration-300',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out',
          open ? 'mt-0.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5">
            {group.children.map((child) => {
              const active = pathname === child.to;
              return (
                <Link
                  key={String(child.to)}
                  to={child.to}
                  preload="intent"
                  onClick={onNavigate}
                  className={cn(
                    'group/sub relative flex h-8 w-full items-center text-[13px] leading-none outline-none transition-colors duration-150',
                    active
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground group-hover/sub:text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'pointer-events-none absolute inset-y-0.5 left-9 right-0 rounded-md transition-colors duration-150',
                      !active && 'group-hover/sub:bg-muted',
                    )}
                  />
                  <span className="relative pl-11 pr-2.5 text-[12px]">{child.label}</span>
                  <span className="pointer-events-none absolute left-4.5 -top-1.25 h-5 w-2">
                    <span
                      className="pointer-events-none absolute block"
                      style={{ inset: '-2% -5%' }}
                    >
                      <TreeConnectorLine />
                    </span>
                  </span>
                  <span className="pointer-events-none absolute left-5.75 top-3.25 size-1">
                    <TreeConnectorDot active={active} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
