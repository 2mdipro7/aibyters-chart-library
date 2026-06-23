export type Primitive = string | number | boolean | null | Date;

export type FieldType = "string" | "number" | "date" | "boolean";

export type FieldRole = "dimension" | "measure" | "time" | "id" | "category";

export type FieldMeta = {
  key: string;
  label: string;
  type: FieldType;
  role?: FieldRole;
  format?: string;
};

export type DataFrameMeta = {
  source?: string;
  rowCount?: number;
  lastUpdated?: string;
  currency?: string;
  timezone?: string;
};

export type DataFrame = {
  fields: FieldMeta[];
  rows: Record<string, Primitive>[];
  meta?: DataFrameMeta;
};
