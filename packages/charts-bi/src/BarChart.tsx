import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { rechartsTooltip, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, buildSeries, gridProps, makeBarLabel, resolveLabelMode, seriesOpacity, splitCardProps, useHorizontalLayout, type CardKey } from "./internal/cartesian";

export interface BarChartProps extends BaseChartProps {
  data: any[];
  index: string;
  categories: string[];
  seriesLabels?: Record<string, string>;
  stacked?: boolean;
  percent?: boolean;
  colorByCategory?: boolean;
  /** Row height in px used to grow the chart with the number of rows when height="auto". Default 32. */
  rowHeight?: number;
  maxBarSize?: number;
  sort?: "asc" | "desc" | "none";
  onBarClick?: (datum: any, seriesKey: string) => void;
}

/** Horizontal bars. Prefer this over ColumnChart when category labels are long or there are many categories. */
export function BarChart(props: BarChartProps) {
  const [card, plot] = splitCardProps(props);
  const series = buildSeries(props.categories, props.colors, props.seriesLabels, "square");
  const single = props.categories.length === 1 && props.colorByCategory;
  const rows = props.data?.length ?? 0;
  // Horizontal bars read best when the height follows the row count.
  const height = card.height ?? Math.min(560, Math.max(180, rows * (props.rowHeight ?? 32) * (props.stacked || props.categories.length === 1 ? 1 : Math.min(props.categories.length, 3) * 0.7) + 40));
  return (
    <ChartCard {...card} height={height} series={single ? [] : series} isEmpty={rows === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <BarPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function BarPlot({ ctx, data, index, series, seriesLabels, valueFormatter = DEFAULT_FORMATTER, labelFormatter, stacked = false, percent = false, colorByCategory = false, maxBarSize = 28, sort = "none", dataLabels, onBarClick, colors }: Omit<BarChartProps, CardKey> & { ctx: ChartContextValue; series: ReturnType<typeof buildSeries> }) {
  const keys = series.map((s) => s.key);
  const isStacked = stacked || percent;
  const fmt = percent ? (v: number) => `${Math.round(v * 100)}%` : valueFormatter;
  const sorted = sort === "none" ? data : [...data].sort((a, b) => {
    const sa = keys.reduce((acc, k) => acc + (Number(a[k]) || 0), 0);
    const sb = keys.reduce((acc, k) => acc + (Number(b[k]) || 0), 0);
    return sort === "asc" ? sa - sb : sb - sa;
  });
  const labelMode = resolveLabelMode(dataLabels, "auto");
  const layout = useHorizontalLayout(sorted, keys, index, fmt, ctx, { stacked: isStacked, labelFormatter, outsideLabels: labelMode.mode !== "never" && !isStacked });
  const barLabel = makeBarLabel(labelMode.formatter ?? valueFormatter, labelMode.fontSize, labelMode.mode, "horizontal", labelMode.minMarkSize, isStacked ? "inside" : "outside");
  const palette = colorByCategory ? buildSeries(sorted.map((_, i) => String(i)), colors).map((s) => s.color) : null;
  const tickFmt = (v: any) => truncateToWidth(String(labelFormatter ? labelFormatter(v) : v), layout.categoryWidth - 8, layout.fontSize);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart layout="vertical" data={sorted} margin={layout.margin} stackOffset={percent ? "expand" : "none"} barCategoryGap="20%" barGap={2} maxBarSize={maxBarSize}>
        <CartesianGrid {...gridProps} horizontal={false} />
        <XAxis type="number" axisLine={false} tickLine={false} tick={axisTick(layout.fontSize)} tickFormatter={fmt} tickCount={layout.tickCount} height={24} />
        <YAxis type="category" dataKey={index} axisLine={false} tickLine={false} width={layout.categoryWidth} tick={axisTick(layout.fontSize)} tickFormatter={tickFmt} interval={0} />
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap: seriesLabels, labelFormatter, total: isStacked && !percent })} cursor={{ fill: "var(--vi-color-surface-cardHover)", opacity: 0.5 }} />
        {series.map((s, si) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color}
            fillOpacity={seriesOpacity(s.key, ctx)}
            stackId={isStacked ? "stack" : undefined}
            hide={ctx.hiddenSeries.has(s.key)}
            radius={isStacked ? (si === series.length - 1 ? [0, 3, 3, 0] : 0) : [0, 3, 3, 0]}
            onClick={(d: any) => onBarClick?.(d?.payload ?? d, s.key)}
            cursor={onBarClick ? "pointer" : undefined}
            {...animationProps(ctx)}
          >
            {palette && sorted.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
            {labelMode.mode !== "never" && <LabelList dataKey={s.key} content={barLabel as any} />}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
