import {
  NewTwitterIcon,
  BlueskyIcon,
  Linkedin01Icon,
  Facebook01Icon,
  InstagramIcon,
  ThreadsIcon,
  DiscordIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import type { SocialPlatform } from '@veypost/shared';

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  x: 'X',
  bluesky: 'Bluesky',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  threads: 'Threads',
  discord: 'Discord',
};

export const PLATFORM_COLOR: Record<SocialPlatform, string> = {
  x: 'var(--color-foreground)',
  bluesky: '#1d9bf0',
  linkedin: '#2867b2',
  facebook: '#1877f2',
  instagram: '#e1306c',
  threads: '#a8a8a8',
  discord: '#5865f2',
};

export const PLATFORM_BG: Record<SocialPlatform, string> = {
  x: '#0f0f0f',
  bluesky: '#1d9bf0',
  linkedin: '#2867b2',
  facebook: '#1877f2',
  instagram: '#e1306c',
  threads: '#a8a8a8',
  discord: '#5865f2',
};

export const PLATFORM_ICON: Record<SocialPlatform, IconSvgElement> = {
  x: NewTwitterIcon,
  bluesky: BlueskyIcon,
  linkedin: Linkedin01Icon,
  facebook: Facebook01Icon,
  instagram: InstagramIcon,
  threads: ThreadsIcon,
  discord: DiscordIcon,
};
