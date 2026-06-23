import { describe, it, expect } from "vitest";
import { parseChartSpec } from "../chart-spec.schema";

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
  });
});
