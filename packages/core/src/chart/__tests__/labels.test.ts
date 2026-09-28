import { describe, expect, it } from "vitest";
import {
  boxesOverlap,
  dropCollidingLabels,
  labelFits,
  layoutPieLabels,
  spreadLabelsVertically,
  type LabelBox,
} from "../labels";

const box = (id: string, y: number, height = 14, x = 0, width = 40): LabelBox => ({ id, x, y, width, height });

function assertNoVerticalOverlap(boxes: LabelBox[], gap: number) {
  const sorted = [...boxes].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    expect(sorted[i].y).toBeGreaterThanOrEqual(sorted[i - 1].y + sorted[i - 1].height + gap);
  }
}

describe("spreadLabelsVertically", () => {
  it("returns an empty array for no labels", () => {
    expect(spreadLabelsVertically([], 0, 100)).toEqual([]);
  });

  it("pushes overlapping labels apart and keeps them within bounds", () => {
    const input = [box("a", 10), box("b", 12), box("c", 14), box("d", 90)];
    const out = spreadLabelsVertically(input, 0, 120, 2);
    expect(out).toHaveLength(4);
    assertNoVerticalOverlap(out, 2);
    for (const b of out) {
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.y + b.height).toBeLessThanOrEqual(120);
    }
  });

  it("shifts a cluster at the bottom back up instead of overflowing maxY", () => {
    const input = [box("a", 95), box("b", 96), box("c", 97)];
    const out = spreadLabelsVertically(input, 0, 100, 2);
    assertNoVerticalOverlap(out, 2);
    const last = out[out.length - 1];
    expect(last.y + last.height).toBeLessThanOrEqual(100);
  });

  it("preserves the vertical ordering of the input", () => {
    const input = [box("top", 5), box("mid", 6), box("bottom", 7)];
    const out = spreadLabelsVertically(input, 0, 200, 2).map((b) => b.id);
    expect(out).toEqual(["top", "mid", "bottom"]);
  });
});

describe("boxesOverlap / dropCollidingLabels", () => {
  it("detects axis-aligned intersections", () => {
    expect(boxesOverlap(box("a", 0), box("b", 10))).toBe(true);
    expect(boxesOverlap(box("a", 0), box("b", 14))).toBe(false);
    expect(boxesOverlap(box("a", 0), box("b", 14), 1)).toBe(true);
    expect(boxesOverlap(box("a", 0, 14, 0, 40), box("b", 0, 14, 50, 40))).toBe(false);
  });

  it("hides labels that collide with an already-placed label, keeping earlier ones", () => {
    const out = dropCollidingLabels([box("first", 0), box("second", 5), box("third", 40)]);
    expect(out.map((l) => [l.id, l.visible])).toEqual([
      ["first", true],
      ["second", false],
      ["third", true],
    ]);
  });

  it("labelFits accounts for padding on both axes", () => {
    expect(labelFits("42", 60, 30)).toBe(true);
    expect(labelFits("42", 60, 12)).toBe(false);
    expect(labelFits("A very long value label", 30, 30)).toBe(false);
  });
});

describe("layoutPieLabels", () => {
  const cx = 150;
  const cy = 150;
  const r = 80;
  const slices = Array.from({ length: 10 }, (_, i) => ({
    id: `s${i}`,
    midAngle: i * 36 + 18,
    percent: 0.1,
    text: `Segment ${i} (10%)`,
  }));

  it("assigns each label to the side its mid-angle points to", () => {
    const out = layoutPieLabels(slices, cx, cy, r);
    for (const p of out) {
      const cos = Math.cos((-p.midAngle * Math.PI) / 180);
      expect(p.side).toBe(cos >= 0 ? "right" : "left");
      expect(p.textAnchor).toBe(p.side === "right" ? "start" : "end");
      expect(p.x).toBe(p.side === "right" ? cx + r + 18 : cx - r - 18);
    }
    expect(out.some((p) => p.side === "left")).toBe(true);
    expect(out.some((p) => p.side === "right")).toBe(true);
  });

  it("never overlaps two visible labels on the same side", () => {
    const fontSize = 11;
    const lineH = fontSize + 3;
    const out = layoutPieLabels(slices, cx, cy, r, { fontSize });
    for (const side of ["left", "right"] as const) {
      const ys = out
        .filter((p) => p.side === side && p.visible)
        .map((p) => p.y)
        .sort((a, b) => a - b);
      for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1]).toBeGreaterThanOrEqual(lineH + 2 - 1e-9);
    }
  });

  it("hides slices below minPercent but keeps them in the result", () => {
    const out = layoutPieLabels(
      [
        { id: "big", midAngle: 45, percent: 0.9, text: "Big" },
        { id: "tiny", midAngle: 200, percent: 0.01, text: "Tiny" },
      ],
      cx,
      cy,
      r
    );
    expect(out).toHaveLength(2);
    expect(out.find((p) => p.id === "big")?.visible).toBe(true);
    expect(out.find((p) => p.id === "tiny")?.visible).toBe(false);
  });
});
