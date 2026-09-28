import type { LinkProps } from '@tanstack/react-router';
import type { IconSvgElement } from '@hugeicons/react';

export type NavLeaf = {
  kind: 'item';
  to: LinkProps['to'];
  label: string;
  icon: IconSvgElement;
  badge?: number;
};

export type NavGroup = {
  kind: 'group';
  id: string;
  label: string;
  icon: IconSvgElement;
  basePath: string;
  defaultOpen?: boolean;
  children: NavLeaf[];
};

export type NavEntry = NavLeaf | NavGroup;

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function isActive(pathname: string, to: LinkProps['to']): boolean {
  const path = typeof to === 'string' ? to : '';
  if (path === '/dashboard') return pathname === '/dashboard';
  return pathname === path || pathname.startsWith(path + '/');
}
