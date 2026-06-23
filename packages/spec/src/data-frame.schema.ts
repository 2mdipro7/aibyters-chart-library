import { z } from "zod";
import type { DataFrame } from "./data-frame";

export const FieldTypeSchema = z.enum(["string", "number", "date", "boolean"]);

export const FieldRoleSchema = z.enum(["dimension", "measure", "time", "id", "category"]);

export const FieldMetaSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: FieldTypeSchema,
  role: FieldRoleSchema.optional(),
  format: z.string().optional(),
});

export const DataFrameMetaSchema = z.object({
  source: z.string().optional(),
  rowCount: z.number().optional(),
  lastUpdated: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

export const DataFrameSchema = z.object({
  fields: z.array(FieldMetaSchema),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null(), z.date()]))),
  meta: DataFrameMetaSchema.optional(),
});

export function parseDataFrame(input: unknown): DataFrame {
  return DataFrameSchema.parse(input) as DataFrame;
}

export function isValidDataFrame(input: unknown): input is DataFrame {
  return DataFrameSchema.safeParse(input).success;
}
