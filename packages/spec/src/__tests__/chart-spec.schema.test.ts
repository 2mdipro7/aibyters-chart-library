import { describe, it, expect } from "vitest";
import { isValidChartSpec, parseChartSpec } from "../chart-spec.schema";

describe("ChartSpec Schema", () => {
  it("validates a LineSpec", () => {
    const validSpec = {
      kind: "line",
      title: "Revenue Trend",
      encodings: {
        x: "month",
        y: "revenue",
      },
    };

    expect(() => parseChartSpec(validSpec)).not.toThrow();
  });

  it("validates a MetricSpec", () => {
    const validSpec = {
      kind: "metric",
      title: "Total Revenue",
      encodings: {
        value: "total",
      },
    };

    expect(() => parseChartSpec(validSpec)).not.toThrow();
  });

  it("validates column, pie and donut specs", () => {
    expect(isValidChartSpec({ kind: "column", title: "Revenue by room", encodings: { x: "room", y: ["revenue", "cost"] } })).toBe(true);
    expect(isValidChartSpec({ kind: "pie", title: "By method", encodings: { name: "method", value: "amount" } })).toBe(true);
    expect(isValidChartSpec({ kind: "donut", title: "By method", encodings: { name: "method", value: "amount" },
      presentation: { centerLabel: "Total" } })).toBe(true);
    expect(isValidChartSpec({ kind: "pie", title: "Missing value", encodings: { name: "method" } })).toBe(false);
  });

  it("rejects an invalid spec", () => {
    const invalidSpec = {
      kind: "line",
      title: "Missing Encodings",
    };

    expect(() => parseChartSpec(invalidSpec)).toThrow();
  });

  it("rejects unknown kind", () => {
    const invalidSpec = {
      kind: "unknown_chart",
      title: "Unknown",
      encodings: {}
    };

    expect(() => parseChartSpec(invalidSpec)).toThrow();
    expect(isValidChartSpec(invalidSpec)).toBe(false);
  });
});
