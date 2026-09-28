import type { CSSProperties, ReactNode } from "react";

export type LegendPosition = "bottom" | "top" | "right" | "left" | "none";

export interface LegendOptions {
  /** Where to render the legend. Rendered as HTML outside the plot so it can never overlap marks. */
  position?: LegendPosition;
  /** Allow click-to-toggle series visibility and hover-to-highlight. Default true. */
  interactive?: boolean;
  /** Maximum legend rows before the legend becomes a scrollable strip. Default 3. */
  maxRows?: number;
  /** Alignment of legend items along the main axis. */
  align?: "start" | "center" | "end";
}

export type DataLabelMode = "auto" | "always" | "never";

export interface DataLabelOptions {
  /** auto = only draw a label when it fits its mark and does not collide with a neighbour. */
  mode?: DataLabelMode;
  /** Formatter for label text. Defaults to the chart valueFormatter. */
  formatter?: (value: number, datum?: any) => string;
  /** Minimum mark size (px) below which auto labels are suppressed. Default 18. */
  minMarkSize?: number;
  /** Font size in px. Default 11. */
  fontSize?: number;
}

/**
 * number  = fixed plot height in px.
 * "auto"  = derived from `aspectRatio` × container width.
 * "fill"  = grow to fill the parent (use inside equal-height grid cards or full-screen views).
 */
export type ChartHeight = number | "auto" | "fill";

/**
 * Props shared by every chart component in the library.
 * Chart packages extend this interface rather than redefining the same options.
 */
export interface BaseChartProps {
  title: string;
  description?: string;
  /**
   * Plot height in px, or "auto" to derive from `aspectRatio` and the container width.
   * The legend is *added* outside this height, so a 300px chart with a three-row legend
   * never squeezes the plot.
   */
  height?: ChartHeight;
  /** Width / height when height="auto". Default 16/9. */
  aspectRatio?: number;
  /** Lower bound for the plot area in px. Default 160. */
  minHeight?: number;
  /** Legend behaviour. `false` hides the legend. */
  legend?: boolean | LegendOptions;
  /** Data label behaviour. `true` = "auto", `false` = "never". */
  dataLabels?: boolean | DataLabelOptions;
  /** Series colours. Defaults to the theme palette (`--vi-color-chart-*`). */
  colors?: string[];
  /** Formatter for numeric values (axis ticks, tooltips, data labels). */
  valueFormatter?: (value: number) => string;
  /** Formatter for category / x-axis labels. */
  labelFormatter?: (label: string | number) => string;
  /** Show a skeleton instead of the chart. */
  loading?: boolean;
  /** Show an error state instead of the chart. */
  error?: string | Error | null;
  /** Message shown when `data` is empty. */
  emptyMessage?: string;
  /** Render the chart without the card chrome (title bar, border, padding). */
  variant?: "card" | "plain";
  /** Accessible description for screen readers. Defaults to title + description. */
  ariaLabel?: string;
  /** Slot rendered in the card header (filters, actions). */
  headerAction?: ReactNode;
  /** Slot rendered under the plot (footnotes, sources). */
  footer?: ReactNode;
  /** Enable the CSV / Excel export menu with these rows. */
  exportData?: Record<string, any>[];
  exportColumns?: string[];
  className?: string;
  style?: CSSProperties;
  /** Disable mount animations (recommended for server-side rendering and PDF export). */
  animate?: boolean;
}

export interface SeriesDescriptor {
  key: string;
  label: string;
  color: string;
  /** Optional marker shape shown in the legend. */
  shape?: "circle" | "square" | "line" | "dashed";
}

export function resolveLegend(legend: BaseChartProps["legend"], fallback: LegendOptions = {}): Required<LegendOptions> {
  const base: Required<LegendOptions> = {
    position: "bottom",
    interactive: true,
    maxRows: 3,
    align: "center",
    ...fallback,
  } as Required<LegendOptions>;
  if (legend === false) return { ...base, position: "none" };
  if (legend === true || legend === undefined) return base;
  return { ...base, ...legend } as Required<LegendOptions>;
}

export function resolveDataLabels(
  dataLabels: BaseChartProps["dataLabels"],
  fallbackMode: DataLabelMode = "auto"
): Required<Omit<DataLabelOptions, "formatter">> & { formatter?: DataLabelOptions["formatter"] } {
  const base = { mode: fallbackMode, minMarkSize: 18, fontSize: 11, formatter: undefined as DataLabelOptions["formatter"] };
  if (dataLabels === false) return { ...base, mode: "never" };
  if (dataLabels === true) return { ...base, mode: "auto" };
  if (dataLabels === undefined) return base;
  return { ...base, ...dataLabels };
}
