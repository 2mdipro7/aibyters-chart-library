import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ReferenceLine, Cell } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { estimateTextWidth, rechartsTooltip, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, buildSeries, gridProps, makeBarLabel, makeCategoryTick, resolveLabelMode, seriesOpacity, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

export interface ColumnChartProps extends BaseChartProps {
  data: any[];
  index: string;
  categories: string[];
  seriesLabels?: Record<string, string>;
  stacked?: boolean;
  /** Normalise stacks to 100%. Implies stacked. */
  percent?: boolean;
  /** Colour each column of a single series by category instead of one colour per series. */
  colorByCategory?: boolean;
  /** Maximum bar thickness in px. Default 48. */
  maxBarSize?: number;
  referenceLines?: Array<{ y: number; label?: string; color?: string }>;
  onBarClick?: (datum: any, seriesKey: string) => void;
}

export function ColumnChart(props: ColumnChartProps) {
  const [card, plot] = splitCardProps(props);
  const series = buildSeries(props.categories, props.colors, props.seriesLabels, "square");
  const single = props.categories.length === 1 && props.colorByCategory;
  return (
    <ChartCard {...card} series={single ? [] : series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <ColumnPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function ColumnPlot({ ctx, data, index, series, seriesLabels, valueFormatter = DEFAULT_FORMATTER, labelFormatter, stacked = false, percent = false, colorByCategory = false, maxBarSize = 48, referenceLines, dataLabels, onBarClick, colors }: Omit<ColumnChartProps, CardKey> & { ctx: ChartContextValue; series: ReturnType<typeof buildSeries> }) {
  const keys = series.map((s) => s.key);
  const isStacked = stacked || percent;
  const fmt = percent ? (v: number) => `${Math.round(v * 100)}%` : valueFormatter;
  const labelMode = resolveLabelMode(dataLabels, "auto");
  const layout = useCartesianLayout(data, keys, index, fmt, ctx, { stacked: isStacked, labelFormatter, dataLabels: labelMode.mode !== "never" && !isStacked });
  const palette = colorByCategory ? buildSeries(data.map((_, i) => String(i)), colors).map((s) => s.color) : null;
  const slot = Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, data.length));
  const visibleCount = Math.max(1, series.filter((s) => !ctx.hiddenSeries.has(s.key)).length);
  const labelSlot = isStacked ? slot : slot / visibleCount;
  // All-or-nothing: if any label would not fit its slot, show none (consistency beats partial labels).
  const fmtLabel = labelMode.formatter ?? valueFormatter;
  const widest = !isStacked && labelMode.mode === "auto" ? Math.max(0, ...data.flatMap((d) => keys.map((k) => (Number.isFinite(Number(d[k])) ? estimateTextWidth(fmtLabel(Number(d[k])), labelMode.fontSize) : 0)))) : 0;
  const effectiveMode = labelMode.mode === "auto" && widest > labelSlot - 2 ? "never" : labelMode.mode;
  const barLabel = makeBarLabel(fmtLabel, labelMode.fontSize, effectiveMode, "vertical", labelMode.minMarkSize, isStacked ? "inside" : "outside", labelSlot);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={layout.margin} stackOffset={percent ? "expand" : "none"} barCategoryGap={ctx.settings.breakpoint === "xs" ? "15%" : "25%"} barGap={2} maxBarSize={maxBarSize}>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey={index} axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, layout.xAxis.angle === 0 ? slot : 90)} tickFormatter={labelFormatter as any} minTickGap={2} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={fmt} tickCount={layout.tickCount} />
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap: seriesLabels, labelFormatter, total: isStacked && !percent })} cursor={{ fill: "var(--vi-color-surface-cardHover)", opacity: 0.5 }} />
        {referenceLines?.map((r, i) => (
          <ReferenceLine key={i} y={r.y} stroke={r.color ?? "var(--vi-color-text-muted)"} strokeDasharray="4 4" label={r.label ? { value: r.label, position: "insideTopRight", fill: "var(--vi-color-text-secondary)", fontSize: layout.fontSize } : undefined} />
        ))}
        {series.map((s, si) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color}
            fillOpacity={seriesOpacity(s.key, ctx)}
            stackId={isStacked ? "stack" : undefined}
            hide={ctx.hiddenSeries.has(s.key)}
            radius={isStacked ? (si === series.length - 1 ? [3, 3, 0, 0] : 0) : [3, 3, 0, 0]}
            onClick={(d: any) => onBarClick?.(d?.payload ?? d, s.key)}
            cursor={onBarClick ? "pointer" : undefined}
            {...animationProps(ctx)}
          >
            {palette && data.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
            {effectiveMode !== "never" && <LabelList dataKey={s.key} content={barLabel as any} />}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
