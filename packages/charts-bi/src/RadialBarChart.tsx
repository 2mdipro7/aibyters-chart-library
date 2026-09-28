import { ChartCard } from "@aibyters/layout";
import { chartVars, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";

export interface RadialBarChartProps extends BaseChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  /** Upper bound of every ring (e.g. 100 for percentages). Defaults to the largest value. */
  max?: number;
  /** Legend shows the value next to each name. Default true. */
  legendValues?: boolean;
  /** Text in the centre, e.g. a total. */
  centerValue?: string;
  centerLabel?: string;
  onRingClick?: (datum: any) => void;
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => ({ x: cx + r * Math.cos((a - 90) * (Math.PI / 180)), y: cy + r * Math.sin((a - 90) * (Math.PI / 180)) });
  const s = p(a0);
  const e = p(Math.min(a1, a0 + 359.99));
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/**
 * Concentric progress rings drawn with plain SVG. Values live in the legend (never rotated
 * inside the rings) and each ring is normalised to `max`, so rings stay legible at any size.
 */
export function RadialBarChart(props: RadialBarChartProps) {
  const [card, plot] = splitCardProps(props);
  const { data, dataKey, nameKey, colors, legendValues = true, valueFormatter = DEFAULT_FORMATTER } = props;
  const rows = (data ?? []).map((d, i) => ({ ...d, __key: `${d[nameKey]}__${i}` }));
  const palette = resolveColors(colors, rows.length);
  const series: SeriesDescriptor[] = rows.map((d, i) => ({ key: d.__key, label: String(d[nameKey]), color: palette[i], shape: "circle" }));
  const values = legendValues ? Object.fromEntries(rows.map((d) => [d.__key, valueFormatter(Number(d[dataKey]) || 0)])) : undefined;
  return (
    <ChartCard {...card} height={card.height ?? 260} legend={card.legend ?? { position: "right" }} series={series} legendValues={values} isEmpty={rows.length === 0} exportData={props.exportData ?? data}>
      {(ctx) => <RadialPlot ctx={ctx} rows={rows} series={series} {...plot} />}
    </ChartCard>
  );
}

function RadialPlot({ ctx, rows, series, dataKey, max, valueFormatter = DEFAULT_FORMATTER, centerValue, centerLabel, onRingClick }: Omit<RadialBarChartProps, CardKey | "data"> & { ctx: ChartContextValue; rows: any[]; series: SeriesDescriptor[] }) {
  const w = ctx.width || 260;
  const h = ctx.height;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 6;
  const visible = rows.map((r, i) => ({ r, s: series[i] })).filter((x) => !ctx.hiddenSeries.has(x.s.key));
  const top = max ?? Math.max(1, ...visible.map((x) => Number(x.r[dataKey]) || 0));
  const n = Math.max(1, visible.length);
  const inner = R * (centerValue ? 0.42 : 0.28);
  const band = (R - inner) / n;
  const thickness = Math.max(4, Math.min(22, band * 0.72));
  const fs = ctx.settings.fontSize;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Radial bar chart" style={{ display: "block", fontFamily: chartVars.fontBody }}>
      {visible.map(({ r, s }, i) => {
        const radius = R - band * i - band / 2;
        const v = Math.max(0, Math.min(1, (Number(r[dataKey]) || 0) / top));
        const dim = ctx.highlightedSeries && ctx.highlightedSeries !== s.key;
        return (
          <g key={s.key} onClick={() => onRingClick?.(r)} style={{ cursor: onRingClick ? "pointer" : "default" }}>
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--vi-color-surface-cardHover)" strokeWidth={thickness} />
            {v > 0 && (
              <path d={arc(cx, cy, radius, 0, v * 360)} fill="none" stroke={s.color} strokeOpacity={dim ? 0.25 : 1} strokeWidth={thickness} strokeLinecap={v < 1 ? "round" : "butt"} style={ctx.animate ? { transition: "stroke-dashoffset 600ms" } : undefined}>
                <title>{`${s.label}: ${valueFormatter(Number(r[dataKey]) || 0)}`}</title>
              </path>
            )}
          </g>
        );
      })}
      {centerValue && (
        <text x={cx} y={cy - (centerLabel ? fs * 0.5 : 0)} textAnchor="middle" dominantBaseline="central" fontSize={Math.max(14, Math.min(26, inner / 2))} fontWeight={700} fill={chartVars.textPrimary} style={{ fontVariantNumeric: "tabular-nums" }}>{centerValue}</text>
      )}
      {centerLabel && (
        <text x={cx} y={cy + (centerValue ? fs * 1.1 : 0)} textAnchor="middle" dominantBaseline="central" fontSize={fs - 1} fill={chartVars.textSecondary}>{centerLabel}</text>
      )}
    </svg>
  );
}
