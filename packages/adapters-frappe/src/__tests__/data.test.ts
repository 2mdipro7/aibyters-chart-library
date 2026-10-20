import { describe, expect, it } from "vitest";
import { dashboardChartToSeries, listToDataFrame, parseReportColumn, pivotLong, reportToDataFrame } from "../data";
import { parseDashboardSpec } from "../spec";
import { frappeThemeOverrides } from "../theme";

describe("parseReportColumn", () => {
  it("parses legacy string columns", () => {
    expect(parseReportColumn("Grand Total:Currency/currency:120", 0)).toEqual({ fieldname: "grand_total", label: "Grand Total", fieldtype: "Currency" });
    expect(parseReportColumn("Customer:Link/Customer:200", 1)).toEqual({ fieldname: "customer", label: "Customer", fieldtype: "Link" });
  });
  it("parses object columns", () => {
    expect(parseReportColumn({ fieldname: "qty", label: "Qty", fieldtype: "Float" }, 0)).toEqual({ fieldname: "qty", label: "Qty", fieldtype: "Float" });
  });
});

describe("reportToDataFrame", () => {
  it("handles array rows and object rows, coercing numbers and nulls", () => {
    const df = reportToDataFrame({ columns: ["Customer:Link/Customer:200", "Total:Currency:120"], result: [["Acme", "1,200.50"], ["Globex", null]] });
    expect(df.fields.map((f) => f.type)).toEqual(["string", "number"]);
    expect(df.rows).toEqual([{ customer: "Acme", total: 1200.5 }, { customer: "Globex", total: null }]);
    const df2 = reportToDataFrame({ columns: [{ fieldname: "a", fieldtype: "Int" }], result: [{ a: 3 }, {}] });
    expect(df2.rows).toEqual([{ a: 3 }]);
  });
});

describe("dashboardChartToSeries", () => {
  it("turns labels + datasets into wide rows", () => {
    const s = dashboardChartToSeries({ labels: ["Jan", "Feb"], datasets: [{ name: "Sales", values: [1, 2] }, { name: "Cost", values: [3, 4] }] });
    expect(s.categories).toEqual(["Sales", "Cost"]);
    expect(s.data).toEqual([{ label: "Jan", Sales: 1, Cost: 3 }, { label: "Feb", Sales: 2, Cost: 4 }]);
  });
});

describe("pivotLong", () => {
  it("pivots long rows and sums duplicates", () => {
    const p = pivotLong([{ m: "Jan", s: "A", v: 1 }, { m: "Jan", s: "A", v: 2 }, { m: "Jan", s: "B", v: 5 }, { m: "Feb", s: "A", v: 7 }], "m", "s", "v");
    expect(p.categories).toEqual(["A", "B"]);
    expect(p.data).toEqual([{ m: "Jan", A: 3, B: 5 }, { m: "Feb", A: 7 }]);
  });
});

describe("listToDataFrame", () => {
  it("infers field types from samples", () => {
    const df = listToDataFrame([{ name: "X", posting_date: "2026-01-02", total: 5 }]);
    expect(df.fields.map((f) => [f.key, f.type])).toEqual([["name", "string"], ["posting_date", "date"], ["total", "number"]]);
  });
});

describe("spec", () => {
  it("applies defaults and rejects unknown widget types", () => {
    const spec = parseDashboardSpec({ title: "T", widgets: [{ id: "a", type: "metric", title: "A", source: { kind: "number_card", name: "N" } }] });
    expect(spec.columns).toBe(3);
    expect(spec.widgets[0].span).toBe(1);
    expect(() => parseDashboardSpec({ title: "T", widgets: [{ id: "a", type: "nope", title: "A", source: { kind: "static", rows: [] } }] })).toThrow();
  });
});

describe("frappeThemeOverrides", () => {
  it("maps Desk variables with fallbacks and uses --primary as series 0", () => {
    const o = frappeThemeOverrides();
    expect(o["--vi-color-text-primary"]).toBe("var(--text-color, #1f272e)");
    expect(o["--vi-color-chart-0"]).toContain("--primary");
    expect(frappeThemeOverrides({ palette: ["#111", "#222"] })["--vi-color-chart-1"]).toBe("#222");
  });
});
