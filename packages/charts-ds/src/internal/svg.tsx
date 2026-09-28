import { useCallback, useState, type ReactNode, type RefObject } from "react";
import { ChartTooltip, chartVars, computeAxisWidth, planCategoryTicks, truncateToWidth, type TooltipRow } from "@aibyters/core";

/** "Nice" tick values between lo and hi (inclusive) for hand-drawn SVG axes. */
export function niceTicks(lo: number, hi: number, count: number): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [];
  if (!(hi > lo)) return [lo];
  const rawStep = (hi - lo) / Math.max(1, count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const out: number[] = [];
  const start = Math.ceil(lo / step) * step;
  for (let v = start; v <= hi + step * 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

export interface HoverState {
  x: number;
  y: number;
  title?: ReactNode;
  rows: TooltipRow[];
}

/**
 * Pointer-following tooltip state for plain-SVG charts. Call `show` from pointer handlers on
 * marks and render `<SvgTooltipLayer>` as a sibling of the SVG inside a `position: relative` box.
 */
export function useSvgTooltip(svgRef: RefObject<SVGSVGElement>) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const show = useCallback(
    (e: { clientX: number; clientY: number }, title: ReactNode, rows: TooltipRow[]) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, title, rows });
    },
    [svgRef]
  );
  const hide = useCallback(() => setHover(null), []);
  return { hover, show, hide };
}

export function SvgTooltipLayer({ hover, width, height, valueFormatter }: { hover: HoverState | null; width: number; height: number; valueFormatter?: (v: number, key: string) => string }) {
  if (!hover) return null;
  const flipX = hover.x > width * 0.55;
  const flipY = hover.y > height * 0.55;
  return (
    <div
      style={{
        position: "absolute",
        left: hover.x,
        top: hover.y,
        transform: `translate(${flipX ? "calc(-100% - 12px)" : "12px"}, ${flipY ? "calc(-100% - 12px)" : "12px"})`,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <ChartTooltip title={hover.title} rows={hover.rows} valueFormatter={valueFormatter} />
    </div>
  );
}

/** Wrapper that lets the tooltip layer position itself relative to the SVG. */
export const svgBoxStyle = { position: "relative", width: "100%", height: "100%" } as const;

export interface SvgFrame {
  width: number;
  height: number;
  left: number;
  top: number;
  plotW: number;
  plotH: number;
  yMin: number;
  yMax: number;
  yTicks: number[];
  scaleY: (v: number) => number;
  /** Category slot width and label plan for the x-axis. */
  slot: number;
  xPlan: { angle: 0 | -45; interval: number; height: number };
}

/**
 * Computes a pixel layout for a plain-SVG cartesian chart: a left label column measured from
 * the formatted y ticks, an x-axis band tall enough for (possibly rotated) category labels,
 * and the remaining plot rectangle.
 */
export function computeSvgFrame(opts: {
  width: number;
  height: number;
  fontSize: number;
  tickCount: number;
  yMin: number;
  yMax: number;
  valueFormatter: (v: number) => string;
  categories: string[];
  topPad?: number;
  rightPad?: number;
}): SvgFrame {
  const { width, height, fontSize, tickCount, valueFormatter, categories } = opts;
  let { yMin, yMax } = opts;
  if (!(yMax > yMin)) {
    yMin -= 1;
    yMax += 1;
  }
  const yTicks = niceTicks(yMin, yMax, tickCount);
  const left = computeAxisWidth([yMin, yMax, ...yTicks], valueFormatter, { fontSize, tickCount, padding: 10 });
  const rightPad = opts.rightPad ?? 8;
  const plotW = Math.max(10, width - left - rightPad);
  const xPlan = planCategoryTicks(categories, plotW, fontSize);
  const top = opts.topPad ?? fontSize;
  const plotH = Math.max(10, height - top - xPlan.height);
  const scaleY = (v: number) => top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  return { width, height, left, top, plotW, plotH, yMin, yMax, yTicks, scaleY, slot: plotW / Math.max(1, categories.length), xPlan };
}

/** Grid lines, y tick labels and x category labels for a `computeSvgFrame` layout. */
export function SvgAxes({ frame, fontSize, valueFormatter, categories }: { frame: SvgFrame; fontSize: number; valueFormatter: (v: number) => string; categories: string[] }) {
  const { left, top, plotW, plotH, yTicks, scaleY, slot, xPlan } = frame;
  const every = xPlan.interval + 1;
  const baseline = top + plotH;
  return (
    <g fontFamily={chartVars.fontBody} fontSize={fontSize} fill={chartVars.axisText}>
      {yTicks.map((t) => {
        const y = scaleY(t);
        if (y < top - 1 || y > baseline + 1) return null;
        return (
          <g key={t}>
            <line x1={left} x2={left + plotW} y1={y} y2={y} stroke={chartVars.grid} strokeDasharray="3 3" />
            <text x={left - 6} y={y} textAnchor="end" dominantBaseline="central">
              {valueFormatter(t)}
            </text>
          </g>
        );
      })}
      <line x1={left} x2={left + plotW} y1={baseline} y2={baseline} stroke={chartVars.axisLine} />
      {categories.map((c, i) => {
        if (i % every !== 0) return null;
        const cx = left + slot * i + slot / 2;
        if (xPlan.angle === 0) {
          const text = truncateToWidth(c, Math.max(8, slot - 6), fontSize);
          return (
            <text key={i} x={cx} y={baseline + 8} textAnchor="middle" dominantBaseline="hanging">
              {text !== c && <title>{c}</title>}
              {text}
            </text>
          );
        }
        const text = truncateToWidth(c, Math.max(20, xPlan.height / 0.72 - 10), fontSize);
        return (
          <text key={i} transform={`translate(${cx},${baseline + 8}) rotate(-45)`} textAnchor="end" dominantBaseline="central">
            {text !== c && <title>{c}</title>}
            {text}
          </text>
        );
      })}
    </g>
  );
}
