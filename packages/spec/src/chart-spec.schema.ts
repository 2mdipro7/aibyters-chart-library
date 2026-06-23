import { z } from "zod";
import type { ChartSpec } from "./chart-spec";

export const ChartKindSchema = z.enum([
  "metric", "delta", "target", "sparkline", "severity", "progress",
  "line", "bar", "area", "combo", "table", "matrix", "waterfall", "funnel",
  "forecast", "anomaly", "insight", "recommendation"
]);

const BaseSpecSchema = z.object({
  kind: ChartKindSchema,
  title: z.string(),
  description: z.string().optional(),
});

export const MetricSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("metric"),
  encodings: z.object({ value: z.string() }),
});

export const DeltaSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("delta"),
  encodings: z.object({ value: z.string(), comparison: z.string() }),
  presentation: z.object({ invertColors: z.boolean().optional() }).optional(),
});

export const TargetSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("target"),
  encodings: z.object({ value: z.string(), target: z.string() }),
});

export const SparklineSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("sparkline"),
  encodings: z.object({ time: z.string(), value: z.string() }),
});

export const SeveritySpecSchema = BaseSpecSchema.extend({
  kind: z.literal("severity"),
  encodings: z.object({ status: z.string(), message: z.string() }),
});

export const ProgressSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("progress"),
  encodings: z.object({ value: z.string(), max: z.string() }),
  presentation: z.object({ type: z.enum(["circular", "linear"]).optional() }).optional(),
});

export const LineSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("line"),
  encodings: z.object({
    x: z.string(),
    y: z.union([z.string(), z.array(z.string())]),
    color: z.string().optional()
  }),
  presentation: z.object({ curve: z.enum(["linear", "smooth", "step"]).optional() }).optional(),
});

export const BarSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("bar"),
  encodings: z.object({
    x: z.union([z.string(), z.array(z.string())]),
    y: z.string(),
    color: z.string().optional()
  }),
  presentation: z.object({
    mode: z.enum(["grouped", "stacked"]).optional(),
    orientation: z.enum(["horizontal", "vertical"]).optional()
  }).optional(),
});

export const AreaSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("area"),
  encodings: z.object({
    x: z.string(),
    y: z.union([z.string(), z.array(z.string())]),
    color: z.string().optional()
  }),
  presentation: z.object({
    mode: z.enum(["stacked", "overlap"]).optional()
  }).optional(),
});

export const ComboSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("combo"),
  encodings: z.object({ x: z.string(), yBar: z.string(), yLine: z.string() }),
});

export const TableSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("table"),
  encodings: z.object({ columns: z.array(z.string()) }),
});

export const MatrixSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("matrix"),
  encodings: z.object({ rows: z.array(z.string()), columns: z.array(z.string()), values: z.array(z.string()) }),
});

export const WaterfallSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("waterfall"),
  encodings: z.object({ x: z.string(), y: z.string() }),
});

export const FunnelSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("funnel"),
  encodings: z.object({ stage: z.string(), value: z.string() }),
});

export const ForecastSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("forecast"),
  encodings: z.object({
    time: z.string(),
    actual: z.string(),
    forecast: z.string(),
    lowerBound: z.string(),
    upperBound: z.string()
  }),
});

export const AnomalySpecSchema = BaseSpecSchema.extend({
  kind: z.literal("anomaly"),
  encodings: z.object({ time: z.string(), value: z.string(), isAnomaly: z.string() }),
});

export const InsightCardSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("insight"),
  encodings: z.object({
    severity: z.string(),
    summary: z.string(),
    metric: z.string().optional(),
    evidenceIds: z.string().optional()
  }),
});

export const RecommendationSpecSchema = BaseSpecSchema.extend({
  kind: z.literal("recommendation"),
  encodings: z.object({
    action: z.string(),
    confidence: z.string(),
    impact: z.string(),
    reason: z.string()
  }),
});

export const ChartSpecSchema = z.discriminatedUnion("kind", [
  MetricSpecSchema, DeltaSpecSchema, TargetSpecSchema, SparklineSpecSchema, SeveritySpecSchema, ProgressSpecSchema,
  LineSpecSchema, BarSpecSchema, AreaSpecSchema, ComboSpecSchema, TableSpecSchema, MatrixSpecSchema,
  WaterfallSpecSchema, FunnelSpecSchema, ForecastSpecSchema, AnomalySpecSchema, InsightCardSpecSchema, RecommendationSpecSchema
]);

export function parseChartSpec(input: unknown): ChartSpec {
  return ChartSpecSchema.parse(input) as ChartSpec;
}
