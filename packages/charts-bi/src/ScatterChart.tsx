import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { computeAxisWidth, rechartsTooltip, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, gridProps, splitCardProps, type CardKey } from "./internal/cartesian";

export interface ScatterChartProps extends BaseChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  /** Optional field used to size points (bubble chart). */
  sizeKey?: string;
  /** Optional field used to colour points by group; one legend entry per group. */
  groupKey?: string;
  /** Field used for the point name in tooltips. */
  nameKey?: string;
  xLabel?: string;
  yLabel?: string;
  xFormatter?: (v: number) => string;
  yFormatter?: (v: number) => string;
  /** Bubble radius range in px. Default [4, 22]. */
  sizeRange?: [number, number];
  referenceLines?: Array<{ x?: number; y?: number; label?: string; color?: string }>;
  onPointClick?: (datum: any) => void;
}

export function ScatterChart(props: ScatterChartProps) {
  const [card, plot] = splitCardProps(props);
  const groups = props.groupKey ? Array.from(new Set((props.data ?? []).map((d) => String(d[props.groupKey!])))) : [];
  const palette = resolveColors(props.colors, Math.max(groups.length, 1));
  const series: SeriesDescriptor[] = groups.map((g, i) => ({ key: g, label: g, color: palette[i], shape: "circle" }));
  return (
    <ChartCard {...card} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <ScatterPlot ctx={ctx} series={series} palette={palette} {...plot} />}
    </ChartCard>
  );
}

function ScatterPlot({ ctx, data, xKey, yKey, sizeKey, groupKey, nameKey, xLabel, yLabel, xFormatter, yFormatter, valueFormatter = DEFAULT_FORMATTER, sizeRange = [4, 22], referenceLines, onPointClick, series, palette }: Omit<ScatterChartProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[]; palette: string[] }) {
  const fx = xFormatter ?? valueFormatter;
  const fy = yFormatter ?? valueFormatter;
  const fs = ctx.settings.fontSize;
  const yWidth = computeAxisWidth(data.map((d) => Number(d[yKey])), fy, { fontSize: fs });
  const sizes = sizeKey ? data.map((d) => Number(d[sizeKey])).filter(Number.isFinite) : [];
  const zRange: [number, number] = [Math.PI * sizeRange[0] ** 2, Math.PI * sizeRange[1] ** 2];
  const groupsData = series.length ? series.map((s) => ({ s, rows: data.filter((d) => String(d[groupKey!]) === s.key) })) : [{ s: { key: "__all", label: "", color: palette[0], shape: "circle" as const }, rows: data }];
  const r = ctx.isTouch ? 6 : 4;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsScatterChart margin={{ top: 8, right: 16, bottom: xLabel ? 18 : 4, left: 0 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} type="number" name={xLabel ?? xKey} axisLine={false} tickLine={false} tick={axisTick(fs)} tickFormatter={fx} tickCount={ctx.settings.tickCount} height={xLabel ? 36 : 24} label={xLabel ? { value: xLabel, position: "insideBottom", offset: -4, fill: "var(--vi-color-text-secondary)", fontSize: fs } : undefined} />
        <YAxis dataKey={yKey} type="number" name={yLabel ?? yKey} axisLine={false} tickLine={false} width={yWidth + (yLabel ? 14 : 0)} tick={axisTick(fs)} tickFormatter={fy} tickCount={ctx.settings.tickCount} label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: "var(--vi-color-text-secondary)", fontSize: fs } : undefined} />
        {sizeKey && <ZAxis dataKey={sizeKey} type="number" range={zRange} domain={[Math.min(...sizes, 0), Math.max(...sizes, 1)]} name={sizeKey} />}
        {!sizeKey && <ZAxis range={[Math.PI * r * r, Math.PI * r * r]} />}
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "var(--vi-color-surface-border)" }}
          content={(p: any) => {
            const d = p?.payload?.[0]?.payload;
            if (!p?.active || !d) return null;
            const rows = [
              { key: "x", label: xLabel ?? xKey, value: fx(Number(d[xKey])) },
              { key: "y", label: yLabel ?? yKey, value: fy(Number(d[yKey])) },
              ...(sizeKey ? [{ key: "z", label: sizeKey, value: valueFormatter(Number(d[sizeKey])) }] : []),
            ];
            const Body = rechartsTooltip({});
            return <Body active payload={rows.map((r) => ({ dataKey: r.key, name: r.label, value: r.value }))} label={nameKey ? d[nameKey] : groupKey ? d[groupKey] : undefined} />;
          }}
        />
        {referenceLines?.map((l, i) => (
          <ReferenceLine key={i} x={l.x} y={l.y} stroke={l.color ?? "var(--vi-color-text-muted)"} strokeDasharray="4 4" label={l.label ? { value: l.label, fill: "var(--vi-color-text-secondary)", fontSize: fs, position: l.x !== undefined ? "insideTopRight" : "insideTopLeft" } : undefined} />
        ))}
        {groupsData.map(({ s, rows }) => (
          <Scatter key={s.key} name={s.label} data={rows} fill={s.color} fillOpacity={ctx.hiddenSeries.has(s.key) ? 0 : ctx.highlightedSeries && ctx.highlightedSeries !== s.key ? 0.2 : 0.75} stroke={s.color} strokeWidth={1} hide={ctx.hiddenSeries.has(s.key)} onClick={(d: any) => onPointClick?.(d?.payload ?? d)} cursor={onPointClick ? "pointer" : undefined} {...animationProps(ctx)} />
        ))}
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
