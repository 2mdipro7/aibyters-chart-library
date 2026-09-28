import { describe, expect, it } from "vitest";
import { isValidChartSpec, type DataFrame } from "@aibyters/spec";
import { CATALOG } from "../catalog";
import { planChart } from "../plan";
import { components } from "../SpecChart";

// One frame with a column for every role a catalog entry can ask for
const frame: DataFrame = {
  fields: [
    { key: "cat", label: "Category", type: "string", role: "dimension" },
    { key: "day", label: "Day", type: "string", role: "dimension" },
    { key: "m1", label: "Last year", type: "number", role: "measure", format: "currency" },
    { key: "m2", label: "This year", type: "number", role: "measure", format: "currency" },
    { key: "pct", label: "Occupancy", type: "number", role: "measure", format: "percent" },
  ],
  rows: [
    { cat: "Deluxe", day: "2026-09-01", m1: 1200, m2: 1500, pct: 64 },
    { cat: "Suite", day: "2026-09-02", m1: 900, m2: 700, pct: 41 },
    { cat: "Standard", day: "2026-09-03", m1: 400, m2: 650, pct: 77 },
  ],
  meta: { currencySymbol: "৳" },
};

function specFor(entry: (typeof CATALOG)[number]) {
  const encodings: Record<string, string | string[]> = {};
  let measures = ["m1", "m2", "pct"];
  for (const [role, def] of Object.entries(entry.encodings)) {
    if (def.optional) continue;
    if (def.type === "any") encodings[role] = ["cat", "m1"];
    else if (def.type === "dimension") encodings[role] = role === "x" || role === "time" ? "day" : "cat";
    else {
      const col = entry.kind === "gauge" ? "pct" : measures.shift()!;
      encodings[role] = def.many ? [col] : col;
    }
  }
  return { kind: entry.kind, title: entry.kind, encodings };
}

describe("catalog", () => {
  it("lists each kind once", () => {
    const kinds = CATALOG.map((e) => e.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
  });

  it.each(CATALOG.map((e) => [e.kind, e] as const))("%s is a valid spec that draws its own component", (_kind, entry) => {
    const spec = specFor(entry);
    expect(isValidChartSpec(spec)).toBe(true);
    const plan = planChart(spec as any, frame);
    if (entry.kind !== "table") expect(plan.component).not.toBe("DataTable");
    expect(plan.warnings).toEqual([]);
    expect(components[plan.component]).toBeDefined();
  });

  it("keeps the hotel's symbol on ranked bars and rings", () => {
    const ranked = planChart({ kind: "ranked_bar", title: "t", encodings: { name: "cat", value: "m2" } }, frame);
    expect(ranked.props.valueFormatter(1500)).toBe("৳1,500");
    expect(ranked.props.data[0]).toEqual({ name: "Deluxe", value: 1500 });
    const rings = planChart({ kind: "progress_rings", title: "t", encodings: { name: "cat", value: "pct" } }, frame);
    expect(rings.props.data[0].amount).toBe("64.0%");
  });

  it("names the two sides of a dumbbell after the columns", () => {
    const plan = planChart({ kind: "dumbbell", title: "t", encodings: { name: "cat", a: "m1", b: "m2" } }, frame);
    expect(plan.props).toMatchObject({ aLabel: "Last year", bLabel: "This year" });
  });

  it("shows a big figure without a maximum as a metric rather than a broken dial", () => {
    const plan = planChart({ kind: "gauge", title: "t", encodings: { value: "m1" } }, frame);
    expect(plan.component).toBe("MetricCard");
    expect(plan.warnings[0]).toMatch(/maximum/);
  });
});
