/**
 * Data label placement utilities.
 * Labels are the most common source of visual defects when a chart is dropped into a
 * container narrower than the one it was designed in. These helpers make label rendering
 * a *decision* (fits / does not fit) instead of a hope.
 */
import { estimateTextWidth } from "./text-measure";

export interface LabelBox {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** True if `text` fits inside a mark of the given size with `padding` px to spare. */
export function labelFits(
  text: string,
  markWidth: number,
  markHeight: number,
  fontSize = 11,
  padding = 4
): boolean {
  const w = estimateTextWidth(text, fontSize);
  return w + padding * 2 <= markWidth && fontSize + padding * 2 <= markHeight;
}

/**
 * Greedy overlap removal for labels stacked along one axis (e.g. pie labels on one side).
 * Returns the labels with adjusted `y` such that no two boxes overlap, keeping order.
 */
export function spreadLabelsVertically(
  labels: LabelBox[],
  minY: number,
  maxY: number,
  gap = 2
): LabelBox[] {
  if (labels.length === 0) return [];
  const sorted = [...labels].sort((a, b) => a.y - b.y);
  // Push down
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const minAllowed = prev.y + prev.height + gap;
    if (cur.y < minAllowed) cur.y = minAllowed;
  }
  // Push back up if we ran past the bottom
  const last = sorted[sorted.length - 1];
  if (last.y + last.height > maxY) {
    last.y = maxY - last.height;
    for (let i = sorted.length - 2; i >= 0; i--) {
      const next = sorted[i + 1];
      const cur = sorted[i];
      const maxAllowed = next.y - gap - cur.height;
      if (cur.y > maxAllowed) cur.y = maxAllowed;
    }
  }
  // Clamp to top
  for (const l of sorted) if (l.y < minY) l.y = minY;
  return sorted;
}

/** Axis-aligned bounding box intersection test. */
export function boxesOverlap(a: LabelBox, b: LabelBox, gap = 0): boolean {
  return !(
    a.x + a.width + gap <= b.x ||
    b.x + b.width + gap <= a.x ||
    a.y + a.height + gap <= b.y ||
    b.y + b.height + gap <= a.y
  );
}

/**
 * Hides labels that collide with an already-placed label. Labels are processed in the
 * given order, so pass them sorted by priority (e.g. largest value first).
 */
export function dropCollidingLabels<T extends LabelBox>(labels: T[], gap = 2): Array<T & { visible: boolean }> {
  const placed: LabelBox[] = [];
  return labels.map((l) => {
    const collides = placed.some((p) => boxesOverlap(p, l, gap));
    if (!collides) placed.push(l);
    return { ...l, visible: !collides };
  });
}

export interface PieLabelInput {
  id: string | number;
  /** Mid-angle in degrees, 0 = 3 o'clock, counter-clockwise positive (Recharts convention). */
  midAngle: number;
  percent: number;
  text: string;
}

export interface PieLabelPlacement extends PieLabelInput {
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  elbowX: number;
  elbowY: number;
  textAnchor: "start" | "end";
  side: "left" | "right";
  visible: boolean;
}

/**
 * Places pie / donut labels *outside* the ring with leader lines, resolving collisions per side.
 * Small slices below `minPercent` are dropped (they remain in the legend and tooltip).
 */
export function layoutPieLabels(
  inputs: PieLabelInput[],
  cx: number,
  cy: number,
  outerRadius: number,
  opts: { fontSize?: number; minPercent?: number; labelOffset?: number; maxX?: number; minX?: number; minY?: number; maxY?: number } = {}
): PieLabelPlacement[] {
  const { fontSize = 11, minPercent = 0.03, labelOffset = 18 } = opts;
  const minY = opts.minY ?? 0;
  const maxY = opts.maxY ?? cy * 2;
  const RAD = Math.PI / 180;
  const raw = inputs.map((l) => {
    const cos = Math.cos(-l.midAngle * RAD);
    const sin = Math.sin(-l.midAngle * RAD);
    const anchorX = cx + outerRadius * cos;
    const anchorY = cy + outerRadius * sin;
    const elbowX = cx + (outerRadius + labelOffset * 0.6) * cos;
    const elbowY = cy + (outerRadius + labelOffset * 0.6) * sin;
    const side: "left" | "right" = cos >= 0 ? "right" : "left";
    const x = cx + (outerRadius + labelOffset) * (side === "right" ? 1 : -1);
    return {
      ...l,
      anchorX,
      anchorY,
      elbowX,
      elbowY,
      x,
      y: elbowY,
      side,
      textAnchor: (side === "right" ? "start" : "end") as "start" | "end",
      visible: l.percent >= minPercent,
    };
  });
  const lineH = fontSize + 3;
  for (const side of ["left", "right"] as const) {
    const group = raw.filter((r) => r.side === side && r.visible);
    const boxes: LabelBox[] = group.map((g) => ({ id: g.id, x: g.x, y: g.y - lineH / 2, width: estimateTextWidth(g.text, fontSize), height: lineH }));
    const spread = spreadLabelsVertically(boxes, minY, maxY, 2);
    for (const b of spread) {
      const target = group.find((g) => g.id === b.id)!;
      target.y = b.y + lineH / 2;
    }
  }
  return raw;
}

/**
 * Picks the largest label variant that fits. `variants` should be ordered from most to least
 * verbose, e.g. ["$1,234,567", "$1.2M", "1.2M"].
 */
export function pickFittingLabel(variants: string[], maxWidth: number, fontSize = 11): string | null {
  for (const v of variants) if (estimateTextWidth(v, fontSize) <= maxWidth) return v;
  return null;
}
