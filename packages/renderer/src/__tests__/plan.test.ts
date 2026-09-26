import { describe, expect, it } from "vitest";
import type { DataFrame } from "@aibyters/spec";
import { planChart } from "../plan";
import { formatCell, formatMoney, formatNumber } from "../format";

const frame: DataFrame = {
  fields: [
    { key: "room", label: "Room", type: "string", role: "dimension" },
    { key: "revenue", label: "Revenue", type: "number", role: "measure", format: "currency" },
    { key: "nights", label: "Nights", type: "number", role: "measure", format: "integer" },
  ],
  rows: [
    { room: "101", revenue: 12500, nights: 5 },
    { room: "102", revenue: 9000.5, nights: 3 },
  ],
  meta: { currency: "BDT", currencySymbol: "৳" },
};

describe("planChart", () => {
  it("draws a column spec as columns with the money axis", () => {
    const plan = planChart({ kind: "column", title: "Revenue by room", encodings: { x: "room", y: "revenue" } }, frame);
    expect(plan.component).toBe("ColumnChart");
    expect(plan.props.index).toBe("room");
    expect(plan.props.categories).toEqual(["revenue"]);
    expect(plan.props.valueFormatter(12500)).toBe("৳12.5K");
    expect(plan.warnings).toEqual([]);
  });

  it("puts a bar spec's measure on x and dimension on y", () => {
    const plan = planChart({ kind: "bar", title: "t", encodings: { x: ["revenue", "nights"], y: "room" } }, frame);
    expect(plan.component).toBe("BarChart");
    expect(plan.props.index).toBe("room");
    expect(plan.props.categories).toEqual(["revenue", "nights"]);
    expect(plan.props.valueFormatter(12500)).toBe("12.5K"); // mixed measures: no symbol
  });

  it("falls back to a table when a column is missing", () => {
    const plan = planChart({ kind: "line", title: "t", encodings: { x: "day", y: "revenue" } }, frame);
    expect(plan.component).toBe("DataTable");
    expect(plan.warnings[0]).toMatch(/day/);
    expect(plan.props.columns.map((c: any) => c.key)).toEqual(["room", "revenue", "nights"]);
    expect(plan.props.columns[1].align).toBe("right");
    expect(plan.props.columns[1].render(9000.5)).toBe("৳9,000.50");
    expect(plan.props.columns[2].render(3)).toBe("3");
  });

  it("shows a metric from the first row with the hotel's symbol", () => {
    const plan = planChart({ kind: "metric", title: "Top room revenue", encodings: { value: "revenue" } }, frame);
    expect(plan.component).toBe("MetricCard");
    expect(plan.props.value).toBe(12500);
    expect(plan.props.valueFormatter(12500)).toBe("৳12,500");
  });

  it("keeps a money delta out of the USD-only DeltaCard", () => {
    const deltaFrame: DataFrame = {
      fields: [
        { key: "now", label: "This month", type: "number", format: "currency" },
        { key: "before", label: "Last month", type: "number", format: "currency" },
      ],
      rows: [{ now: 1200, before: 1000 }],
      meta: { currencySymbol: "৳" },
    };
    const plan = planChart({ kind: "delta", title: "Revenue", encodings: { value: "now", comparison: "before" } }, deltaFrame);
    expect(plan.component).toBe("MetricCard");
    expect(plan.props.description).toBe("+20.0% vs ৳1,000");
  });

  it("draws pie and donut with the total in the hole", () => {
    const pie = planChart({ kind: "pie", title: "t", encodings: { name: "room", value: "revenue" } }, frame);
    expect(pie.component).toBe("PieChart");
    expect(pie.props).toMatchObject({ dataKey: "revenue", nameKey: "room" });
    const donut = planChart({ kind: "donut", title: "t", encodings: { name: "room", value: "revenue" } }, frame);
    expect(donut.component).toBe("DonutChart");
    expect(donut.props.centerValue).toBe("৳21,500.50");
    expect(donut.props.centerLabel).toBe("Revenue");
  });

  it("keeps only the table columns that exist, in the order asked", () => {
    const plan = planChart({ kind: "table", title: "t", encodings: { columns: ["revenue", "ghost", "room"] } }, frame);
    expect(plan.props.columns.map((c: any) => c.key)).toEqual(["revenue", "room"]);
    expect(plan.warnings[0]).toMatch(/ghost/);
  });

  it("turns kinds it cannot draw into a table with a warning", () => {
    const plan = planChart(
      { kind: "matrix", title: "t", encodings: { rows: ["room"], columns: ["room"], values: ["revenue"] } },
      frame
    );
    expect(plan.component).toBe("DataTable");
    expect(plan.warnings[0]).toMatch(/matrix/);
  });

  it("copes with an empty frame", () => {
    const empty: DataFrame = { fields: [], rows: [] };
    expect(planChart({ kind: "metric", title: "t", encodings: { value: "n" } }, empty).component).toBe("DataTable");
    expect(planChart({ kind: "table", title: "t", encodings: { columns: [] } }, empty).props.columns).toEqual([]);
  });
});

describe("formatting", () => {
  it("formats money with the symbol and a real minus sign", () => {
    expect(formatMoney(-1234.5, { currencySymbol: "৳" })).toBe("−৳1,234.50");
    expect(formatMoney(1234567, { currencySymbol: "৳", compact: true })).toBe("৳1.2M");
    expect(formatMoney(NaN)).toBe("—");
  });

  it("groups digits by locale", () => {
    expect(formatNumber(1234567, { locale: "en-IN" })).toBe("12,34,567");
  });

  it("formats cells by their field", () => {
    expect(formatCell(45.25, { key: "occ", label: "Occupancy", type: "number", format: "percent" })).toBe("45.3%");
    expect(formatCell(null)).toBe("—");
    expect(formatCell(true)).toBe("Yes");
    expect(formatCell("2026-09-26")).toBe("2026-09-26");
  });
});
