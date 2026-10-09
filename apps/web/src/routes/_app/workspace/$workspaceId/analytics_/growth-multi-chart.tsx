import { useMemo, memo } from 'react';
import { useAnimateOnce } from '~/hooks/use-animate-once';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HugeiconsIcon } from '@hugeicons/react';
import { PLATFORM_ICON, PLATFORM_COLOR } from '~/lib/platforms';
import type { FollowerSeries, AnalyticsRange, SocialPlatform } from '@veypost/shared';

function buildDateLabels(len: number): string[] {
  const now = new Date(2026, 9, 1);
  return Array.from({ length: len }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (len - 1 - i));
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  });
}

function tickInterval(len: number, range: AnalyticsRange): number {
  if (range === '7d') return 1;
  if (range === '14d') return 2;
  if (range === '30d') return 6;
  return Math.floor(len / 6);
}

interface TooltipEntry {
  name?: string;
  dataKey?: string;
  value?: number;
  color?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  idToPlatform: Record<string, SocialPlatform>;
}

function ChartTooltip({ active, payload, label, idToPlatform }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 6,
        padding: '8px 10px',
        fontSize: 12,
      }}
    >
      <p style={{ color: 'var(--color-muted-foreground)', marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => {
        const platform = idToPlatform[entry.dataKey ?? ''] as SocialPlatform | undefined;
        const icon = platform ? PLATFORM_ICON[platform] : null;
        return (
          <div
            key={entry.dataKey}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-foreground)',
              marginBottom: 3,
            }}
          >
            {icon && (
              <HugeiconsIcon icon={icon} size={14} style={{ color: entry.color }} aria-hidden />
            )}
            <span>{entry.name}</span>
            <span
              style={{ marginLeft: 'auto', paddingLeft: 12, fontVariantNumeric: 'tabular-nums' }}
            >
              {new Intl.NumberFormat().format(entry.value ?? 0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface Props {
  data: FollowerSeries[];
  range: AnalyticsRange;
}

export const MultiAreaChart = memo(function MultiAreaChart({ data, range }: Props) {
  const animate = useAnimateOnce('growth-multi-chart');

  const len = Math.max(1, ...data.map((d) => d.series.length));
  const dateLabels = useMemo(() => buildDateLabels(len), [len]);
  const idToPlatform = useMemo(
    () =>
      Object.fromEntries(data.map((d) => [d.accountId, d.platform])) as Record<
        string,
        SocialPlatform
      >,
    [data],
  );

  const rows = useMemo(
    () =>
      Array.from({ length: len }, (_, i) => {
        const row: Record<string, number | string> = { date: dateLabels[i] ?? '' };
        data.forEach((d) => {
          row[d.accountId] = d.series[i] ?? d.series[d.series.length - 1] ?? 0;
        });
        return row;
      }),
    [len, dateLabels, data],
  );

  const interval = tickInterval(len, range);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={rows} margin={{ top: 10, bottom: -10, left: 0, right: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          interval={interval}
        />
        <YAxis domain={['auto', 'auto']} hide />
        <Tooltip
          cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          content={(props) => <ChartTooltip {...(props as any)} idToPlatform={idToPlatform} />}
        />
        {data.map((d) => (
          <Area
            key={d.accountId}
            type="monotone"
            dataKey={d.accountId}
            name={d.handle}
            stroke={PLATFORM_COLOR[d.platform]}
            fill={PLATFORM_COLOR[d.platform]}
            fillOpacity={0.08}
            strokeWidth={2}
            dot={false}
            isAnimationActive={animate}
            animationDuration={700}
            animationEasing="ease-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
});
