import { PieChart, type PieChartProps } from "./PieChart";

export type DonutChartProps = Omit<PieChartProps, "innerRadiusRatio"> & { innerRadiusRatio?: number };

/** Part-of-whole ring with optional centre KPI. Labels are placed outside the ring with collision avoidance when there is room. */
export function DonutChart(props: DonutChartProps) {
  return <PieChart {...props} innerRadiusRatio={props.innerRadiusRatio ?? 0.62} />;
}
