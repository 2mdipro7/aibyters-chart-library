import type { DataFrame } from "@aibyters/spec";

export type AggregationMethod = "sum" | "mean" | "min" | "max" | "count";

function aggregate(values: number[], method: AggregationMethod): number {
  const finite = values.filter((v) => Number.isFinite(v));
  switch (method) {
    case "sum":
      return finite.reduce((a, b) => a + b, 0);
    case "mean":
      return finite.length ? finite.reduce((a, b) => a + b, 0) / finite.length : NaN;
    case "min":
      return finite.length ? Math.min(...finite) : NaN;
    case "max":
      return finite.length ? Math.max(...finite) : NaN;
    case "count":
    default:
      return values.length;
  }
}

/**
 * Nested group-by + aggregate, dependency free. Returns a Map keyed by the first
 * group field, nested one level per additional field, with the aggregate at the leaves.
 */
export function aggregateData(
  dataFrame: DataFrame,
  groupByFields: string[],
  measureField: string,
  method: AggregationMethod = "sum"
): Map<any, any> {
  const rows: any[] = (dataFrame as any).rows ?? [];
  const build = (subset: any[], depth: number): Map<any, any> | number => {
    if (depth >= groupByFields.length) return aggregate(subset.map((r) => Number(r[measureField])), method);
    const field = groupByFields[depth];
    const buckets = new Map<any, any[]>();
    for (const r of subset) {
      const k = r[field];
      const arr = buckets.get(k);
      if (arr) arr.push(r);
      else buckets.set(k, [r]);
    }
    const out = new Map<any, any>();
    for (const [k, v] of buckets) out.set(k, build(v, depth + 1));
    return out;
  };
  const result = build(rows, 0);
  return result instanceof Map ? result : new Map([[measureField, result]]);
}

/** Flat group-by: one aggregate per distinct key value, in first-seen order. */
export function groupAggregate<T extends Record<string, any>>(
  rows: T[],
  groupField: keyof T & string,
  measureField: keyof T & string,
  method: AggregationMethod = "sum"
): Array<{ key: any; value: number; count: number }> {
  const buckets = new Map<any, number[]>();
  for (const r of rows) {
    const k = r[groupField];
    const arr = buckets.get(k);
    const v = Number(r[measureField]);
    if (arr) arr.push(v);
    else buckets.set(k, [v]);
  }
  return Array.from(buckets, ([key, values]) => ({ key, value: aggregate(values, method), count: values.length }));
}
