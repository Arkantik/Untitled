import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { BarProps } from 'recharts';
import { useAnimateOnce } from '~/hooks/use-animate-once';

type BarShape = BarProps['shape'];

interface BarRow {
  label: string;
  dotColor: string;
  likes: number;
  comments: number;
  reposts: number;
}

interface Props {
  rows: BarRow[];
  chartKey: string;
}

const METRICS = ['likes', 'comments', 'reposts'] as const;
type Metric = (typeof METRICS)[number];
type MetricCounts = Record<Metric, number>;

const R = 4;

function roundedBarShape(metric: Metric, metricData: MetricCounts[]): BarShape {
  return function Shape(props: Record<string, unknown>) {
    const { x, y, width, height, index, fill } = props as {
      x: number;
      y: number;
      width: number;
      height: number;
      index: number;
      fill: string;
    };
    if (!width || !height) return null;

    const row = metricData[index];
    if (!row) return null;
    const first = METRICS.find((m) => row[m] > 0) ?? null;
    const last = [...METRICS].reverse().find((m) => row[m] > 0) ?? null;

    const roundLeft = metric === first;
    const roundRight = metric === last;

    if (roundLeft && roundRight) {
      return <rect x={x} y={y} width={width} height={height} rx={R} ry={R} fill={fill} />;
    }
    if (roundRight) {
      const d = `M${x},${y} h${width - R} a${R},${R} 0 0 1 ${R},${R} v${height - 2 * R} a${R},${R} 0 0 1 -${R},${R} H${x} Z`;
      return <path d={d} fill={fill} />;
    }
    if (roundLeft) {
      const d = `M${x + R},${y} H${x + width} V${y + height} H${x + R} a${R},${R} 0 0 1 -${R},-${R} V${y + R} a${R},${R} 0 0 1 ${R},-${R} Z`;
      return <path d={d} fill={fill} />;
    }
    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
  } as unknown as BarShape;
}

export const BarChartWidget = memo(function BarChartWidget({ rows, chartKey }: Props) {
  const animate = useAnimateOnce(chartKey);
  const data = useMemo(
    () =>
      rows.map((r) => ({
        name: r.label,
        likes: r.likes,
        comments: r.comments,
        reposts: r.reposts,
      })),
    [rows],
  );

  const metricData = useMemo(
    (): MetricCounts[] =>
      data.map((r) => ({
        likes: r.likes,
        comments: r.comments,
        reposts: r.reposts,
      })),
    [data],
  );

  return (
    <ResponsiveContainer width="100%" height={rows.length * 36 + 8}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
        barCategoryGap="30%"
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={72}
          tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
          contentStyle={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            fontSize: 12,
          }}
          formatter={(value) => new Intl.NumberFormat().format(value as number)}
        />
        <Bar
          dataKey="likes"
          stackId="a"
          fill="var(--color-primary)"
          isAnimationActive={animate}
          animationDuration={700}
          animationEasing="ease-out"
          shape={roundedBarShape('likes', metricData)}
        />
        <Bar
          dataKey="comments"
          stackId="a"
          fill="var(--color-warning)"
          isAnimationActive={animate}
          animationDuration={700}
          animationEasing="ease-out"
          shape={roundedBarShape('comments', metricData)}
        />
        <Bar
          dataKey="reposts"
          stackId="a"
          fill="var(--color-success)"
          isAnimationActive={animate}
          animationDuration={700}
          animationEasing="ease-out"
          shape={roundedBarShape('reposts', metricData)}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});
