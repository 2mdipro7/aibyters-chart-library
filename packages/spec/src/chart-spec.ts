export type ChartKind =
  | "metric"
  | "delta"
  | "target"
  | "sparkline"
  | "severity"
  | "progress"
  | "line"
  | "bar"
  | "column"
  | "area"
  | "combo"
  | "pie"
  | "donut"
  | "table"
  | "matrix"
  | "waterfall"
  | "funnel"
  | "forecast"
  | "anomaly"
  | "insight"
  | "recommendation";

export type BaseSpec = {
  kind: ChartKind;
  title: string;
  description?: string;
};

// --- KPI Specs ---

export type MetricSpec = BaseSpec & {
  kind: "metric";
  encodings: {
    value: string; // key from DataFrame
  };
};

export type DeltaSpec = BaseSpec & {
  kind: "delta";
  encodings: {
    value: string;
    comparison: string;
  };
  presentation?: {
    invertColors?: boolean; // true if lower is better
  };
};

export type TargetSpec = BaseSpec & {
  kind: "target";
  encodings: {
    value: string;
    target: string;
  };
};

export type SparklineSpec = BaseSpec & {
  kind: "sparkline";
  encodings: {
    time: string;
    value: string;
  };
};

export type SeverityLevel = "positive" | "warning" | "critical" | "info";

export type SeveritySpec = BaseSpec & {
  kind: "severity";
  encodings: {
    status: string; // should map to SeverityLevel
    message: string;
  };
};

export type ProgressSpec = BaseSpec & {
  kind: "progress";
  encodings: {
    value: string;
    max: string;
  };
  presentation?: {
    type?: "circular" | "linear";
  };
};

// --- BI Specs ---

export type LineSpec = BaseSpec & {
  kind: "line";
  encodings: {
    x: string; // time or dimension
    y: string | string[]; // one or more measures
    color?: string; // dimension for multi-series
  };
  presentation?: {
    curve?: "linear" | "smooth" | "step";
  };
};

/** Horizontal bars: one bar per row of the `y` dimension, length from the `x` measure(s). */
export type BarSpec = BaseSpec & {
  kind: "bar";
  encodings: {
    x: string | string[]; // measure(s)
    y: string; // dimension
    color?: string;
  };
  presentation?: {
    mode?: "grouped" | "stacked";
    orientation?: "horizontal" | "vertical";
  };
};

/** Vertical columns: one column per row of the `x` dimension, height from the `y` measure(s). */
export type ColumnSpec = BaseSpec & {
  kind: "column";
  encodings: {
    x: string; // dimension
    y: string | string[]; // measure(s)
    color?: string;
  };
  presentation?: {
    mode?: "grouped" | "stacked";
  };
};

export type AreaSpec = BaseSpec & {
  kind: "area";
  encodings: {
    x: string;
    y: string | string[];
    color?: string;
  };
  presentation?: {
    mode?: "stacked" | "overlap";
  };
};

export type ComboSpec = BaseSpec & {
  kind: "combo";
  encodings: {
    x: string;
    yBar: string;
    yLine: string;
  };
};

/** Share of a whole: one slice per row, labelled by `name`, sized by `value`. */
export type PieSpec = BaseSpec & {
  kind: "pie";
  encodings: {
    name: string;
    value: string;
  };
};

export type DonutSpec = BaseSpec & {
  kind: "donut";
  encodings: {
    name: string;
    value: string;
  };
  presentation?: {
    centerLabel?: string; // text under the total shown in the hole
  };
};

export type TableSpec = BaseSpec & {
  kind: "table";
  encodings: {
    columns: string[];
  };
};

export type MatrixSpec = BaseSpec & {
  kind: "matrix";
  encodings: {
    rows: string[];
    columns: string[];
    values: string[];
  };
};

export type WaterfallSpec = BaseSpec & {
  kind: "waterfall";
  encodings: {
    x: string; // categories/steps
    y: string; // change amount
  };
};

export type FunnelSpec = BaseSpec & {
  kind: "funnel";
  encodings: {
    stage: string;
    value: string;
  };
};

// --- DS Specs ---

export type ForecastSpec = BaseSpec & {
  kind: "forecast";
  encodings: {
    time: string;
    actual: string;
    forecast: string;
    lowerBound: string;
    upperBound: string;
  };
};

export type AnomalySpec = BaseSpec & {
  kind: "anomaly";
  encodings: {
    time: string;
    value: string;
    isAnomaly: string; // boolean field
  };
};

// --- AI Specs ---

export type InsightCardSpec = BaseSpec & {
  kind: "insight";
  encodings: {
    severity: string;
    summary: string;
    metric?: string;
    evidenceIds?: string; // comma separated or array
  };
};

export type RecommendationSpec = BaseSpec & {
  kind: "recommendation";
  encodings: {
    action: string;
    confidence: string; // 0-1
    impact: string;
    reason: string;
  };
};

export type ChartSpec =
  | MetricSpec
  | DeltaSpec
  | TargetSpec
  | SparklineSpec
  | SeveritySpec
  | ProgressSpec
  | LineSpec
  | BarSpec
  | ColumnSpec
  | AreaSpec
  | ComboSpec
  | PieSpec
  | DonutSpec
  | TableSpec
  | MatrixSpec
  | WaterfallSpec
  | FunnelSpec
  | ForecastSpec
  | AnomalySpec
  | InsightCardSpec
  | RecommendationSpec;
