import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ReferenceLine } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { rechartsTooltip, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, buildSeries, gridProps, makeCategoryTick, seriesOpacity, splitCardProps, useCartesianLayout, resolveLabelMode, type CardKey } from "./internal/cartesian";

export interface LineChartProps extends BaseChartProps {
  data: any[];
  /** Key of the x-axis (category / time) field. */
  index: string;
  /** Keys of the series fields. */
  categories: string[];
  /** Human labels per series key, e.g. `{ rev: "Revenue" }`. */
  seriesLabels?: Record<string, string>;
  /** Curve interpolation. Default "monotone". */
  curve?: "monotone" | "linear" | "step";
  /** Draw a dot at every data point (auto: only when there are few points). */
  showDots?: boolean | "auto";
  /** Horizontal reference lines, e.g. targets. */
  referenceLines?: Array<{ y: number; label?: string; color?: string; dashed?: boolean }>;
  /** Y-axis domain override. */
  yDomain?: [number | "auto", number | "auto"];
  onPointClick?: (datum: any, seriesKey: string) => void;
}

export function LineChart(props: LineChartProps) {
  const [card, plot] = splitCardProps(props);
  const series = buildSeries(props.categories, props.colors, props.seriesLabels, "line");
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <LinePlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function LinePlot({
  ctx,
  data,
  index,
  series,
  seriesLabels,
  valueFormatter = DEFAULT_FORMATTER,
  labelFormatter,
  curve = "monotone",
  showDots = "auto",
  referenceLines,
  yDomain,
  dataLabels,
  onPointClick,
}: Omit<LineChartProps, CardKey> & { ctx: ChartContextValue; series: ReturnType<typeof buildSeries> }) {
  const categories = series.map((s) => s.key);
  const labelMode = resolveLabelMode(dataLabels, "never");
  const layout = useCartesianLayout(data, categories, index, valueFormatter, ctx, { labelFormatter, dataLabels: labelMode.mode !== "never" });
  const dots = showDots === "auto" ? data.length <= 12 : showDots;
  const labelFmt = labelMode.formatter ?? valueFormatter;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={layout.margin}>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis
          dataKey={index}
          axisLine={false}
          tickLine={false}
          interval={layout.xAxis.interval}
          height={layout.xAxis.height}
          tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, layout.xAxis.angle === 0 ? Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, data.length)) : 90)}
          tickFormatter={labelFormatter as any}
          minTickGap={4}
        />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={valueFormatter} tickCount={layout.tickCount} domain={yDomain as any} />
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap: seriesLabels, labelFormatter })} cursor={{ stroke: "var(--vi-color-surface-border)" }} />
        {referenceLines?.map((r, i) => (
          <ReferenceLine key={i} y={r.y} stroke={r.color ?? "var(--vi-color-text-muted)"} strokeDasharray={r.dashed === false ? undefined : "4 4"} label={r.label ? { value: r.label, position: "insideTopRight", fill: "var(--vi-color-text-secondary)", fontSize: layout.fontSize } : undefined} />
        ))}
        {series.map((s) => (
          <Line
            key={s.key}
            type={curve}
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={ctx.settings.strokeWidth}
            strokeOpacity={seriesOpacity(s.key, ctx)}
            hide={ctx.hiddenSeries.has(s.key)}
            dot={dots ? { r: ctx.settings.dotRadius - 2, strokeWidth: 0, fill: s.color } : false}
            activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0, onClick: (_: any, p: any) => onPointClick?.(p?.payload, s.key) }}
            connectNulls
            {...animationProps(ctx)}
          >
            {labelMode.mode !== "never" && data.length <= 24 && (
              <LabelList dataKey={s.key} position="top" offset={6} formatter={(v: any) => labelFmt(Number(v))} fill="var(--vi-color-text-secondary)" fontSize={labelMode.fontSize} />
            )}
          </Line>
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
