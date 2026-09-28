import { useMemo } from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, rechartsTooltip, resolveColors, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, gridProps, makeBarLabel, makeCategoryTick, resolveLabelMode, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

export interface HistogramBin {
  binLabel: string;
  binMin: number;
  binMax: number;
  count: number;
}

export interface HistogramChartProps extends BaseChartProps {
  /** Raw numeric observations; the chart bins them. */
  data: number[];
  /** Number of equal-width bins. Default 10. */
  bins?: number;
  /** Bar colour. Defaults to the first theme palette colour (or `colors[0]`). */
  color?: string;
  /** Formatter for bin boundaries on the x-axis. Defaults to `valueFormatter`. */
  binFormatter?: (value: number) => string;
  /** Label for the count axis in the tooltip. Default "Count". */
  countLabel?: string;
  onBarClick?: (bin: HistogramBin) => void;
}

export function buildHistogramBins(data: number[], bins: number, fmt: (v: number) => string): HistogramBin[] {
  const finite = (data ?? []).filter((v) => Number.isFinite(v));
  if (finite.length === 0) return [];
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (min === max) return [{ binLabel: fmt(min), binMin: min, binMax: max, count: finite.length }];
  const n = Math.max(1, Math.floor(bins));
  const size = (max - min) / n;
  const counts = new Array<number>(n).fill(0);
  for (const v of finite) {
    let i = Math.floor((v - min) / size);
    if (i >= n) i = n - 1;
    counts[i]++;
  }
  return counts.map((count, i) => {
    const binMin = min + i * size;
    const binMax = min + (i + 1) * size;
    return { binLabel: `${fmt(binMin)} – ${fmt(binMax)}`, binMin, binMax, count };
  });
}

/** Frequency distribution of a numeric sample. Export rows are the computed bins. */
export function HistogramChart(props: HistogramChartProps) {
  const [card, plot] = splitCardProps(props);
  const fmt = props.binFormatter ?? props.valueFormatter ?? DEFAULT_FORMATTER;
  const chartData = useMemo(() => buildHistogramBins(props.data, props.bins ?? 10, fmt), [props.data, props.bins, fmt]);
  return (
    <ChartCard {...card} isEmpty={chartData.length === 0} exportData={props.exportData ?? chartData} exportColumns={props.exportColumns ?? ["binLabel", "binMin", "binMax", "count"]}>
      {(ctx) => <HistogramPlot ctx={ctx} chartData={chartData} {...plot} />}
    </ChartCard>
  );
}

function HistogramPlot({ ctx, chartData, color, colors, dataLabels, countLabel = "Count", onBarClick }: Omit<HistogramChartProps, CardKey> & { ctx: ChartContextValue; chartData: HistogramBin[] }) {
  const fill = color ?? resolveColors(colors, 1)[0];
  const countFmt = (v: number) => v.toLocaleString();
  const labelMode = resolveLabelMode(dataLabels, "never");
  const layout = useCartesianLayout(chartData, ["count"], "binLabel", countFmt, ctx, { dataLabels: labelMode.mode !== "never" });
  const barLabel = makeBarLabel(labelMode.formatter ?? countFmt, labelMode.fontSize, labelMode.mode, "vertical", labelMode.minMarkSize);
  const slot = Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, chartData.length));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={chartData} margin={layout.margin} barCategoryGap="8%">
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="binLabel" axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, layout.xAxis.angle === 0 ? slot : 90)} minTickGap={2} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={countFmt} tickCount={layout.tickCount} allowDecimals={false} />
        <Tooltip content={rechartsTooltip({ valueFormatter: countFmt, nameMap: { count: countLabel } })} cursor={{ fill: chartVars.surfaceHover, opacity: 0.5 }} />
        <Bar dataKey="count" name={countLabel} fill={fill} radius={[3, 3, 0, 0]} onClick={(d: any) => onBarClick?.(d?.payload ?? d)} cursor={onBarClick ? "pointer" : undefined} {...animationProps(ctx)}>
          {labelMode.mode !== "never" && <LabelList dataKey="count" content={barLabel as any} />}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
