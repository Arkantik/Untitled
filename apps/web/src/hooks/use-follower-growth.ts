import { useMemo } from 'react';
import type { AnalyticsRange, FollowerSeries } from '@veypost/shared';

function series(start: number, end: number, days: number, seed: number): number[] {
  let s = seed >>> 0;
  const rng = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const pts: number[] = [];
  for (let i = 0; i < days; i++) {
    const base = start + (end - start) * (i / (days - 1));
    pts.push(Math.round(base + (rng() - 0.5) * Math.abs(end - start) * 0.35));
  }
  pts[days - 1] = end;
  return pts;
}

const DAYS: Record<AnalyticsRange, number> = { '7d': 7, '14d': 14, '30d': 30, '90d': 90 };

const START_RATIO: Record<AnalyticsRange, number> = {
  '7d': 0.986,
  '14d': 0.972,
  '30d': 0.94,
  '90d': 0.88,
};

const RANGE_SEED: Record<AnalyticsRange, number> = {
  '7d': 1000,
  '14d': 2000,
  '30d': 3000,
  '90d': 4000,
};

const BASE: Omit<FollowerSeries, 'series'>[] = [
  { accountId: 'acc-x', platform: 'x', handle: '@veypost', current: 23451 },
  { accountId: 'acc-bsky', platform: 'bluesky', handle: '@veypost.bsky.social', current: 4812 },
  { accountId: 'acc-li', platform: 'linkedin', handle: 'veypost-official', current: 2145 },
  { accountId: 'acc-ig', platform: 'instagram', handle: '@veypost.ig', current: 8921 },
];

export function useFollowerGrowth(_workspaceId: string, range: AnalyticsRange) {
  const data = useMemo(() => {
    const days = DAYS[range];
    return BASE.map((acc, i) => ({
      ...acc,
      series: series(
        Math.round(acc.current * START_RATIO[range]),
        acc.current,
        days,
        7331 + i * 1500 + RANGE_SEED[range],
      ),
    })) as FollowerSeries[];
  }, [range]);
  return { data, isLoading: false };
}
