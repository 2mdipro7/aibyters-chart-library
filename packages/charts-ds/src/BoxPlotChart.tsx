import { useMemo, useRef } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, resolveColors, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";
import { SvgAxes, SvgTooltipLayer, computeSvgFrame, svgBoxStyle, useSvgTooltip } from "./internal/svg";

export interface BoxPlotGroup {
  label: string;
  values: number[];
}

export interface BoxPlotStats {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  count: number;
}

export interface BoxPlotChartProps extends BaseChartProps {
  data: BoxPlotGroup[];
  /** Box colour. Defaults to the first theme palette colour (or `colors[0]`). */
  color?: string;
  /** Colour each group with a different palette colour. Default false. */
  colorByGroup?: boolean;
  /** Show outliers beyond 1.5 × IQR as dots. Default true. */
  showOutliers?: boolean;
  onGroupClick?: (stats: BoxPlotStats) => void;
}

function percentile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (hi >= sorted.length) return sorted[lo];
  return sorted[lo] * (1 - (idx - lo)) + sorted[hi] * (idx - lo);
}

export function computeBoxStats(groups: BoxPlotGroup[]): BoxPlotStats[] {
  return (groups ?? []).map((g) => {
    const sorted = [...(g.values ?? [])].filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
    if (sorted.length === 0) return { label: g.label, min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [], count: 0 };
    const q1 = percentile(sorted, 25);
    const median = percentile(sorted, 50);
    const q3 = percentile(sorted, 75);
    const iqr = q3 - q1;
    const loFence = q1 - 1.5 * iqr;
    const hiFence = q3 + 1.5 * iqr;
    const inside = sorted.filter((v) => v >= loFence && v <= hiFence);
    const min = inside.length ? inside[0] : sorted[0];
    const max = inside.length ? inside[inside.length - 1] : sorted[sorted.length - 1];
    const outliers = sorted.filter((v) => v < loFence || v > hiFence);
    return { label: g.label, min, q1, median, q3, max, outliers, count: sorted.length };
  });
}

/** Five-number summary per group, drawn with plain SVG at real pixel size. */
export function BoxPlotChart(props: BoxPlotChartProps) {
  const [card, plot] = splitCardProps(props);
  const stats = useMemo(() => computeBoxStats(props.data), [props.data]);
  const hasData = stats.some((s) => s.count > 0);
  const exportRows = stats.map(({ label, min, q1, median, q3, max, count }) => ({ label, min, q1, median, q3, max, count }));
  return (
    <ChartCard {...card} legend={card.legend ?? false} isEmpty={!hasData} exportData={props.exportData ?? exportRows}>
      {(ctx) => <BoxPlotBody ctx={ctx} stats={stats} {...plot} />}
    </ChartCard>
  );
}

function BoxPlotBody({ ctx, stats, color, colors, colorByGroup = false, showOutliers = true, valueFormatter = DEFAULT_FORMATTER, labelFormatter, onGroupClick }: Omit<BoxPlotChartProps, CardKey> & { ctx: ChartContextValue; stats: BoxPlotStats[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hover, show, hide } = useSvgTooltip(svgRef);
  const w = ctx.width || 400;
  const h = ctx.height;
  const fs = ctx.settings.fontSize;
  const palette = colorByGroup ? resolveColors(colors, stats.length) : [color ?? resolveColors(colors, 1)[0]];
  const categories = stats.map((s) => (labelFormatter ? labelFormatter(s.label) : s.label));

  const allValues = stats.flatMap((s) => (s.count ? [s.min, s.max, ...(showOutliers ? s.outliers : [])] : []));
  const lo = Math.min(...allValues);
  const hi = Math.max(...allValues);
  const pad = (hi - lo || 1) * 0.08;
  const frame = computeSvgFrame({ width: w, height: h, fontSize: fs, tickCount: ctx.settings.tickCount, yMin: lo - pad, yMax: hi + pad, valueFormatter, categories });
  const { left, top, plotH, slot, scaleY } = frame;
  const boxW = Math.max(6, Math.min(slot * 0.55, 80));
  const dotR = ctx.isTouch ? 4 : 3;

  return (
    <div style={svgBoxStyle}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Box plot of ${stats.length} groups`} style={{ display: "block", fontFamily: chartVars.fontBody }}>
        <SvgAxes frame={frame} fontSize={fs} valueFormatter={valueFormatter} categories={categories} />
        {stats.map((s, i) => {
          if (!s.count) return null;
          const c = palette[i % palette.length];
          const cx = left + slot * i + slot / 2;
          const x0 = cx - boxW / 2;
          const yMax = scaleY(s.max);
          const yQ3 = scaleY(s.q3);
          const yMed = scaleY(s.median);
          const yQ1 = scaleY(s.q1);
          const yMin = scaleY(s.min);
          const rows = [
            { key: "max", label: "Max", value: s.max },
            { key: "q3", label: "Q3", value: s.q3 },
            { key: "median", label: "Median", value: s.median },
            { key: "q1", label: "Q1", value: s.q1 },
            { key: "min", label: "Min", value: s.min },
            { key: "n", label: "n", value: s.count },
          ];
          const summary = `${s.label}: min ${valueFormatter(s.min)}, Q1 ${valueFormatter(s.q1)}, median ${valueFormatter(s.median)}, Q3 ${valueFormatter(s.q3)}, max ${valueFormatter(s.max)}`;
          return (
            <g
              key={s.label}
              onPointerMove={(e) => show(e, s.label, rows)}
              onPointerLeave={hide}
              onClick={() => onGroupClick?.(s)}
              style={{ cursor: onGroupClick ? "pointer" : "default" }}
            >
              <title>{summary}</title>
              {/* hit area spanning the whole slot so touch targets stay large */}
              <rect x={left + slot * i} y={top} width={slot} height={plotH} fill="transparent" />
              <line x1={cx} x2={cx} y1={yMax} y2={yQ3} stroke={chartVars.axisText} strokeWidth={1} />
              <line x1={cx} x2={cx} y1={yQ1} y2={yMin} stroke={chartVars.axisText} strokeWidth={1} />
              <line x1={cx - boxW / 4} x2={cx + boxW / 4} y1={yMax} y2={yMax} stroke={chartVars.axisText} strokeWidth={1} />
              <line x1={cx - boxW / 4} x2={cx + boxW / 4} y1={yMin} y2={yMin} stroke={chartVars.axisText} strokeWidth={1} />
              <rect x={x0} y={yQ3} width={boxW} height={Math.max(1, yQ1 - yQ3)} fill={c} fillOpacity={0.25} stroke={c} strokeWidth={1.5} rx={2} />
              <line x1={x0} x2={x0 + boxW} y1={yMed} y2={yMed} stroke={c} strokeWidth={2.5} />
              {showOutliers && s.outliers.map((o, oi) => <circle key={oi} cx={cx} cy={scaleY(o)} r={dotR} fill={c} fillOpacity={0.8} />)}
            </g>
          );
        })}
      </svg>
      <SvgTooltipLayer hover={hover} width={w} height={h} valueFormatter={(v, k) => (k === "n" ? String(v) : valueFormatter(v))} />
    </div>
  );
}
