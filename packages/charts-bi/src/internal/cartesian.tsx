import { useMemo } from "react";
import { estimateTextWidth } from "@aibyters/core";
import {
  chartVars,
  computeAxisWidth,
  computeCategoryAxisWidth,
  planCategoryTicks,
  resolveColors,
  resolveDataLabels,
  labelFits,
  type BaseChartProps,
  type ChartContextValue,
  type SeriesDescriptor,
} from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export const DEFAULT_FORMATTER = (v: number) => formatCompactNumber(v);

/** Turns category keys into legend descriptors with theme colours. */
export function buildSeries(
  keys: string[],
  colors: string[] | undefined,
  labels?: Record<string, string>,
  shape?: SeriesDescriptor["shape"]
): SeriesDescriptor[] {
  const palette = resolveColors(colors, keys.length);
  return keys.map((k, i) => ({ key: k, label: labels?.[k] ?? k, color: palette[i], shape }));
}

export interface CartesianLayout {
  margin: { top: number; right: number; bottom: number; left: number };
  yAxisWidth: number;
  xAxis: { angle: 0 | -45; interval: number; height: number; textAnchor: "middle" | "end" };
  fontSize: number;
  tickCount: number;
}

/**
 * Computes margins and axis sizing from the *real* data and container width so tick labels
 * are never clipped and category labels rotate or thin out instead of overlapping.
 */
export function useCartesianLayout(
  data: any[],
  valueKeys: string[],
  indexKey: string,
  valueFormatter: (v: number) => string,
  ctx: ChartContextValue,
  opts: { stacked?: boolean; extraRight?: number; labelFormatter?: (l: any) => string; dataLabels?: boolean } = {}
): CartesianLayout {
  const { settings, width } = ctx;
  return useMemo(() => {
    const values: number[] = [];
    if (opts.stacked) {
      for (const row of data) {
        let pos = 0;
        let neg = 0;
        for (const k of valueKeys) {
          const v = Number(row?.[k]);
          if (!Number.isFinite(v)) continue;
          if (v >= 0) pos += v;
          else neg += v;
        }
        values.push(pos, neg);
      }
    } else {
      for (const row of data) for (const k of valueKeys) values.push(Number(row?.[k]));
    }
    const yAxisWidth = computeAxisWidth(values, valueFormatter, { fontSize: settings.fontSize, tickCount: settings.tickCount });
    const labels = data.map((d) => (opts.labelFormatter ? opts.labelFormatter(d?.[indexKey]) : d?.[indexKey]));
    const plotWidth = Math.max(0, (width || 600) - yAxisWidth - 16 - (opts.extraRight ?? 0));
    const plan = planCategoryTicks(labels, plotWidth, settings.fontSize);
    return {
      margin: { top: opts.dataLabels ? 18 : 8, right: 8 + (opts.extraRight ?? 0), bottom: 0, left: 0 },
      yAxisWidth,
      xAxis: { ...plan, textAnchor: plan.angle === 0 ? "middle" : "end" },
      fontSize: settings.fontSize,
      tickCount: settings.tickCount,
    };
  }, [data, valueKeys, indexKey, valueFormatter, settings.fontSize, settings.tickCount, width, opts.stacked, opts.extraRight, opts.labelFormatter, opts.dataLabels]);
}

/** Layout for horizontal bar charts (category axis on the left). */
export function useHorizontalLayout(
  data: any[],
  valueKeys: string[],
  indexKey: string,
  valueFormatter: (v: number) => string,
  ctx: ChartContextValue,
  opts: { stacked?: boolean; labelFormatter?: (l: any) => string; outsideLabels?: boolean } = {}
) {
  const { settings, width } = ctx;
  return useMemo(() => {
    const labels = data.map((d) => (opts.labelFormatter ? opts.labelFormatter(d?.[indexKey]) : d?.[indexKey]));
    const maxLabel = Math.min(Math.floor((width || 600) * 0.35), 180);
    const categoryWidth = computeCategoryAxisWidth(labels, { fontSize: settings.fontSize, max: maxLabel });
    const values: number[] = [];
    for (const row of data) {
      if (opts.stacked) {
        let pos = 0;
        let neg = 0;
        for (const k of valueKeys) {
          const v = Number(row?.[k]);
          if (!Number.isFinite(v)) continue;
          if (v >= 0) pos += v;
          else neg += v;
        }
        values.push(pos, neg);
      } else for (const k of valueKeys) values.push(Number(row?.[k]));
    }
    // Right margin must fit the last x tick label, which is centred on the axis end.
    const widest = computeAxisWidth(values, valueFormatter, { fontSize: settings.fontSize, padding: 0, min: 0 });
    // Outside value labels sit past the longest bar; reserve their full width.
    const labelRoom = opts.outsideLabels ? widest + 8 : Math.ceil(widest / 2) + 6;
    return {
      margin: { top: 4, right: labelRoom, bottom: 0, left: 0 },
      categoryWidth,
      fontSize: settings.fontSize,
      tickCount: settings.tickCount,
      maxLabel,
    };
  }, [data, valueKeys, indexKey, valueFormatter, settings.fontSize, settings.tickCount, width, opts.stacked, opts.labelFormatter, opts.outsideLabels]);
}

export const gridProps = { strokeDasharray: "3 3", stroke: chartVars.grid } as const;

export function axisTick(fontSize: number) {
  return { fill: chartVars.axisText, fontSize, fontFamily: chartVars.fontBody } as const;
}

/** Truncating tick renderer for category axes; keeps labels inside their slot. */
export function makeCategoryTick(fontSize: number, angle: 0 | -45, maxWidth: number) {
  return function CategoryTick(props: any) {
    const { x, y, payload } = props;
    const text = String(payload?.value ?? "");
    const fits = text.length * fontSize * 0.55 <= maxWidth;
    const shown = fits ? text : text.slice(0, Math.max(1, Math.floor(maxWidth / (fontSize * 0.55)) - 1)) + "…";
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          dy={angle === 0 ? 12 : 4}
          textAnchor={angle === 0 ? "middle" : "end"}
          transform={angle === 0 ? undefined : "rotate(-45)"}
          fill={chartVars.axisText}
          fontSize={fontSize}
          fontFamily={chartVars.fontBody}
        >
          {fits ? shown : <title>{text}</title>}
          {fits ? null : shown}
        </text>
      </g>
    );
  };
}

/**
 * Data-label renderer for Recharts `<LabelList content={...}>` that only draws when the label
 * fits inside (bars) or clears (lines) its mark. Prevents the classic "labels on top of labels".
 */
export function makeBarLabel(
  formatter: (v: number) => string,
  fontSize: number,
  mode: "auto" | "always" | "never",
  orientation: "vertical" | "horizontal" = "vertical",
  minMarkSize = 18,
  /** "outside" = above columns / right of bars; "inside" = centred in the mark (stacked). */
  placement: "outside" | "inside" = "outside",
  /** Width of the category slot (px) — outside column labels wider than this are dropped. */
  slotWidth = Infinity
) {
  if (mode === "never") return () => null;
  return function BarLabel(props: any) {
    const { x, y, width, height, value } = props;
    if (value === undefined || value === null || Number.isNaN(Number(value))) return null;
    const text = formatter(Number(value));
    const w = Math.abs(Number(width) || 0);
    const h = Math.abs(Number(height) || 0);
    const textW = estimateTextWidth(text, fontSize);
    const fitsInside = labelFits(text, w, h, fontSize, 3);
    const negative = Number(value) < 0;
    if (placement === "inside" || (mode === "always" && fitsInside)) {
      if (!fitsInside && mode !== "always") return null;
      return (
        <text x={Number(x) + w / 2} y={Number(y) + h / 2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={fontSize} fontFamily={chartVars.fontBody} style={{ pointerEvents: "none", paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 }}>
          {text}
        </text>
      );
    }
    if (orientation === "vertical") {
      // Consistent placement: every column label sits above (below for negatives) its column.
      if (mode === "auto" && (textW > slotWidth - 2 || w < Math.min(minMarkSize, 8))) return null;
      return (
        <text x={Number(x) + w / 2} y={negative ? Number(y) + h + fontSize + 2 : Number(y) - 4} textAnchor="middle" fill={chartVars.axisText} fontSize={fontSize} fontFamily={chartVars.fontBody} style={{ pointerEvents: "none" }}>
          {text}
        </text>
      );
    }
    // Horizontal bars: inside when it fits, otherwise just past the bar end.
    if (fitsInside) {
      return (
        <text x={Number(x) + w - 6} y={Number(y) + h / 2} textAnchor="end" dominantBaseline="central" fill="#fff" fontSize={fontSize} fontFamily={chartVars.fontBody} style={{ pointerEvents: "none", paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 }}>
          {text}
        </text>
      );
    }
    if (mode === "auto" && h < minMarkSize * 0.5) return null;
    return (
      <text x={Number(x) + w + 5} y={Number(y) + h / 2} textAnchor="start" dominantBaseline="central" fill={chartVars.axisText} fontSize={fontSize} fontFamily={chartVars.fontBody} style={{ pointerEvents: "none" }}>
        {text}
      </text>
    );
  };
}

export function resolveLabelMode(dataLabels: BaseChartProps["dataLabels"], fallback: "auto" | "always" | "never" = "never") {
  return resolveDataLabels(dataLabels, fallback);
}

/** Opacity for a series given legend hover / hidden state. */
export function seriesOpacity(key: string, ctx: ChartContextValue, base = 1): number {
  if (ctx.hiddenSeries.has(key)) return 0;
  if (ctx.highlightedSeries && ctx.highlightedSeries !== key) return base * 0.25;
  return base;
}

/** Recharts animation props derived from the frame context. */
export function animationProps(ctx: ChartContextValue) {
  return { isAnimationActive: ctx.animate, animationDuration: 500 } as const;
}

const CARD_KEYS = [
  "title", "description", "height", "aspectRatio", "minHeight", "legend", "loading", "error", "emptyMessage",
  "variant", "hideTitle", "ariaLabel", "headerAction", "footer", "exportColumns", "className", "style", "animate",
] as const;
export type CardKey = (typeof CARD_KEYS)[number];

/** Splits chart props into the subset ChartCard consumes and everything else (plot props). */
export function splitCardProps<T extends BaseChartProps>(props: T): [Pick<T, CardKey & keyof T>, Omit<T, CardKey>] {
  const card: any = {};
  const rest: any = {};
  for (const k of Object.keys(props)) {
    if ((CARD_KEYS as readonly string[]).includes(k)) card[k] = (props as any)[k];
    else rest[k] = (props as any)[k];
  }
  return [card, rest];
}
