import { AreaChart, type AreaChartProps } from "./AreaChart";

export type StackedAreaChartProps = Omit<AreaChartProps, "stacked">;

/** Composition over time. Thin wrapper over `AreaChart` with `stacked` on; use `percent` for 100% stacking. */
export function StackedAreaChart(props: StackedAreaChartProps) {
  return <AreaChart {...props} stacked fillOpacity={props.fillOpacity ?? 0.6} />;
}
