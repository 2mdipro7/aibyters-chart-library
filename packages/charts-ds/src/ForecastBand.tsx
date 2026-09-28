import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { ChartTooltip, chartVars, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor, type TooltipRow } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, gridProps, makeCategoryTick, seriesOpacity, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

const BAND_KEY = "_confidenceBand";

export interface ForecastBandProps extends BaseChartProps {
  data: any[];
  /** Key of the x-axis (time) field. */
  index: string;
  actualKey: string;
  forecastKey: string;
  lowerBandKey: string;
  upperBandKey: string;
  /** Human labels for the legend. Keys: `actualKey`, `forecastKey` and `"band"`. */
  seriesLabels?: Record<string, string>;
}

/**
 * Historical actuals, a dashed forecast line and a shaded confidence interval.
 * The legend is rendered outside the plot; the band can be toggled like any other series.
 */
export function ForecastBand(props: ForecastBandProps) {
  const [card, plot] = splitCardProps(props);
  const palette = resolveColors(props.colors, 2);
  const series: SeriesDescriptor[] = [
    { key: props.actualKey, label: props.seriesLabels?.[props.actualKey] ?? "Actual", color: palette[0], shape: "line" },
    { key: props.forecastKey, label: props.seriesLabels?.[props.forecastKey] ?? "Forecast", color: palette[1], shape: "dashed" },
    { key: BAND_KEY, label: props.seriesLabels?.band ?? "Confidence Interval", color: palette[1], shape: "square" },
  ];
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <ForecastPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function ForecastPlot({ ctx, data, index, actualKey, forecastKey, lowerBandKey, upperBandKey, series, valueFormatter = DEFAULT_FORMATTER, labelFormatter }: Omit<ForecastBandProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[] }) {
  const rows = data.map((item) => ({
    ...item,
    [BAND_KEY]: item[lowerBandKey] != null && item[upperBandKey] != null ? [item[lowerBandKey], item[upperBandKey]] : null,
  }));
  const layout = useCartesianLayout(rows, [actualKey, forecastKey, lowerBandKey, upperBandKey], index, valueFormatter, ctx, { labelFormatter });
  const [actual, forecast, band] = series;
  const slot = layout.xAxis.angle === 0 ? Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, rows.length)) : 90;
  const dots = rows.length <= 12;

  const tooltip = (p: any) => {
    const d = p?.payload?.[0]?.payload;
    if (!p?.active || !d) return null;
    const tRows: TooltipRow[] = [
      { key: actualKey, label: actual.label, value: d[actualKey] },
      { key: forecastKey, label: forecast.label, value: d[forecastKey] },
    ];
    if (d[BAND_KEY]) tRows.push({ key: BAND_KEY, label: band.label, value: `${valueFormatter(Number(d[BAND_KEY][0]))} – ${valueFormatter(Number(d[BAND_KEY][1]))}` });
    return <ChartTooltip title={labelFormatter ? labelFormatter(p.label) : p.label} rows={tRows.map((r, i) => ({ ...r, color: series[i].color }))} valueFormatter={valueFormatter} hidden={ctx.hiddenSeries} />;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={rows} margin={{ ...layout.margin, top: 12 }}>
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey={index} axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, slot)} tickFormatter={labelFormatter as any} minTickGap={4} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={valueFormatter} tickCount={layout.tickCount} domain={["auto", "auto"]} />
        <Tooltip content={tooltip} cursor={{ stroke: chartVars.axisLine }} />
        <Area type="monotone" dataKey={BAND_KEY} name={band.label} fill={band.color} stroke="none" fillOpacity={seriesOpacity(BAND_KEY, ctx, 0.18)} hide={ctx.hiddenSeries.has(BAND_KEY)} connectNulls {...animationProps(ctx)} />
        <Line type="monotone" dataKey={actualKey} name={actual.label} stroke={actual.color} strokeWidth={ctx.settings.strokeWidth} strokeOpacity={seriesOpacity(actualKey, ctx)} hide={ctx.hiddenSeries.has(actualKey)} dot={dots ? { r: ctx.settings.dotRadius - 2, strokeWidth: 0, fill: actual.color } : false} activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0 }} connectNulls {...animationProps(ctx)} />
        <Line type="monotone" dataKey={forecastKey} name={forecast.label} stroke={forecast.color} strokeWidth={ctx.settings.strokeWidth} strokeDasharray="6 4" strokeOpacity={seriesOpacity(forecastKey, ctx)} hide={ctx.hiddenSeries.has(forecastKey)} dot={false} activeDot={{ r: ctx.settings.dotRadius, strokeWidth: 0 }} connectNulls {...animationProps(ctx)} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
