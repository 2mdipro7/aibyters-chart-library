import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, rechartsTooltip, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, buildSeries, seriesOpacity, splitCardProps, type CardKey } from "./internal/cartesian";

export interface RadarChartProps extends BaseChartProps {
  data: any[];
  index: string;
  categories: string[];
  seriesLabels?: Record<string, string>;
  /** Fixed max for the radius axis (e.g. 100 for scores). */
  max?: number;
  fillOpacity?: number;
}

export function RadarChart(props: RadarChartProps) {
  const [card, plot] = splitCardProps(props);
  const series = buildSeries(props.categories, props.colors, props.seriesLabels, "line");
  return (
    <ChartCard {...card} height={card.height ?? 300} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <RadarPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function RadarPlot({ ctx, data, index, series, seriesLabels, valueFormatter = DEFAULT_FORMATTER, max, fillOpacity = 0.18 }: Omit<RadarChartProps, CardKey> & { ctx: ChartContextValue; series: ReturnType<typeof buildSeries> }) {
  const fs = ctx.settings.fontSize;
  const labelMax = Math.max(48, Math.min(120, (ctx.width || 300) * 0.22));
  const radius = ctx.settings.breakpoint === "xs" ? "62%" : "72%";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius={radius} data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <PolarGrid stroke={chartVars.grid} />
        <PolarAngleAxis dataKey={index} tick={{ fill: chartVars.axisText, fontSize: fs, fontFamily: chartVars.fontBody }} tickFormatter={(v: any) => truncateToWidth(String(v), labelMax, fs)} />
        <PolarRadiusAxis angle={90} domain={[0, max ?? "auto"]} tick={{ fill: chartVars.textMuted, fontSize: fs - 1 }} axisLine={false} tickFormatter={valueFormatter} tickCount={ctx.settings.breakpoint === "xs" ? 3 : 4} />
        {series.map((s) => (
          <Radar key={s.key} name={s.label} dataKey={s.key} stroke={s.color} fill={s.color} fillOpacity={ctx.hiddenSeries.has(s.key) ? 0 : fillOpacity * (ctx.highlightedSeries && ctx.highlightedSeries !== s.key ? 0.3 : 1)} strokeOpacity={seriesOpacity(s.key, ctx)} strokeWidth={ctx.settings.strokeWidth} hide={ctx.hiddenSeries.has(s.key)} dot={{ r: 2.5, strokeWidth: 0, fill: s.color }} {...animationProps(ctx)} />
        ))}
        <Tooltip content={rechartsTooltip({ valueFormatter, hidden: ctx.hiddenSeries, nameMap: seriesLabels })} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
