/**
 * Text measurement helpers.
 * Charts must reserve enough room for tick labels *before* layout; Recharts does not
 * auto-size the y-axis, so a formatted "$1.2M" is clipped when the margin is a fixed guess.
 */

let canvasCtx: CanvasRenderingContext2D | null | undefined;

function getCtx(): CanvasRenderingContext2D | null {
  if (canvasCtx !== undefined) return canvasCtx;
  if (typeof document === "undefined") {
    canvasCtx = null;
    return null;
  }
  try {
    const canvas = document.createElement("canvas");
    canvasCtx = canvas.getContext("2d");
  } catch {
    canvasCtx = null;
  }
  return canvasCtx;
}

/** Average glyph width as a fraction of font size for a humanist sans (Inter / Segoe / system-ui). */
const AVG_GLYPH = 0.56;

/**
 * Estimates rendered text width in px. Uses canvas measurement when available (browser),
 * otherwise a deterministic heuristic (SSR / tests).
 */
export function estimateTextWidth(text: string, fontSize = 12, fontFamily = "Inter, system-ui, sans-serif"): number {
  if (!text) return 0;
  const ctx = getCtx();
  if (ctx) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }
  let w = 0;
  for (const ch of text) {
    if (/[\s.,:;'|!il1I]/.test(ch)) w += fontSize * 0.3;
    else if (/[A-Z0-9$€£¥%]/.test(ch)) w += fontSize * 0.62;
    else if (/[mwMW@]/.test(ch)) w += fontSize * 0.85;
    else w += fontSize * AVG_GLYPH;
  }
  return w;
}

export interface AxisWidthOptions {
  fontSize?: number;
  /** Space between the tick label and the plot. */
  padding?: number;
  /** Hard lower / upper bounds so a rogue formatter cannot eat the plot. */
  min?: number;
  max?: number;
  /** Number of ticks Recharts is likely to render; used to sample the domain. */
  tickCount?: number;
}

/**
 * Computes the y-axis width needed to fit the widest formatted tick label.
 * Pass the raw numeric values of every series; the function samples a nice domain
 * so it sees the largest label the axis will actually produce.
 */
export function computeAxisWidth(
  values: number[],
  formatter: (v: number) => string,
  opts: AxisWidthOptions = {}
): number {
  const { fontSize = 12, padding = 8, min = 28, max = 120, tickCount = 6 } = opts;
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return min;
  const lo = Math.min(0, ...finite);
  const hi = Math.max(0, ...finite);
  const samples = new Set<number>([lo, hi]);
  const step = (hi - lo) / Math.max(tickCount - 1, 1);
  for (let i = 0; i < tickCount; i++) samples.add(lo + step * i);
  // Recharts rounds to "nice" numbers; include an overshoot so 9.6M -> 10M is measured.
  samples.add(niceCeil(hi));
  samples.add(-niceCeil(Math.abs(lo)));
  let widest = 0;
  for (const s of samples) {
    let label = "";
    try {
      label = formatter(s);
    } catch {
      label = String(s);
    }
    widest = Math.max(widest, estimateTextWidth(label, fontSize));
  }
  return Math.min(max, Math.max(min, Math.ceil(widest + padding)));
}

/** Computes the width needed for category labels on a horizontal bar chart. */
export function computeCategoryAxisWidth(
  labels: Array<string | number>,
  opts: { fontSize?: number; padding?: number; min?: number; max?: number } = {}
): number {
  const { fontSize = 12, padding = 10, min = 40, max = 180 } = opts;
  let widest = 0;
  for (const l of labels) widest = Math.max(widest, estimateTextWidth(String(l ?? ""), fontSize));
  return Math.min(max, Math.max(min, Math.ceil(widest + padding)));
}

/** Truncates a label with an ellipsis so it fits `maxWidth` px. */
export function truncateToWidth(text: string, maxWidth: number, fontSize = 12): string {
  if (estimateTextWidth(text, fontSize) <= maxWidth) return text;
  const ell = "…";
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (estimateTextWidth(text.slice(0, mid) + ell, fontSize) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return lo <= 0 ? ell : text.slice(0, lo) + ell;
}

/**
 * Given available width per category tick, decides how to render x-axis labels:
 * horizontal, rotated 45°, or thinned out (interval > 0).
 */
export function planCategoryTicks(
  labels: Array<string | number>,
  plotWidth: number,
  fontSize = 12
): { angle: 0 | -45; interval: number; height: number } {
  if (labels.length === 0 || plotWidth <= 0) return { angle: 0, interval: 0, height: 30 };
  const slot = plotWidth / labels.length;
  const widest = Math.max(...labels.map((l) => estimateTextWidth(String(l ?? ""), fontSize)));
  if (widest + 8 <= slot) return { angle: 0, interval: 0, height: 30 };
  // Rotated labels need roughly widest * sin(45°) of vertical room.
  const rotatedHeight = Math.min(90, Math.ceil(widest * 0.72) + 14);
  if (fontSize + 6 <= slot) return { angle: -45, interval: 0, height: rotatedHeight };
  const every = Math.ceil((fontSize + 6) / slot);
  return { angle: -45, interval: every - 1, height: rotatedHeight };
}

function niceCeil(v: number): number {
  if (v === 0) return 0;
  const exp = Math.floor(Math.log10(Math.abs(v)));
  const base = Math.pow(10, exp);
  const frac = v / base;
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return nice * base;
}
