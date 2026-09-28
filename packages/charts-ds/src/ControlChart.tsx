import { ComposedChart, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, rechartsTooltip, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, gridProps, makeCategoryTick, seriesOpacity, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

const OUTLIER_KEY = "_outlierValue";

export interface ControlChartProps extends BaseChartProps {
  data: any[];
  /** Key of the x-axis (sample / batch) field. */
  index: string;
  valueKey: string;
  /** Upper control limit. */
  ucl: number;
  /** Lower control limit. */
  lcl: number;
  /** Process mean / centre line. */
  mean: number;
  /** Human labels for the legend. Keys: `valueKey` and `"outlier"`. */
  seriesLabels?: Record<string, string>;
  /** Labels for the reference lines. Default `{ ucl: "UCL", lcl: "LCL", mean: "Mean" }`. */
  limitLabels?: { ucl?: string; lcl?: string; mean?: string };
  onPointClick?: (datum: any) => void;
}

/**
 * Statistical process control chart: measurements against a centre line and upper / lower
 * control limits. Points outside the limits are flagged in the theme's critical colour.
 */
export function ControlChart(props: ControlChartProps) {
  const [card, plot] = splitCardProps(props);
  const palette = resolveColors(props.colors, 1);
  const series: SeriesDescriptor[] = [
    { key: props.valueKey, label: props.seriesLabels?.[props.valueKey] ?? "Value", color: palette[0], shape: "line" },
    { key: OUTLIER_KEY, label: props.seriesLabels?.outlier ?? "Out of control", color: chartVars.negative, shape: "circle" },
  ];
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <ControlPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function ControlPlot({ ctx, data, index, valueKey, ucl, lcl, mean, series, valueFormatter = DEFAULT_FORMATTER, labelFormatter, limitLabels, onPointClick }: Omit<ControlChartProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[] }) {
  const rows = data.map((d) => {
    const v = Number(d[valueKey]);
    const out = v > ucl || v < lcl;
    return { ...d, [OUTLIER_KEY]: out ? v : null };
  });
  // Include the limits so the y-axis width is measured against every label the axis will show.
  const measure = [...rows, { [valueKey]: ucl }, { [valueKey]: lcl }];
  const layout = useCartesianLayout(measure, [valueKey], index, valueFormatter, ctx, { labelFormatter });
  const [line, outlier] = series;
  const fs = layout.fontSize;
  const r = ctx.isTouch ? 8 : 6;
  const labels = { ucl: "UCL", lcl: "LCL", mean: "Mean", ...limitLabels };
  const slot = layout.xAxis.angle === 0 ? Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, rows.length)) : 90;
  const outlierOpacity = seriesOpacity(OUTLIER_KEY, ctx);
  const showDots = rows.length <= 40;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={rows} margin={{ ...layout.margin, top: 12 }}>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey={index} axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(fs, layout.xAxis.angle, slot)} tickFormatter={labelFormatter as any} minTickGap={4} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(fs)} tickFormatter={valueFormatter} tickCount={layout.tickCount} domain={["auto", "auto"]} />
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap: { [valueKey]: line.label, [OUTLIER_KEY]: outlier.label }, labelFormatter })} cursor={{ stroke: chartVars.axisLine }} />
        <ReferenceLine y={ucl} stroke={chartVars.negative} strokeDasharray="4 4" label={{ position: "insideTopLeft", value: `${labels.ucl} ${valueFormatter(ucl)}`, fill: chartVars.negative, fontSize: fs }} />
        <ReferenceLine y={mean} stroke={chartVars.info} strokeDasharray="4 4" label={{ position: "insideTopLeft", value: `${labels.mean} ${valueFormatter(mean)}`, fill: chartVars.info, fontSize: fs }} />
        <ReferenceLine y={lcl} stroke={chartVars.negative} strokeDasharray="4 4" label={{ position: "insideBottomLeft", value: `${labels.lcl} ${valueFormatter(lcl)}`, fill: chartVars.negative, fontSize: fs }} />
        <Line
          type="monotone"
          dataKey={valueKey}
          name={line.label}
          stroke={line.color}
          strokeWidth={ctx.settings.strokeWidth}
          strokeOpacity={seriesOpacity(valueKey, ctx)}
          hide={ctx.hiddenSeries.has(valueKey)}
          dot={showDots ? { r: Math.max(2, ctx.settings.dotRadius - 3), strokeWidth: 0, fill: line.color, fillOpacity: seriesOpacity(valueKey, ctx) } : false}
          activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0, onClick: (_: any, p: any) => onPointClick?.(p?.payload) }}
          connectNulls
          {...animationProps(ctx)}
        />
        <Scatter
          dataKey={OUTLIER_KEY}
          name={outlier.label}
          fill={outlier.color}
          hide={ctx.hiddenSeries.has(OUTLIER_KEY)}
          shape={(p: any) => {
            if (p.payload?.[OUTLIER_KEY] === null || p.payload?.[OUTLIER_KEY] === undefined) return <g />;
            return (
              <g opacity={outlierOpacity} onClick={() => onPointClick?.(p.payload)} style={{ cursor: onPointClick ? "pointer" : undefined }}>
                <circle cx={p.cx} cy={p.cy} r={22} fill="transparent" />
                <circle cx={p.cx} cy={p.cy} r={r + 3} fill={outlier.color} fillOpacity={0.25} />
                <circle cx={p.cx} cy={p.cy} r={r} fill={outlier.color} stroke={chartVars.surface} strokeWidth={1.5} />
              </g>
            );
          }}
          {...animationProps(ctx)}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
