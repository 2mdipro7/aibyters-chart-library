import { useMemo, useRef } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, computeCategoryAxisWidth, labelFits, planCategoryTicks, resolveDataLabels, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";
import { SvgTooltipLayer, svgBoxStyle, useSvgTooltip } from "./internal/svg";

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
  [key: string]: any;
}

export interface HeatmapChartProps extends BaseChartProps {
  data: HeatmapCell[];
  /**
   * Colour ramp. Intensity is rendered as the `max` colour at an opacity scaled from 0.12 to 1,
   * so theme CSS variables work without JS colour interpolation. Defaults to the accent ramp.
   */
  colorScale?: { min: string; max: string };
  /** Explicit domain for the colour scale. Defaults to the data min / max. */
  domain?: [number, number];
  /** Explicit order of the x / y categories. Defaults to first appearance. */
  xOrder?: string[];
  yOrder?: string[];
  /** Label for the value shown in tooltips. Default "Value". */
  valueLabel?: string;
  onCellClick?: (cell: HeatmapCell) => void;
}

const DEFAULT_SCALE = { min: "var(--vi-color-accent-100, #e0e7ff)", max: "var(--vi-color-accent-700, #4338ca)" };
const MIN_OPACITY = 0.12;
const LEGEND_STEPS = 24;

/** Category × category matrix where each cell's intensity encodes its value. */
export function HeatmapChart(props: HeatmapChartProps) {
  const [card, plot] = splitCardProps(props);
  return (
    <ChartCard {...card} legend={false} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <HeatmapBody ctx={ctx} {...plot} />}
    </ChartCard>
  );
}

function HeatmapBody({ ctx, data, colorScale = DEFAULT_SCALE, domain, xOrder, yOrder, valueFormatter = DEFAULT_FORMATTER, labelFormatter, dataLabels, valueLabel = "Value", onCellClick }: Omit<HeatmapChartProps, CardKey> & { ctx: ChartContextValue }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hover, show, hide } = useSvgTooltip(svgRef);
  const w = ctx.width || 400;
  const h = ctx.height;
  const fs = ctx.settings.fontSize;
  const labelMode = resolveDataLabels(dataLabels, "auto");
  const fmt = (l: string) => (labelFormatter ? labelFormatter(l) : l);

  const model = useMemo(() => {
    const xs = xOrder ? [...xOrder] : [];
    const ys = yOrder ? [...yOrder] : [];
    const xSet = new Set(xs);
    const ySet = new Set(ys);
    let lo = Infinity;
    let hi = -Infinity;
    const cells = new Map<string, HeatmapCell>();
    for (const d of data) {
      if (!xSet.has(d.x)) {
        xSet.add(d.x);
        xs.push(d.x);
      }
      if (!ySet.has(d.y)) {
        ySet.add(d.y);
        ys.push(d.y);
      }
      if (Number.isFinite(d.value)) {
        if (d.value < lo) lo = d.value;
        if (d.value > hi) hi = d.value;
      }
      cells.set(`${d.x}\u0000${d.y}`, d);
    }
    if (domain) [lo, hi] = domain;
    if (!Number.isFinite(lo)) lo = 0;
    if (!Number.isFinite(hi)) hi = 1;
    if (lo === hi) lo = hi > 0 ? 0 : hi - 1;
    return { xs, ys, cells, lo, hi };
  }, [data, domain, xOrder, yOrder]);

  const { xs, ys, cells, lo, hi } = model;
  const intensity = (v: number) => Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  const opacityFor = (v: number) => MIN_OPACITY + intensity(v) * (1 - MIN_OPACITY);

  // Layout: y label column on the left, x labels below the grid, legend ramp at the bottom.
  const yLabels = ys.map(fmt);
  const xLabels = xs.map(fmt);
  const labelCol = computeCategoryAxisWidth(yLabels, { fontSize: fs, max: Math.floor(w * 0.3), min: 24 });
  const legendH = fs + 22;
  const gridW = Math.max(10, w - labelCol - 4);
  const xPlan = planCategoryTicks(xLabels, gridW, fs);
  const gridTop = 2;
  const gridH = Math.max(10, h - gridTop - xPlan.height - legendH);
  const cellW = gridW / Math.max(1, xs.length);
  const cellH = gridH / Math.max(1, ys.length);
  const every = xPlan.interval + 1;
  const showValues = labelMode.mode !== "never";
  const valueFont = Math.min(labelMode.fontSize, fs);
  const rampW = Math.min(220, Math.max(80, gridW * 0.5));
  const rampX = labelCol + gridW - rampW;
  const rampY = h - legendH + 6;
  const rampLabelY = rampY + 8 + 4;

  return (
    <div style={svgBoxStyle}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Heatmap, ${xs.length} by ${ys.length} cells`} style={{ display: "block", fontFamily: chartVars.fontBody }}>
        {/* y labels */}
        <g fontSize={fs} fill={chartVars.axisText}>
          {ys.map((y, yi) => {
            const label = truncateToWidth(yLabels[yi], labelCol - 10, fs);
            const showRow = cellH >= fs + 2 || yi % Math.ceil((fs + 2) / Math.max(1, cellH)) === 0;
            if (!showRow) return null;
            return (
              <text key={y} x={labelCol - 8} y={gridTop + cellH * yi + cellH / 2} textAnchor="end" dominantBaseline="central">
                {label !== yLabels[yi] && <title>{yLabels[yi]}</title>}
                {label}
              </text>
            );
          })}
        </g>
        {/* cells */}
        {ys.map((y, yi) =>
          xs.map((x, xi) => {
            const cell = cells.get(`${x}\u0000${y}`);
            const cx = labelCol + cellW * xi;
            const cy = gridTop + cellH * yi;
            if (!cell || !Number.isFinite(cell.value)) {
              return <rect key={`${x}-${y}`} x={cx} y={cy} width={cellW} height={cellH} fill={chartVars.surfaceHover} fillOpacity={0.4} stroke={chartVars.surface} strokeWidth={1} />;
            }
            const text = valueFormatter(cell.value);
            const fits = showValues && (labelMode.mode === "always" || labelFits(text, cellW, cellH, valueFont, 3));
            const strong = intensity(cell.value) > 0.55;
            const rows = [
              { key: "x", label: "x", value: xLabels[xi] },
              { key: "y", label: "y", value: yLabels[yi] },
              { key: "value", label: valueLabel, value: cell.value, color: colorScale.max },
            ];
            return (
              <g key={`${x}-${y}`} onPointerMove={(e) => show(e, undefined, rows)} onPointerLeave={hide} onClick={() => onCellClick?.(cell)} style={{ cursor: onCellClick ? "pointer" : "default" }}>
                <rect x={cx} y={cy} width={cellW} height={cellH} fill={colorScale.max} fillOpacity={opacityFor(cell.value)} stroke={chartVars.surface} strokeWidth={1}>
                  <title>{`${xLabels[xi]}, ${yLabels[yi]}: ${text}`}</title>
                </rect>
                {fits && (
                  <text x={cx + cellW / 2} y={cy + cellH / 2} textAnchor="middle" dominantBaseline="central" fontSize={valueFont} fill={strong ? "#fff" : chartVars.textPrimary} style={{ pointerEvents: "none", paintOrder: "stroke", stroke: strong ? "rgba(0,0,0,0.25)" : "transparent", strokeWidth: 2 }}>
                    {text}
                  </text>
                )}
              </g>
            );
          })
        )}
        {/* x labels */}
        <g fontSize={fs} fill={chartVars.axisText}>
          {xs.map((x, xi) => {
            if (xi % every !== 0) return null;
            const cx = labelCol + cellW * xi + cellW / 2;
            const baseY = gridTop + gridH + 6;
            if (xPlan.angle === 0) {
              const label = truncateToWidth(xLabels[xi], Math.max(8, cellW - 6), fs);
              return (
                <text key={x} x={cx} y={baseY} textAnchor="middle" dominantBaseline="hanging">
                  {label !== xLabels[xi] && <title>{xLabels[xi]}</title>}
                  {label}
                </text>
              );
            }
            const label = truncateToWidth(xLabels[xi], Math.max(20, xPlan.height / 0.72 - 10), fs);
            return (
              <text key={x} transform={`translate(${cx},${baseY}) rotate(-45)`} textAnchor="end" dominantBaseline="central">
                {label !== xLabels[xi] && <title>{xLabels[xi]}</title>}
                {label}
              </text>
            );
          })}
        </g>
        {/* legend ramp: same technique as the cells so it matches in every theme */}
        <g aria-hidden>
          {Array.from({ length: LEGEND_STEPS }, (_, i) => (
            <rect key={i} x={rampX + (rampW / LEGEND_STEPS) * i} y={rampY} width={rampW / LEGEND_STEPS + 0.5} height={8} fill={colorScale.max} fillOpacity={MIN_OPACITY + (i / (LEGEND_STEPS - 1)) * (1 - MIN_OPACITY)} />
          ))}
          <rect x={rampX} y={rampY} width={rampW} height={8} fill="none" stroke={chartVars.border} strokeWidth={1} rx={2} />
          <text x={rampX} y={rampLabelY} textAnchor="start" dominantBaseline="hanging" fontSize={fs - 1} fill={chartVars.textMuted}>
            {valueFormatter(lo)}
          </text>
          <text x={rampX + rampW} y={rampLabelY} textAnchor="end" dominantBaseline="hanging" fontSize={fs - 1} fill={chartVars.textMuted}>
            {valueFormatter(hi)}
          </text>
        </g>
      </svg>
      <SvgTooltipLayer hover={hover} width={w} height={h} valueFormatter={(v) => valueFormatter(v)} />
    </div>
  );
}
