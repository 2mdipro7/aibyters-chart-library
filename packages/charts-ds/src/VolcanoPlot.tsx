import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { ChartTooltip, chartVars, computeAxisWidth, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { splitCardProps, axisTick, gridProps, type CardKey } from "./internal/cartesian";

export interface VolcanoPlotDataPoint {
  id: string;
  /** Log2 fold change. */
  x: number;
  /** -Log10 adjusted p-value. */
  y: number;
  name?: string;
  [key: string]: any;
}

export type VolcanoCategory = "up" | "down" | "ns";

export interface VolcanoPlotProps extends Omit<BaseChartProps, "colors"> {
  data: VolcanoPlotDataPoint[];
  /** Significance threshold on the y-axis, e.g. 1.3 for p = 0.05. Default 1.3. */
  pThreshold?: number;
  /** Fold-change threshold on the x-axis (absolute Log2FC). Default 1. */
  fcThreshold?: number;
  /** Colours per category. Default: critical (up), info (down), muted (ns). */
  colors?: Partial<Record<VolcanoCategory, string>>;
  /** Legend labels per category. Default `{ up: "Up", down: "Down", ns: "NS" }`. */
  seriesLabels?: Partial<Record<VolcanoCategory, string>>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  xFormatter?: (v: number) => string;
  yFormatter?: (v: number) => string;
  onPointClick?: (point: VolcanoPlotDataPoint) => void;
}

const DEFAULT_LABELS: Record<VolcanoCategory, string> = { up: "Up", down: "Down", ns: "NS" };
const ORDER: VolcanoCategory[] = ["down", "ns", "up"];

function categorise(data: VolcanoPlotDataPoint[], pThreshold: number, fcThreshold: number): Record<VolcanoCategory, VolcanoPlotDataPoint[]> {
  const out: Record<VolcanoCategory, VolcanoPlotDataPoint[]> = { up: [], down: [], ns: [] };
  for (const p of data ?? []) {
    if (p.y >= pThreshold && p.x >= fcThreshold) out.up.push(p);
    else if (p.y >= pThreshold && p.x <= -fcThreshold) out.down.push(p);
    else out.ns.push(p);
  }
  return out;
}

/** Significance vs fold change scatter used for differential expression analysis. */
export function VolcanoPlot(props: VolcanoPlotProps) {
  const [card, plot] = splitCardProps(props);
  const colors: Record<VolcanoCategory, string> = { up: chartVars.negative, down: chartVars.info, ns: chartVars.textMuted, ...props.colors };
  const labels = { ...DEFAULT_LABELS, ...props.seriesLabels };
  const series: SeriesDescriptor[] = (["up", "down", "ns"] as VolcanoCategory[]).map((k) => ({ key: k, label: labels[k], color: colors[k], shape: "circle" }));
  return (
    <ChartCard {...card} height={card.height ?? 360} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <VolcanoPlotBody ctx={ctx} series={series} resolvedColors={colors} {...plot} />}
    </ChartCard>
  );
}

function VolcanoPlotBody({
  ctx,
  data,
  pThreshold = 1.3,
  fcThreshold = 1.0,
  series,
  resolvedColors,
  xAxisLabel = "Log2 Fold Change",
  yAxisLabel = "-Log10 Adjusted P-value",
  xFormatter,
  yFormatter,
  valueFormatter,
  onPointClick,
}: Omit<VolcanoPlotProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[]; resolvedColors: Record<VolcanoCategory, string> }) {
  const groups = useMemo(() => categorise(data, pThreshold, fcThreshold), [data, pThreshold, fcThreshold]);
  const fx = xFormatter ?? valueFormatter ?? ((v: number) => (Math.round(v * 100) / 100).toString());
  const fy = yFormatter ?? valueFormatter ?? ((v: number) => (Math.round(v * 100) / 100).toString());
  const fs = ctx.settings.fontSize;
  const yWidth = computeAxisWidth(data.map((d) => d.y), fy, { fontSize: fs, tickCount: ctx.settings.tickCount });
  const r = ctx.isTouch ? 5 : ctx.settings.breakpoint === "xs" ? 2.5 : 3.5;
  const area = Math.PI * r * r;
  const animate = ctx.animate && data.length <= 500;
  const byKey = Object.fromEntries(series.map((s) => [s.key, s])) as Record<VolcanoCategory, SeriesDescriptor>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 16, bottom: xAxisLabel ? 18 : 4, left: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis type="number" dataKey="x" name={xAxisLabel} axisLine={false} tickLine={false} tick={axisTick(fs)} tickFormatter={fx} tickCount={ctx.settings.tickCount} height={xAxisLabel ? 36 : 24} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4, fill: chartVars.axisText, fontSize: fs } : undefined} />
        <YAxis type="number" dataKey="y" name={yAxisLabel} axisLine={false} tickLine={false} width={yWidth + (yAxisLabel ? 14 : 0)} tick={axisTick(fs)} tickFormatter={fy} tickCount={ctx.settings.tickCount} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", fill: chartVars.axisText, fontSize: fs } : undefined} />
        <ZAxis range={[area, area]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: chartVars.axisLine }}
          content={(p: any) => {
            const d = p?.payload?.[0]?.payload as VolcanoPlotDataPoint | undefined;
            if (!p?.active || !d) return null;
            const cat: VolcanoCategory = d.y >= pThreshold && d.x >= fcThreshold ? "up" : d.y >= pThreshold && d.x <= -fcThreshold ? "down" : "ns";
            return (
              <ChartTooltip
                title={d.name || d.id}
                rows={[
                  { key: "cat", label: "Category", value: byKey[cat].label, color: resolvedColors[cat] },
                  { key: "x", label: xAxisLabel, value: fx(d.x) },
                  { key: "y", label: yAxisLabel, value: fy(d.y) },
                ]}
              />
            );
          }}
        />
        <ReferenceLine x={-fcThreshold} stroke={chartVars.axisLine} strokeDasharray="3 3" />
        <ReferenceLine x={fcThreshold} stroke={chartVars.axisLine} strokeDasharray="3 3" />
        <ReferenceLine y={pThreshold} stroke={chartVars.axisLine} strokeDasharray="3 3" />
        {ORDER.map((k) => {
          const s = byKey[k];
          const hidden = ctx.hiddenSeries.has(k);
          const dim = ctx.highlightedSeries !== null && ctx.highlightedSeries !== k;
          const base = k === "ns" ? 0.45 : 0.8;
          return (
            <Scatter
              key={k}
              name={s.label}
              data={groups[k]}
              fill={s.color}
              fillOpacity={hidden ? 0 : dim ? base * 0.25 : base}
              hide={hidden}
              onClick={(d: any) => onPointClick?.(d?.payload ?? d)}
              cursor={onPointClick ? "pointer" : undefined}
              isAnimationActive={animate}
              animationDuration={500}
            />
          );
        })}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
