import { ChartCard } from "@aibyters/layout";
import { chartVars, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";

export interface GaugeBand {
  /** Upper bound of the band (lower bound is the previous band's `to` or `min`). */
  to: number;
  color: string;
  label?: string;
}

export interface GaugeChartProps extends BaseChartProps {
  value: number;
  min?: number;
  max?: number;
  /** Coloured bands drawn on the track (e.g. red < 50, amber < 75, green ≤ 100). */
  bands?: GaugeBand[];
  /** @deprecated use `bands`. Threshold list: colour applies when value >= threshold. */
  thresholds?: Array<{ value: number; color: string }>;
  /** Target marker on the arc. */
  target?: number;
  /** Text under the value, e.g. a unit or status. */
  caption?: string;
  /** Arc sweep in degrees (180 = half circle, 270 = three-quarter). Default 180. */
  sweep?: 180 | 270;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function GaugeChart(props: GaugeChartProps) {
  const [card, plot] = splitCardProps(props);
  return (
    <ChartCard {...card} height={card.height ?? (props.sweep === 270 ? 240 : 190)} legend={false}>
      {(ctx) => <GaugePlot ctx={ctx} {...plot} />}
    </ChartCard>
  );
}

function GaugePlot({ ctx, value, min = 0, max = 100, bands, thresholds, target, caption, sweep = 180, valueFormatter = DEFAULT_FORMATTER }: Omit<GaugeChartProps, CardKey> & { ctx: ChartContextValue }) {
  const w = ctx.width || 300;
  const h = ctx.height;
  const stroke = Math.max(10, Math.min(22, w / 14));
  const start = sweep === 180 ? -90 : -135;
  const end = sweep === 180 ? 90 : 135;
  const r = Math.min(w / 2 - stroke, sweep === 180 ? h - stroke - 8 : h / 2 - stroke / 2 - 4);
  const cx = w / 2;
  const cy = sweep === 180 ? h - stroke / 2 - 4 : h / 2 + (sweep === 270 ? 6 : 0);
  const clamp = Math.min(Math.max(value, min), max);
  const t = (max - min) > 0 ? (clamp - min) / (max - min) : 0;
  const angle = start + t * (end - start);

  let resolvedBands: GaugeBand[] | undefined = bands;
  if (!resolvedBands && thresholds?.length) {
    const sorted = [...thresholds].sort((a, b) => a.value - b.value);
    resolvedBands = sorted.map((th, i) => ({ to: sorted[i + 1]?.value ?? max, color: th.color }));
    if (sorted[0].value > min) resolvedBands.unshift({ to: sorted[0].value, color: chartVars.textMuted });
  }
  let activeColor: string = chartVars.accent;
  if (resolvedBands) {
    const band = resolvedBands.find((b) => clamp <= b.to) ?? resolvedBands[resolvedBands.length - 1];
    activeColor = band.color;
  }
  const fs = ctx.settings.fontSize;
  const valueSize = Math.max(18, Math.min(34, r / 2.2));
  const tgt = target !== undefined ? polar(cx, cy, r, start + ((Math.min(Math.max(target, min), max) - min) / (max - min || 1)) * (end - start)) : null;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Gauge: ${valueFormatter(value)} of ${valueFormatter(max)}`} style={{ display: "block", fontFamily: chartVars.fontBody }}>
      <path d={arc(cx, cy, r, start, end)} fill="none" stroke="var(--vi-color-surface-cardHover)" strokeWidth={stroke} strokeLinecap="round" />
      {resolvedBands && (() => {
        let from = min;
        return resolvedBands.map((b, i) => {
          const a0 = start + ((from - min) / (max - min || 1)) * (end - start);
          const a1 = start + ((Math.min(b.to, max) - min) / (max - min || 1)) * (end - start);
          from = b.to;
          return a1 > a0 ? <path key={i} d={arc(cx, cy, r, a0, a1)} fill="none" stroke={b.color} strokeOpacity={0.25} strokeWidth={stroke} /> : null;
        });
      })()}
      {t > 0 && <path d={arc(cx, cy, r, start, angle)} fill="none" stroke={activeColor} strokeWidth={stroke} strokeLinecap="round" style={ctx.animate ? { transition: "d 500ms ease" } : undefined} />}
      {tgt && <circle cx={tgt.x} cy={tgt.y} r={stroke / 2 + 2} fill="none" stroke={chartVars.textPrimary} strokeWidth={2}><title>Target {valueFormatter(target!)}</title></circle>}
      <text x={cx} y={sweep === 180 ? cy - valueSize * 0.55 : cy - 4} textAnchor="middle" dominantBaseline="central" fontSize={valueSize} fontWeight={700} fill={chartVars.textPrimary} style={{ fontVariantNumeric: "tabular-nums" }}>
        {valueFormatter(value)}
      </text>
      {caption && (
        <text x={cx} y={sweep === 180 ? cy - 2 : cy + valueSize * 0.75} textAnchor="middle" dominantBaseline={sweep === 180 ? "auto" : "central"} fontSize={fs} fill={chartVars.textSecondary}>
          {caption}
        </text>
      )}
      <text x={polar(cx, cy, r, start).x} y={polar(cx, cy, r, start).y + stroke} textAnchor="middle" fontSize={fs - 1} fill={chartVars.textMuted}>{valueFormatter(min)}</text>
      <text x={polar(cx, cy, r, end).x} y={polar(cx, cy, r, end).y + stroke} textAnchor="middle" fontSize={fs - 1} fill={chartVars.textMuted}>{valueFormatter(max)}</text>
    </svg>
  );
}
