import { describe, expect, it } from "vitest";
import { computeAxisWidth, estimateTextWidth, planCategoryTicks, truncateToWidth } from "../text-measure";

const currency = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const compact = (v: number) => (Math.abs(v) >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${(v / 1e3).toFixed(0)}K`);
const values = [1_200_000, 3_400_000, 9_600_000];

describe("computeAxisWidth", () => {
  it("reserves more room for a verbose currency formatter than for a compact one", () => {
    const wide = computeAxisWidth(values, currency);
    const narrow = computeAxisWidth(values, compact);
    expect(wide).toBeGreaterThan(narrow);
    expect(narrow).toBeGreaterThanOrEqual(28);
  });

  it("is clamped to the min / max bounds", () => {
    expect(computeAxisWidth([], currency)).toBe(28);
    expect(computeAxisWidth(values, () => "x".repeat(200))).toBe(120);
    expect(computeAxisWidth(values, currency, { min: 10, max: 40 })).toBe(40);
  });

  it("samples the nice ceiling so the largest rendered tick is measured", () => {
    const seen: number[] = [];
    computeAxisWidth([9_600_000], (v) => {
      seen.push(v);
      return String(v);
    });
    expect(seen).toContain(10_000_000);
  });

  it("survives a throwing formatter", () => {
    expect(() =>
      computeAxisWidth(values, () => {
        throw new Error("boom");
      })
    ).not.toThrow();
  });
});

describe("truncateToWidth", () => {
  it("returns the text unchanged when it fits", () => {
    expect(truncateToWidth("Revenue", 200)).toBe("Revenue");
  });

  it("truncates with an ellipsis and stays within the budget", () => {
    const label = "North America (excluding Canada)";
    const out = truncateToWidth(label, 60);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThan(label.length);
    expect(estimateTextWidth(out)).toBeLessThanOrEqual(60);
    expect(label.startsWith(out.slice(0, -1))).toBe(true);
  });

  it("degrades to a bare ellipsis when nothing fits", () => {
    expect(truncateToWidth("Revenue", 1)).toBe("…");
  });
});

describe("planCategoryTicks", () => {
  const labels = ["January", "February", "March", "April", "May", "June"];

  it("keeps labels horizontal when every slot is wide enough", () => {
    expect(planCategoryTicks(labels, 1200)).toEqual({ angle: 0, interval: 0, height: 30 });
  });

  it("rotates labels when slots are narrower than the widest label", () => {
    const plan = planCategoryTicks(labels, 300);
    expect(plan.angle).toBe(-45);
    expect(plan.interval).toBe(0);
    expect(plan.height).toBeGreaterThan(30);
    expect(plan.height).toBeLessThanOrEqual(90);
  });

  it("thins ticks out when even rotated labels cannot fit", () => {
    const plan = planCategoryTicks(labels, 60);
    expect(plan.angle).toBe(-45);
    expect(plan.interval).toBeGreaterThan(0);
  });

  it("handles empty input and zero width", () => {
    expect(planCategoryTicks([], 500)).toEqual({ angle: 0, interval: 0, height: 30 });
    expect(planCategoryTicks(labels, 0)).toEqual({ angle: 0, interval: 0, height: 30 });
  });
});
