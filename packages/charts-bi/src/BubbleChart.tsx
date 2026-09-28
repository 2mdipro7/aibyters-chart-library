import { ScatterChart, type ScatterChartProps } from "./ScatterChart";

export interface BubbleChartProps extends Omit<ScatterChartProps, "sizeKey"> {
  sizeKey: string;
}

/** Scatter with an area-encoded third dimension. Thin wrapper over `ScatterChart`. */
export function BubbleChart(props: BubbleChartProps) {
  return <ScatterChart {...props} />;
}
