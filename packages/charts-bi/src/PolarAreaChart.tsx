import { ChartCard } from "@aibyters/layout";
import { chartVars, labelFits, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";

export interface PolarAreaChartProps extends BaseChartProps {
  data: Array<{ name: string; value: number }>;
  onSliceClick?: (datum: { name: string; value: number }) => void;
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => ({ x: cx + r * Math.cos((a - 90) * (Math.PI / 180)), y: cy + r * Math.sin((a - 90) * (Math.PI / 180)) });
  const s = p(a0);
  const e = p(a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

/** Coxcomb / Nightingale rose. Names live in the legend; the plot only draws a value label when it fits. */
export function PolarAreaChart(props: PolarAreaChartProps) {
  const [card, plot] = splitCardProps(props);
  const palette = resolveColors(props.colors, props.data.length);
  const series: SeriesDescriptor[] = props.data.map((d, i) => ({ key: `${d.name}__${i}`, label: d.name, color: palette[i], shape: "circle" }));
  const values = Object.fromEntries(props.data.map((d, i) => [series[i].key, (props.valueFormatter ?? DEFAULT_FORMATTER)(d.value)]));
  return (
    <ChartCard {...card} height={card.height ?? 280} legend={card.legend ?? { position: "right" }} series={series} legendValues={values} isEmpty={props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <PolarPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function PolarPlot({ ctx, data, series, valueFormatter = DEFAULT_FORMATTER, dataLabels, onSliceClick }: Omit<PolarAreaChartProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[] }) {
  const w = ctx.width || 300;
  const h = ctx.height;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 8;
  const maxVal = Math.max(1, ...data.map((d) => d.value));
  const visible = data.map((d, i) => ({ d, s: series[i] })).filter((x) => !ctx.hiddenSeries.has(x.s.key));
  const step = 360 / Math.max(1, visible.length);
  const fs = ctx.settings.fontSize;
  const showLabels = dataLabels !== false;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Polar area chart" style={{ display: "block", fontFamily: chartVars.fontBody }}>
      {[0.25, 0.5, 0.75, 1].map((f) => <circle key={f} cx={cx} cy={cy} r={R * f} fill="none" stroke={chartVars.grid} strokeDasharray="3 4" />)}
      {visible.map(({ d, s }, i) => {
        const r = Math.sqrt(d.value / maxVal) * R; // area-proportional
        const a0 = i * step;
        const a1 = (i + 1) * step;
        const mid = (a0 + a1) / 2;
        const lr = r * 0.62;
        const lx = cx + lr * Math.cos((mid - 90) * (Math.PI / 180));
        const ly = cy + lr * Math.sin((mid - 90) * (Math.PI / 180));
        const t = valueFormatter(d.value);
        const chord = 2 * lr * Math.sin((step * Math.PI) / 360);
        const dim = ctx.highlightedSeries && ctx.highlightedSeries !== s.key;
        return (
          <g key={s.key} onClick={() => onSliceClick?.(d)} style={{ cursor: onSliceClick ? "pointer" : "default" }}>
            <path d={arcPath(cx, cy, r, a0, a1)} fill={s.color} fillOpacity={dim ? 0.25 : 0.8} stroke="var(--vi-color-surface-card)" strokeWidth={1.5}>
              <title>{`${d.name}: ${t}`}</title>
            </path>
            {showLabels && labelFits(t, chord, r * 0.5, fs, 2) && (
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={fs} fill="#fff" style={{ pointerEvents: "none", paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 }}>{t}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
