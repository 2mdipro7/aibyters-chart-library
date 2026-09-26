export type Primitive = string | number | boolean | null | Date;

export type FieldType = "string" | "number" | "date" | "boolean";

export type FieldRole = "dimension" | "measure" | "time" | "id" | "category";

export type FieldMeta = {
  key: string;
  label: string;
  type: FieldType;
  role?: FieldRole;
  /** How to show the value: "currency", "percent", "integer", "number", or a date pattern such as "MMM D". */
  format?: string;
};

export type DataFrameMeta = {
  source?: string;
  rowCount?: number;
  lastUpdated?: string;
  /** ISO 4217 code, e.g. "BDT". */
  currency?: string;
  /** Symbol shown before currency values, e.g. "৳". Falls back to the code when absent. */
  currencySymbol?: string;
  /** BCP 47 locale used for number grouping and dates, e.g. "en-BD" or "bn-BD". */
  locale?: string;
  timezone?: string;
};

export type DataFrame = {
  fields: FieldMeta[];
  rows: Record<string, Primitive>[];
  meta?: DataFrameMeta;
};
