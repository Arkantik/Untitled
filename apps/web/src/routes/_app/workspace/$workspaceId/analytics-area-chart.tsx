import { useMemo, memo } from 'react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';
import { useAnimateOnce } from '~/hooks/use-animate-once';

interface Props {
  series: number[];
  gradientId: string;
}

export const AreaChartWidget = memo(function AreaChartWidget({ series, gradientId }: Props) {
  const data = useMemo(() => series.map((v, i) => ({ i, v })), [series]);
  const animate = useAnimateOnce(gradientId);

  return (
    <ResponsiveContainer width="100%" height={72}>
      <AreaChart data={data} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
        <YAxis domain={['auto', 'auto']} hide />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="var(--color-primary)"
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={false}
          isAnimationActive={animate}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});
