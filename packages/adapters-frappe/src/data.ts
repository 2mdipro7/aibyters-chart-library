import type { DataFrame, FieldMeta, FieldType } from "@aibyters/spec";

/**
 * Adapters from the shapes Frappe returns to the library's row / DataFrame conventions.
 * Nothing here touches the network; see `api.ts` for calls.
 */

/** Frappe report column, either the legacy "Label:Fieldtype/Options:Width" string or an object. */
export type FrappeReportColumn =
  | string
  | { fieldname?: string; label?: string; fieldtype?: string; options?: string; width?: number };

export interface FrappeReportResult {
  columns: FrappeReportColumn[];
  result: Array<Record<string, any> | any[]>;
  /** Script reports may also return a `chart` block; we ignore it. */
  [key: string]: any;
}

const NUMERIC_TYPES = new Set(["Int", "Float", "Currency", "Percent", "Duration", "Rating"]);
const DATE_TYPES = new Set(["Date", "Datetime", "Time"]);

function fieldTypeFromFrappe(ft?: string): FieldType {
  if (!ft) return "string";
  if (NUMERIC_TYPES.has(ft)) return "number";
  if (DATE_TYPES.has(ft)) return "date";
  if (ft === "Check") return "boolean";
  return "string";
}

function slug(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

/** Normalises a report column definition to `{ fieldname, label, fieldtype }`. */
export function parseReportColumn(col: FrappeReportColumn, index: number): { fieldname: string; label: string; fieldtype: string } {
  if (typeof col === "string") {
    const [label, typeSpec = "Data"] = col.split(":");
    const fieldtype = typeSpec.split("/")[0] || "Data";
    return { fieldname: slug(label) || `col_${index}`, label, fieldtype };
  }
  const label = col.label ?? col.fieldname ?? `Column ${index + 1}`;
  return { fieldname: col.fieldname ?? slug(label) ?? `col_${index}`, label, fieldtype: col.fieldtype ?? "Data" };
}

/** Converts a Query/Script Report response (`frappe.desk.query_report.run`) to a DataFrame. */
export function reportToDataFrame(report: FrappeReportResult, source?: string): DataFrame {
  const cols = (report.columns ?? []).map(parseReportColumn);
  const fields: FieldMeta[] = cols.map((c) => ({ key: c.fieldname, label: c.label, type: fieldTypeFromFrappe(c.fieldtype), role: fieldTypeFromFrappe(c.fieldtype) === "number" ? "measure" : fieldTypeFromFrappe(c.fieldtype) === "date" ? "time" : "dimension" }));
  const rows = (report.result ?? [])
    .filter((r) => r && (Array.isArray(r) ? r.length : Object.keys(r).length))
    .map((r) => {
      if (Array.isArray(r)) {
        const o: Record<string, any> = {};
        cols.forEach((c, i) => (o[c.fieldname] = coerce(r[i], fields[i]?.type)));
        return o;
      }
      const o: Record<string, any> = {};
      for (const f of fields) o[f.key] = coerce(r[f.key], f.type);
      return o;
    });
  return { fields, rows, meta: { source, rowCount: rows.length } };
}

function coerce(v: any, t?: FieldType) {
  if (v === undefined || v === null || v === "") return null;
  if (t === "number") {
    const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.\-eE]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  if (t === "boolean") return v === 1 || v === true || v === "1";
  return v;
}

/** Shape returned by `frappe.desk.doctype.dashboard_chart.dashboard_chart.get`. */
export interface FrappeDashboardChartData {
  labels: Array<string | number>;
  datasets: Array<{ name: string; values: number[] }>;
}

/** Converts Dashboard Chart data to `{ index, categories, data }` for Line/Column/Area charts. */
export function dashboardChartToSeries(d: FrappeDashboardChartData, indexKey = "label") {
  const categories = d.datasets.map((s) => s.name);
  const data = d.labels.map((label, i) => {
    const row: Record<string, any> = { [indexKey]: label };
    for (const s of d.datasets) row[s.name] = s.values[i] ?? null;
    return row;
  });
  return { index: indexKey, categories, data };
}

/** Converts `frappe.client.get_list` rows (already objects) to a DataFrame, inferring types. */
export function listToDataFrame(rows: Record<string, any>[], source?: string): DataFrame {
  const first = rows[0] ?? {};
  const fields: FieldMeta[] = Object.keys(first).map((key) => {
    const sample = rows.find((r) => r[key] !== null && r[key] !== undefined)?.[key];
    const type: FieldType = typeof sample === "number" ? "number" : typeof sample === "boolean" ? "boolean" : /^\d{4}-\d{2}-\d{2}/.test(String(sample)) ? "date" : "string";
    return { key, label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), type, role: type === "number" ? "measure" : type === "date" ? "time" : "dimension" };
  });
  return { fields, rows, meta: { source, rowCount: rows.length } };
}

/** Pivots long rows (`dimension`, `series`, `value`) into wide rows for multi-series charts. */
export function pivotLong(rows: Record<string, any>[], dimension: string, series: string, value: string) {
  const categories: string[] = [];
  const byDim = new Map<any, Record<string, any>>();
  for (const r of rows) {
    const s = String(r[series]);
    if (!categories.includes(s)) categories.push(s);
    const row = byDim.get(r[dimension]) ?? { [dimension]: r[dimension] };
    row[s] = (row[s] ?? 0) + (Number(r[value]) || 0);
    byDim.set(r[dimension], row);
  }
  return { index: dimension, categories, data: Array.from(byDim.values()) };
}
