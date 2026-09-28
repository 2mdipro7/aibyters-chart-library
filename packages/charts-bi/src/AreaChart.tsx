import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { rechartsTooltip, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, buildSeries, gridProps, makeCategoryTick, seriesOpacity, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

export interface AreaChartProps extends BaseChartProps {
  data: any[];
  index: string;
  categories: string[];
  seriesLabels?: Record<string, string>;
  /** Stack the areas. Default false. */
  stacked?: boolean;
  /** Normalise stacked areas to 100%. Implies stacked. */
  percent?: boolean;
  curve?: "monotone" | "linear" | "step";
  /** Fill opacity at the top of the gradient. Default 0.35. */
  fillOpacity?: number;
}

export function AreaChart(props: AreaChartProps) {
  const [card, plot] = splitCardProps(props);
  const series = buildSeries(props.categories, props.colors, props.seriesLabels, "square");
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <AreaPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

let gradientSeq = 0;

function AreaPlot({ ctx, data, index, series, seriesLabels, valueFormatter = DEFAULT_FORMATTER, labelFormatter, stacked = false, percent = false, curve = "monotone", fillOpacity = 0.35 }: Omit<AreaChartProps, CardKey> & { ctx: ChartContextValue; series: ReturnType<typeof buildSeries> }) {
  const keys = series.map((s) => s.key);
  const isStacked = stacked || percent;
  const fmt = percent ? (v: number) => `${Math.round(v * 100)}%` : valueFormatter;
  const layout = useCartesianLayout(data, keys, index, fmt, ctx, { stacked: isStacked, labelFormatter });
  const gid = `vi-area-${(gradientSeq = (gradientSeq + 1) % 100000)}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart data={data} margin={layout.margin} stackOffset={percent ? "expand" : "none"}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${gid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={fillOpacity} />
              <stop offset="95%" stopColor={s.color} stopOpacity={isStacked ? fillOpacity * 0.6 : 0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey={index} axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, layout.xAxis.angle === 0 ? Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, data.length)) : 90)} tickFormatter={labelFormatter as any} minTickGap={4} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={fmt} tickCount={layout.tickCount} />
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap: seriesLabels, labelFormatter, total: isStacked && !percent })} cursor={{ stroke: "var(--vi-color-surface-border)" }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type={curve}
            dataKey={s.key}
            name={s.label}
            stackId={isStacked ? "stack" : undefined}
            stroke={s.color}
            strokeWidth={ctx.settings.strokeWidth}
            strokeOpacity={seriesOpacity(s.key, ctx)}
            fillOpacity={seriesOpacity(s.key, ctx)}
            fill={`url(#${gid}-${s.key})`}
            hide={ctx.hiddenSeries.has(s.key)}
            dot={false}
            activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0 }}
            connectNulls
            {...animationProps(ctx)}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
