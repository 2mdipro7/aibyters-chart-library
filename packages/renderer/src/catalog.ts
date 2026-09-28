/**
 * What the renderer can draw from query results, described for a model (or a person) choosing a
 * chart. Every entry is a ChartSpec kind that planChart() handles: `encodings` names the roles the
 * spec must fill with column keys, and whether each role wants a dimension (text, date) or a
 * measure (number). The embed build writes this list to catalog.json next to the bundle, so a
 * backend can put it in a prompt and validate the answer against the library it actually ships.
 */

export type RoleType = "dimension" | "measure" | "any";

export interface CatalogRole {
  type: RoleType;
  /** Takes one column or a list of columns. */
  many?: boolean;
  optional?: boolean;
  /** What the role means, in a few words. */
  note?: string;
}

export interface CatalogEntry {
  kind: string;
  /** When this chart is the right choice, in one line. */
  use: string;
  encodings: Record<string, CatalogRole>;
  /** "one" = the query returns exactly one row; "many" = one row per category or point. */
  rows: "one" | "many";
  /** Most rows the chart reads well with; more rows fall back to a sturdier chart. */
  maxRows?: number;
  /** Optional presentation switches, e.g. { mode: ["stacked", "grouped"] }. */
  presentation?: Record<string, string[]>;
}

const dim = (note?: string): CatalogRole => ({ type: "dimension", note });
const measure = (note?: string, extra: Partial<CatalogRole> = {}): CatalogRole => ({ type: "measure", note, ...extra });

export const CATALOG: CatalogEntry[] = [
  // One number
  { kind: "metric", use: "a single figure (total revenue, bookings today)", rows: "one", encodings: { value: measure() } },
  { kind: "delta", use: "one figure compared with an earlier one (this month vs last month)", rows: "one", encodings: { value: measure("current"), comparison: measure("earlier") } },
  { kind: "target", use: "one figure against a goal", rows: "one", encodings: { value: measure(), target: measure("goal") } },
  { kind: "gauge", use: "one rate or level on a dial (occupancy %, % of target)", rows: "one", encodings: { value: measure(), max: measure("top of the dial, default 100", { optional: true }), target: measure("target mark", { optional: true }) } },
  { kind: "progress", use: "how far one figure is towards its maximum", rows: "one", encodings: { value: measure(), max: measure() } },

  // Over time
  { kind: "line", use: "one or more measures over time (daily occupancy, monthly revenue)", rows: "many", encodings: { x: dim("time"), y: measure(undefined, { many: true }) } },
  { kind: "area", use: "volume over time; stacked shows how parts add up to the total", rows: "many", encodings: { x: dim("time"), y: measure(undefined, { many: true }) }, presentation: { mode: ["stacked", "overlap"] } },
  { kind: "sparkline", use: "a compact trend with the latest value", rows: "many", encodings: { time: dim(), value: measure() } },
  { kind: "combo", use: "two measures on one timeline, one as bars and one as a line (revenue and occupancy)", rows: "many", encodings: { x: dim(), yBar: measure(), yLine: measure() } },

  // Categories
  { kind: "column", use: "a measure per category in a natural order (months, weekdays, room types)", rows: "many", maxRows: 24, encodings: { x: dim(), y: measure(undefined, { many: true }) }, presentation: { mode: ["grouped", "stacked"] } },
  { kind: "bar", use: "a measure per category with long names, several measures side by side", rows: "many", maxRows: 30, encodings: { y: dim(), x: measure(undefined, { many: true }) }, presentation: { mode: ["grouped", "stacked"] } },
  { kind: "ranked_bar", use: "a ranking, best first (top guests, top rooms, top expense categories)", rows: "many", maxRows: 50, encodings: { name: dim(), value: measure() } },
  { kind: "lollipop", use: "a ranking or comparison of many categories with a lighter look than bars", rows: "many", maxRows: 40, encodings: { name: dim(), value: measure() } },
  { kind: "pareto", use: "which few categories make most of the total (the 80/20 view)", rows: "many", maxRows: 30, encodings: { name: dim(), value: measure() } },
  { kind: "diverging_bar", use: "gains and losses per category, positive and negative values (change vs last month, profit per category)", rows: "many", maxRows: 30, encodings: { name: dim(), value: measure("signed") } },
  { kind: "dumbbell", use: "two values per category and the gap between them (last year vs this year per room type)", rows: "many", maxRows: 20, encodings: { name: dim(), a: measure("first"), b: measure("second") } },
  { kind: "slope", use: "how each category moved between two points in time", rows: "many", maxRows: 12, encodings: { name: dim(), start: measure("before"), end: measure("after") } },

  // Part of a whole
  { kind: "donut", use: "shares of a whole with the total in the middle", rows: "many", maxRows: 8, encodings: { name: dim(), value: measure() } },
  { kind: "pie", use: "shares of a whole", rows: "many", maxRows: 8, encodings: { name: dim(), value: measure() } },
  { kind: "waffle", use: "shares of a whole as a 10x10 grid, easy to read as percentages", rows: "many", maxRows: 6, encodings: { name: dim(), value: measure() } },
  { kind: "treemap", use: "shares of a whole with many parts (expenses by category)", rows: "many", maxRows: 40, encodings: { name: dim(), value: measure() } },
  { kind: "progress_rings", use: "a rate per category, each out of its own maximum (occupancy per room type)", rows: "many", maxRows: 8, encodings: { name: dim(), value: measure(), max: measure("denominator per row", { optional: true }) } },

  // Flow and records
  { kind: "funnel", use: "counts dropping through ordered stages (enquiries, reservations, check-ins)", rows: "many", maxRows: 8, encodings: { stage: dim(), value: measure() } },
  { kind: "waterfall", use: "how steps add and subtract to reach a total (income, then each expense)", rows: "many", maxRows: 15, encodings: { x: dim(), y: measure("signed change") } },
  { kind: "table", use: "lists of records or anything with many columns", rows: "many", encodings: { columns: { type: "any", many: true } } },
];

export const catalogVersion = 1;
