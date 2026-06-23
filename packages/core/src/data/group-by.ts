import type { DataFrame } from "@aibyters/spec";
import { group, rollup, sum, mean, min, max } from "d3-array";

export type AggregationMethod = "sum" | "mean" | "min" | "max" | "count";

export function aggregateData(
  dataFrame: DataFrame,
  groupByFields: string[],
  measureField: string,
  method: AggregationMethod = "sum"
) {
  // Convert list of objects to nested maps using d3-array's rollup
  
  const getAggregator = () => {
    switch (method) {
      case "sum": return (v: any[]) => sum(v, d => Number(d[measureField]));
      case "mean": return (v: any[]) => mean(v, d => Number(d[measureField]));
      case "min": return (v: any[]) => min(v, d => Number(d[measureField]));
      case "max": return (v: any[]) => max(v, d => Number(d[measureField]));
      case "count": return (v: any[]) => v.length;
      default: return (v: any[]) => v.length;
    }
  };

  const keys = groupByFields.map(field => (d: any) => d[field]);
  
  // @ts-ignore - dynamic spreading of keys for d3 rollup
  const rolled = rollup(dataFrame.rows, getAggregator(), ...keys);
  
  return rolled;
}
