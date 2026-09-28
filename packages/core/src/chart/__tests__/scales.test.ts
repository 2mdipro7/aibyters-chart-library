import { describe, expect, it } from "vitest";
import { createBandScale } from "../../scales/band";
import { createLinearScale, linearTicks, niceDomain, tickStep } from "../../scales/linear";

describe("createLinearScale", () => {
  it("rounds the domain outward to nice boundaries and produces evenly spaced ticks", () => {
    const scale = createLinearScale({ domain: [3, 97], range: [0, 100] });
    expect(scale.domain()).toEqual([0, 100]);
    expect(scale.ticks()).toEqual([0, 20, 40, 60, 80, 100]);
    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(50);
    expect(scale(100)).toBe(100);
    expect(scale.invert(25)).toBeCloseTo(25);
  });

  it("keeps the raw domain when nice is false", () => {
    const scale = createLinearScale({ domain: [3, 97], range: [0, 188], nice: false });
    expect(scale.domain()).toEqual([3, 97]);
    expect(scale(3)).toBe(0);
    expect(scale(97)).toBe(188);
  });

  it("supports inverted ranges (SVG y-axis) and degenerate domains", () => {
    const y = createLinearScale({ domain: [0, 10], range: [200, 0] });
    expect(y(0)).toBe(200);
    expect(y(10)).toBe(0);
    expect(y.invert(100)).toBeCloseTo(5);
    const flat = createLinearScale({ domain: [5, 5], range: [0, 10] });
    expect(flat.domain()).toEqual([4, 6]);
    expect(Number.isFinite(flat(5))).toBe(true);
  });

  it("exposes d3-compatible helpers", () => {
    expect(tickStep(0, 100, 6)).toBe(20);
    expect(niceDomain([0.2, 0.93])).toEqual([0.2, 1]);
    expect(linearTicks(0, 1, 5)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
    expect(linearTicks(Number.NaN, 1)).toEqual([]);
  });
});

describe("createBandScale", () => {
  const domain = ["a", "b", "c", "d"];

  it("computes bandwidth and step from padding", () => {
    const scale = createBandScale({ domain, range: [0, 400], padding: 0.1 });
    const step = 400 / (4 - 0.1 + 0.2);
    expect(scale.step()).toBeCloseTo(step);
    expect(scale.bandwidth()).toBeCloseTo(step * 0.9);
    expect(scale("a")).toBeCloseTo(step * 0.1);
    expect(scale("d")).toBeCloseTo(step * 0.1 + 3 * step);
    expect(scale("zzz")).toBeUndefined();
    // last band ends inside the range with outer padding to spare
    expect(scale("d")! + scale.bandwidth()).toBeLessThanOrEqual(400);
  });

  it("fills the range exactly when padding is zero", () => {
    const scale = createBandScale({ domain, range: [0, 400], padding: 0 });
    expect(scale.bandwidth()).toBe(100);
    expect(scale("a")).toBe(0);
    expect(scale("d")).toBe(300);
  });

  it("honours separate inner and outer padding and handles empty domains", () => {
    const scale = createBandScale({ domain, range: [0, 100], paddingInner: 0.5, paddingOuter: 0 });
    expect(scale.bandwidth()).toBeCloseTo(scale.step() * 0.5);
    expect(scale("a")).toBe(0);
    const empty = createBandScale({ domain: [], range: [0, 100] });
    expect(empty.bandwidth()).toBe(0);
    expect(empty("a")).toBeUndefined();
  });
});
