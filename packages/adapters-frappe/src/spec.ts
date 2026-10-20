/**
 * JSON dashboard specification stored in the Frappe app's "AIB Dashboard" DocType and rendered by
 * `<FrappeDashboard>`. Designed to be authored by non-developers in a form, validated by zod.
 */
import { z } from "zod";

export const DataSourceSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("report"), name: z.string(), filters: z.record(z.string(), z.any()).optional() }),
  z.object({ kind: z.literal("list"), doctype: z.string(), fields: z.array(z.string()).optional(), filters: z.any().optional(), order_by: z.string().optional(), limit: z.number().optional(), group_by: z.string().optional() }),
  z.object({ kind: z.literal("dashboard_chart"), name: z.string() }),
  z.object({ kind: z.literal("number_card"), name: z.string() }),
  z.object({ kind: z.literal("method"), method: z.string(), args: z.record(z.string(), z.any()).optional() }),
  /** Server-side aggregation handled by the Frappe app (`aibyters_charts.api.query`). */
  z.object({
    kind: z.literal("query"),
    doctype: z.string(),
    dimension: z.string().optional(),
    series: z.string().optional(),
    measure: z.string().optional(),
    aggregate: z.enum(["sum", "count", "avg", "min", "max"]).default("sum"),
    filters: z.any().optional(),
    time_grain: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
    limit: z.number().optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
  /** Inline static rows, useful for demos and tests. */
  z.object({ kind: z.literal("static"), rows: z.array(z.record(z.string(), z.any())) }),
]);
export type DataSource = z.infer<typeof DataSourceSchema>;

export const WidgetTypeSchema = z.enum([
  "metric", "delta", "target", "sparkline", "progress", "metric_strip",
  "line", "area", "stacked_area", "column", "bar", "combo", "pie", "donut", "radar", "radial_bar",
  "scatter", "treemap", "funnel", "waterfall", "gauge", "bullet", "pareto",
  "ranked_bar", "diverging_bar", "waffle", "composition_band", "status_strip", "progress_rings", "paired_bar", "dumbbell", "lollipop", "slope",
  "table", "heatmap", "histogram",
]);
export type WidgetType = z.infer<typeof WidgetTypeSchema>;

export const WidgetSchema = z.object({
  id: z.string(),
  type: WidgetTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  source: DataSourceSchema,
  /** Field mappings. Keys depend on the widget type, e.g. { index, categories, dataKey, nameKey, value, a, b }. */
  encodings: z.record(z.string(), z.any()).default({}),
  /** Chart-specific props passed through (height, legend, dataLabels, colors, stacked, ...). */
  options: z.record(z.string(), z.any()).default({}),
  /** Grid column span. */
  span: z.number().int().min(1).max(12).default(1),
  /** Number format for values: number | count | currency | percent | compact. */
  format: z.enum(["number", "count", "currency", "percent", "compact"]).optional(),
  currency: z.string().optional(),
  /** Desk route or URL opened when a mark is clicked (supports {field} placeholders). */
  drilldown: z.string().optional(),
  /** Refresh interval in seconds (0 = manual). */
  refresh: z.number().int().min(0).default(0),
});
export type WidgetSpec = z.infer<typeof WidgetSchema>;

export const DashboardSpecSchema = z.object({
  version: z.literal(1).default(1),
  title: z.string(),
  description: z.string().optional(),
  columns: z.number().int().min(1).max(6).default(3),
  minColumnWidth: z.number().int().min(200).default(320),
  /** Global filters rendered above the grid; values are merged into every source's filters. */
  filters: z.array(z.object({ fieldname: z.string(), label: z.string(), fieldtype: z.enum(["Link", "Select", "Date", "DateRange", "Data"]), options: z.string().optional(), default: z.any().optional() })).default([]),
  theme: z.object({ palette: z.array(z.string()).optional(), primaryAsFirstSeries: z.boolean().optional() }).optional(),
  widgets: z.array(WidgetSchema),
});
export type DashboardSpec = z.infer<typeof DashboardSpecSchema>;

export function parseDashboardSpec(input: unknown): DashboardSpec {
  return DashboardSpecSchema.parse(typeof input === "string" ? JSON.parse(input) : input);
}
