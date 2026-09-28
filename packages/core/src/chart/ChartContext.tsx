import { createContext, useContext } from "react";
import type { ResponsiveChartSettings } from "./responsive";

export interface ChartContextValue {
  /** Measured width of the plot area in px (0 before first measurement). */
  width: number;
  /** Measured height of the plot area in px. */
  height: number;
  settings: ResponsiveChartSettings;
  isTouch: boolean;
  reducedMotion: boolean;
  /** Whether mount animations should run. */
  animate: boolean;
  /** Keys of series currently hidden via the legend. */
  hiddenSeries: ReadonlySet<string>;
  /** Series key currently hovered in the legend, for highlight/dim. */
  highlightedSeries: string | null;
}

const defaultValue: ChartContextValue = {
  width: 0,
  height: 0,
  settings: {
    breakpoint: "md",
    fontSize: 12,
    tickCount: 6,
    strokeWidth: 2.5,
    dotRadius: 5,
    collapseSideLegend: false,
    legendMaxItems: 12,
    padding: 8,
    outsidePieLabels: true,
  },
  isTouch: false,
  reducedMotion: false,
  animate: true,
  hiddenSeries: new Set(),
  highlightedSeries: null,
};

export const ChartContext = createContext<ChartContextValue>(defaultValue);

/** Access the measured size, responsive settings and legend state of the enclosing ChartFrame. */
export function useChartContext(): ChartContextValue {
  return useContext(ChartContext);
}
