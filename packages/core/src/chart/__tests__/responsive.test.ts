import { describe, expect, it } from "vitest";
import { CHART_BREAKPOINTS, breakpointFor, responsiveSettings } from "../responsive";

describe("breakpointFor", () => {
  it("maps container widths to breakpoints at the documented thresholds", () => {
    expect(breakpointFor(0)).toBe("xs");
    expect(breakpointFor(CHART_BREAKPOINTS.sm - 1)).toBe("xs");
    expect(breakpointFor(CHART_BREAKPOINTS.sm)).toBe("sm");
    expect(breakpointFor(CHART_BREAKPOINTS.md - 1)).toBe("sm");
    expect(breakpointFor(CHART_BREAKPOINTS.md)).toBe("md");
    expect(breakpointFor(CHART_BREAKPOINTS.lg - 1)).toBe("md");
    expect(breakpointFor(CHART_BREAKPOINTS.lg)).toBe("lg");
    expect(breakpointFor(4000)).toBe("lg");
  });
});

describe("responsiveSettings", () => {
  it("collapses the side legend and draws pie labels inside on xs", () => {
    const xs = responsiveSettings(360, false);
    expect(xs.breakpoint).toBe("xs");
    expect(xs.collapseSideLegend).toBe(true);
    expect(xs.outsidePieLabels).toBe(false);
    expect(xs.fontSize).toBeLessThan(responsiveSettings(1280, false).fontSize);
    expect(xs.tickCount).toBeLessThan(responsiveSettings(1280, false).tickCount);
  });

  it("keeps the side legend on md and lg", () => {
    expect(responsiveSettings(700, false).collapseSideLegend).toBe(false);
    expect(responsiveSettings(1280, false).collapseSideLegend).toBe(false);
    expect(responsiveSettings(1280, false).outsidePieLabels).toBe(true);
  });

  it("enlarges hover targets on touch devices at every breakpoint", () => {
    for (const w of [360, 500, 700, 1280]) {
      expect(responsiveSettings(w, true).dotRadius).toBeGreaterThan(responsiveSettings(w, false).dotRadius);
    }
  });
});
