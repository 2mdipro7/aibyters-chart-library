import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, rechartsTooltip, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, gridProps, makeCategoryTick, seriesOpacity, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

const ANOMALY_KEY = "_anomalyMarker";

export interface AnomalyTimelineProps extends BaseChartProps {
  data: any[];
  /** Key of the x-axis (time) field. */
  index: string;
  /** Key of the metric field. */
  valueKey: string;
  /** Boolean field marking a point as an anomaly. */
  anomalyKey: string;
  /** Human labels for the legend, e.g. `{ value: "CPU %", anomaly: "Spike" }`. Keys: the `valueKey` and `"anomaly"`. */
  seriesLabels?: Record<string, string>;
  onPointClick?: (datum: any) => void;
}

/**
 * Time series with anomalies highlighted as markers on top of the line. The anomaly colour
 * defaults to the theme's critical colour; pass two `colors` to override both.
 */
export function AnomalyTimeline(props: AnomalyTimelineProps) {
  const [card, plot] = splitCardProps(props);
  const palette = resolveColors(props.colors, 2);
  const anomalyColor = props.colors && props.colors.length > 1 ? palette[1] : chartVars.negative;
  const series: SeriesDescriptor[] = [
    { key: props.valueKey, label: props.seriesLabels?.[props.valueKey] ?? "Metric Value", color: palette[0], shape: "line" },
    { key: ANOMALY_KEY, label: props.seriesLabels?.anomaly ?? "Anomalies", color: anomalyColor, shape: "circle" },
  ];
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <AnomalyPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function AnomalyPlot({ ctx, data, index, valueKey, anomalyKey, series, valueFormatter = DEFAULT_FORMATTER, labelFormatter, onPointClick }: Omit<AnomalyTimelineProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[] }) {
  const rows = data.map((item) => ({ ...item, [ANOMALY_KEY]: item[anomalyKey] ? item[valueKey] : null }));
  const layout = useCartesianLayout(rows, [valueKey], index, valueFormatter, ctx, { labelFormatter });
  const [line, anomaly] = series;
  const r = ctx.isTouch ? 8 : 6;
  const nameMap = { [valueKey]: line.label, [ANOMALY_KEY]: anomaly.label };
  const slot = layout.xAxis.angle === 0 ? Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, rows.length)) : 90;
  const anomalyOpacity = seriesOpacity(ANOMALY_KEY, ctx);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={rows} margin={{ ...layout.margin, top: 12 }}>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey={index} axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, slot)} tickFormatter={labelFormatter as any} minTickGap={4} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={valueFormatter} tickCount={layout.tickCount} domain={["auto", "auto"]} />
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap, labelFormatter })} cursor={{ stroke: chartVars.axisLine }} />
        <Line
          type="monotone"
          dataKey={valueKey}
          name={line.label}
          stroke={line.color}
          strokeWidth={ctx.settings.strokeWidth}
          strokeOpacity={seriesOpacity(valueKey, ctx)}
          hide={ctx.hiddenSeries.has(valueKey)}
          dot={false}
          activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0, onClick: (_: any, p: any) => onPointClick?.(p?.payload) }}
          connectNulls
          {...animationProps(ctx)}
        />
        <Scatter
          dataKey={ANOMALY_KEY}
          name={anomaly.label}
          fill={anomaly.color}
          hide={ctx.hiddenSeries.has(ANOMALY_KEY)}
          shape={(p: any) => {
            if (p.payload?.[ANOMALY_KEY] === null || p.payload?.[ANOMALY_KEY] === undefined) return <g />;
            return (
              <g opacity={anomalyOpacity} onClick={() => onPointClick?.(p.payload)} style={{ cursor: onPointClick ? "pointer" : undefined }}>
                {/* invisible hit area keeps the touch target at 44px */}
                <circle cx={p.cx} cy={p.cy} r={22} fill="transparent" />
                <circle cx={p.cx} cy={p.cy} r={r + 3} fill={anomaly.color} fillOpacity={0.25} />
                <circle cx={p.cx} cy={p.cy} r={r} fill={anomaly.color} stroke={chartVars.surface} strokeWidth={1.5} />
              </g>
            );
          }}
          {...animationProps(ctx)}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
