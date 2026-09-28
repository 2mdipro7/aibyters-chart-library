import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { computeAxisWidth, rechartsTooltip, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, buildSeries, gridProps, makeCategoryTick, seriesOpacity, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

export interface ComboChartProps extends BaseChartProps {
  data: any[];
  index: string;
  barCategories: string[];
  lineCategories: string[];
  seriesLabels?: Record<string, string>;
  /** Plot lines on a secondary right axis (e.g. a rate against volumes). Default false. */
  secondaryAxis?: boolean;
  /** Formatter for the secondary axis. Defaults to valueFormatter. */
  secondaryFormatter?: (v: number) => string;
  stackedBars?: boolean;
  maxBarSize?: number;
}

export function ComboChart(props: ComboChartProps) {
  const [card, plot] = splitCardProps(props);
  const all = [...props.barCategories, ...props.lineCategories];
  const palette = buildSeries(all, props.colors, props.seriesLabels);
  const series = palette.map((s, i) => ({ ...s, shape: i < props.barCategories.length ? ("square" as const) : ("line" as const) }));
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <ComboPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function ComboPlot({ ctx, data, index, barCategories, lineCategories, series, seriesLabels, valueFormatter = DEFAULT_FORMATTER, secondaryFormatter, labelFormatter, secondaryAxis = false, stackedBars = false, maxBarSize = 40 }: Omit<ComboChartProps, CardKey> & { ctx: ChartContextValue; series: ReturnType<typeof buildSeries> }) {
  const fmt2 = secondaryFormatter ?? valueFormatter;
  const rightWidth = secondaryAxis ? computeAxisWidth(data.flatMap((d) => lineCategories.map((k) => Number(d[k]))), fmt2, { fontSize: ctx.settings.fontSize }) : 0;
  const layout = useCartesianLayout(data, secondaryAxis ? barCategories : [...barCategories, ...lineCategories], index, valueFormatter, ctx, { stacked: stackedBars, extraRight: rightWidth, labelFormatter });
  const byKey = new Map(series.map((s) => [s.key, s]));
  const slot = Math.max(40, ((ctx.width || 600) - layout.yAxisWidth - rightWidth) / Math.max(1, data.length));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ ...layout.margin, right: 8 }} maxBarSize={maxBarSize} barCategoryGap="25%">
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey={index} axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, layout.xAxis.angle === 0 ? slot : 90)} tickFormatter={labelFormatter as any} minTickGap={2} />
        <YAxis yAxisId="left" axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={valueFormatter} tickCount={layout.tickCount} />
        {secondaryAxis && <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} width={rightWidth} tick={axisTick(layout.fontSize)} tickFormatter={fmt2} tickCount={layout.tickCount} />}
        <Tooltip content={rechartsTooltip({ valueFormatter: (v, k) => (secondaryAxis && lineCategories.includes(k) ? fmt2(v) : valueFormatter(v)), hidden: ctx.hiddenSeries, nameMap: seriesLabels, labelFormatter })} cursor={{ fill: "var(--vi-color-surface-cardHover)", opacity: 0.5 }} />
        {barCategories.map((k) => {
          const s = byKey.get(k)!;
          return <Bar key={k} yAxisId="left" dataKey={k} name={s.label} fill={s.color} fillOpacity={seriesOpacity(k, ctx)} stackId={stackedBars ? "stack" : undefined} hide={ctx.hiddenSeries.has(k)} radius={[3, 3, 0, 0]} {...animationProps(ctx)} />;
        })}
        {lineCategories.map((k) => {
          const s = byKey.get(k)!;
          return <Line key={k} yAxisId={secondaryAxis ? "right" : "left"} type="monotone" dataKey={k} name={s.label} stroke={s.color} strokeWidth={ctx.settings.strokeWidth} strokeOpacity={seriesOpacity(k, ctx)} hide={ctx.hiddenSeries.has(k)} dot={data.length <= 12 ? { r: ctx.settings.dotRadius - 2, strokeWidth: 0, fill: s.color } : false} activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0 }} connectNulls {...animationProps(ctx)} />;
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
