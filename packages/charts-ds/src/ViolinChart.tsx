import { useMemo, useRef } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, resolveColors, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";
import { SvgAxes, SvgTooltipLayer, computeSvgFrame, svgBoxStyle, useSvgTooltip } from "./internal/svg";

export interface ViolinGroup {
  label: string;
  values: number[];
}

export interface ViolinChartProps extends BaseChartProps {
  data: ViolinGroup[];
  /** Fill colour. Defaults to the first theme palette colour (or `colors[0]`). */
  color?: string;
  /** Colour each group with a different palette colour. Default false. */
  colorByGroup?: boolean;
  /** Kernel bandwidth as a fraction of the data range. Default 0.15. */
  bandwidth?: number;
  /** Draw the median as a marker inside each violin. Default true. */
  showMedian?: boolean;
  onGroupClick?: (group: ViolinGroup) => void;
}

function kernel(u: number) {
  return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0;
}

function kde(values: number[], min: number, max: number, steps: number, bw: number) {
  const step = (max - min) / steps;
  const points: Array<{ x: number; density: number }> = [];
  let maxDensity = 0;
  for (let i = 0; i <= steps; i++) {
    const x = min + i * step;
    let sum = 0;
    for (const v of values) sum += kernel((x - v) / bw);
    const density = values.length ? sum / (values.length * bw) : 0;
    points.push({ x, density });
    if (density > maxDensity) maxDensity = density;
  }
  return { points, maxDensity };
}

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Kernel density estimate per group, mirrored to form a violin. Plain SVG at real pixel size. */
export function ViolinChart(props: ViolinChartProps) {
  const [card, plot] = splitCardProps(props);
  const hasData = (props.data ?? []).some((g) => g.values?.length > 0);
  const exportRows = (props.data ?? []).map((g) => {
    const vals = g.values.filter(Number.isFinite);
    return { label: g.label, count: vals.length, min: vals.length ? Math.min(...vals) : null, median: vals.length ? median(vals) : null, max: vals.length ? Math.max(...vals) : null };
  });
  return (
    <ChartCard {...card} legend={card.legend ?? false} isEmpty={!hasData} exportData={props.exportData ?? exportRows}>
      {(ctx) => <ViolinBody ctx={ctx} {...plot} />}
    </ChartCard>
  );
}

function ViolinBody({ ctx, data, color, colors, colorByGroup = false, bandwidth = 0.15, showMedian = true, valueFormatter = DEFAULT_FORMATTER, labelFormatter, onGroupClick }: Omit<ViolinChartProps, CardKey> & { ctx: ChartContextValue }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hover, show, hide } = useSvgTooltip(svgRef);
  const w = ctx.width || 400;
  const h = ctx.height;
  const fs = ctx.settings.fontSize;

  const model = useMemo(() => {
    const all = data.flatMap((g) => g.values.filter(Number.isFinite));
    let lo = all.length ? Math.min(...all) : 0;
    let hi = all.length ? Math.max(...all) : 1;
    if (lo === hi) {
      lo -= 1;
      hi += 1;
    }
    const range = hi - lo;
    const pad = range * 0.1;
    lo -= pad;
    hi += pad;
    const bw = range * bandwidth;
    let maxDensity = 0;
    const groups = data.map((g) => {
      const vals = g.values.filter(Number.isFinite);
      const { points, maxDensity: md } = kde(vals, lo, hi, 40, bw);
      if (md > maxDensity) maxDensity = md;
      return { group: g, label: g.label, points, count: vals.length, median: vals.length ? median(vals) : null, min: vals.length ? Math.min(...vals) : null, max: vals.length ? Math.max(...vals) : null };
    });
    return { groups, lo, hi, maxDensity };
  }, [data, bandwidth]);

  const palette = colorByGroup ? resolveColors(colors, model.groups.length) : [color ?? resolveColors(colors, 1)[0]];
  const categories = model.groups.map((g) => (labelFormatter ? labelFormatter(g.label) : g.label));
  const frame = computeSvgFrame({ width: w, height: h, fontSize: fs, tickCount: ctx.settings.tickCount, yMin: model.lo, yMax: model.hi, valueFormatter, categories });
  const { left, top, plotH, slot, scaleY } = frame;
  const halfW = Math.max(4, Math.min(slot * 0.42, 70));

  return (
    <div style={svgBoxStyle}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Violin plot of ${model.groups.length} groups`} style={{ display: "block", fontFamily: chartVars.fontBody }}>
        <SvgAxes frame={frame} fontSize={fs} valueFormatter={valueFormatter} categories={categories} />
        {model.groups.map((g, i) => {
          if (!g.count) return null;
          const c = palette[i % palette.length];
          const cx = left + slot * i + slot / 2;
          const right: string[] = [];
          const leftPts: string[] = [];
          g.points.forEach((p) => {
            const y = scaleY(p.x);
            const off = model.maxDensity > 0 ? (p.density / model.maxDensity) * halfW : 0;
            right.push(`${(cx + off).toFixed(2)},${y.toFixed(2)}`);
            leftPts.push(`${(cx - off).toFixed(2)},${y.toFixed(2)}`);
          });
          const d = `M ${right.join(" L ")} L ${leftPts.reverse().join(" L ")} Z`;
          const rows = [
            { key: "max", label: "Max", value: g.max },
            { key: "median", label: "Median", value: g.median },
            { key: "min", label: "Min", value: g.min },
            { key: "n", label: "n", value: g.count },
          ];
          return (
            <g key={g.label} onPointerMove={(e) => show(e, g.label, rows)} onPointerLeave={hide} onClick={() => onGroupClick?.(g.group)} style={{ cursor: onGroupClick ? "pointer" : "default" }}>
              <title>{`${g.label}: n=${g.count}, median ${valueFormatter(g.median ?? 0)}`}</title>
              <rect x={left + slot * i} y={top} width={slot} height={plotH} fill="transparent" />
              <line x1={cx} x2={cx} y1={top} y2={top + plotH} stroke={chartVars.grid} strokeDasharray="2 3" />
              <path d={d} fill={c} fillOpacity={0.45} stroke={c} strokeWidth={1.5} strokeLinejoin="round" />
              {showMedian && g.median !== null && (
                <>
                  <line x1={cx - halfW * 0.5} x2={cx + halfW * 0.5} y1={scaleY(g.median)} y2={scaleY(g.median)} stroke={chartVars.surface} strokeWidth={3} />
                  <line x1={cx - halfW * 0.5} x2={cx + halfW * 0.5} y1={scaleY(g.median)} y2={scaleY(g.median)} stroke={c} strokeWidth={1.5} />
                </>
              )}
            </g>
          );
        })}
      </svg>
      <SvgTooltipLayer hover={hover} width={w} height={h} valueFormatter={(v, k) => (k === "n" ? String(v) : valueFormatter(v))} />
    </div>
  );
}
