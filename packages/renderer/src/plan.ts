import type { ChartSpec, DataFrame, FieldMeta, Primitive } from "@aibyters/spec";
import { axisFormatter, formatCell, type FormatOptions } from "./format";

/** Which component to draw and with what props. `warnings` say where the plan had to differ from the spec. */
export interface RenderPlan {
  component: string;
  props: Record<string, any>;
  warnings: string[];
}

export type PlanOptions = FormatOptions;

export interface TableColumn {
  key: string;
  header: string;
  align: "left" | "right";
  type: "text" | "number";
  render: (value: unknown) => string;
}

const SEVERITY: Record<string, "success" | "warning" | "critical" | "info"> = {
  positive: "success",
  success: "success",
  good: "success",
  warning: "warning",
  critical: "critical",
  danger: "critical",
  bad: "critical",
  info: "info",
};

const asList = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

function num(value: Primitive | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  return 0;
}

/** Props for a DataTable over the frame; `columns` restricts and orders the columns shown. */
export function tableProps(
  title: string,
  description: string | undefined,
  frame: DataFrame,
  options: FormatOptions,
  columns?: string[]
): { title: string; description?: string; data: Record<string, Primitive>[]; columns: TableColumn[] } {
  const fields = new Map(frame.fields.map((f) => [f.key, f]));
  const keys = columns ?? (frame.fields.length ? frame.fields.map((f) => f.key) : Object.keys(frame.rows[0] ?? {}));
  const first = frame.rows[0] ?? {};
  return {
    title,
    description,
    data: frame.rows,
    columns: keys.map((key) => {
      const field = fields.get(key);
      const numeric = field ? field.type === "number" : typeof first[key] === "number";
      return {
        key,
        header: field?.label ?? key,
        align: numeric ? "right" : "left",
        type: numeric ? "number" : "text",
        render: (value: unknown) => formatCell(value, field, options),
      };
    }),
  };
}

/**
 * Turn a spec and its data into a component name and props.
 *
 * Missing columns and kinds the renderer does not draw yet fall back to a table,
 * with the reason in `warnings`, so a bad spec still shows the data.
 */
export function planChart(spec: ChartSpec, frame: DataFrame, options: PlanOptions = {}): RenderPlan {
  const fmt: FormatOptions = {
    currencySymbol: options.currencySymbol ?? frame.meta?.currencySymbol ?? frame.meta?.currency,
    locale: options.locale ?? frame.meta?.locale,
  };
  const fields = new Map<string, FieldMeta>(frame.fields.map((f) => [f.key, f]));
  const rows = frame.rows;
  const first: Record<string, Primitive> = rows[0] ?? {};
  const warnings: string[] = [];
  const base = { title: spec.title, description: spec.description };

  const label = (key: string) => fields.get(key)?.label ?? key;
  const present = (key: string) => fields.has(key) || key in first;
  const cell = (key: string) => (value: unknown) => formatCell(value, fields.get(key), fmt);
  const axis = (keys: string[]) => axisFormatter(keys.map((k) => fields.get(k)), fmt);

  const table = (why?: string): RenderPlan => {
    if (why) warnings.push(why);
    return { component: "DataTable", props: tableProps(spec.title, spec.description, frame, fmt), warnings };
  };
  const have = (keys: string[]): boolean => {
    const missing = keys.filter((k) => !present(k));
    if (missing.length === 0) return true;
    warnings.push(`Column${missing.length > 1 ? "s" : ""} ${missing.join(", ")} not in the data; showing a table instead.`);
    return false;
  };

  switch (spec.kind) {
    case "metric": {
      const { value } = spec.encodings;
      if (!have([value])) return table();
      if (rows.length === 0) warnings.push("No rows came back; showing 0.");
      return { component: "MetricCard", props: { ...base, value: num(first[value]), valueFormatter: cell(value) }, warnings };
    }

    case "delta": {
      const { value, comparison } = spec.encodings;
      if (!have([value, comparison])) return table();
      const current = num(first[value]);
      const previous = num(first[comparison]);
      const delta = previous === 0 ? 0 : (current - previous) / Math.abs(previous);
      return {
        component: "DeltaCard",
        props: { ...base, value: current, delta, previousValue: previous, valueFormatter: cell(value), invertColors: spec.presentation?.invertColors },
        warnings,
      };
    }

    case "target": {
      const { value, target } = spec.encodings;
      if (!have([value, target])) return table();
      const current = num(first[value]);
      const goal = num(first[target]);
      return { component: "TargetCard", props: { ...base, value: current, target: goal, valueFormatter: cell(value) }, warnings };
    }

    case "sparkline": {
      const { time, value } = spec.encodings;
      if (!have([time, value])) return table();
      const series = rows.map((r) => num(r[value]));
      const last = series[series.length - 1] ?? 0;
      const previous = series[series.length - 2];
      const trend = previous === undefined || last === previous ? "neutral" : last > previous ? "up" : "down";
      return { component: "SparklineCard", props: { ...base, value: last, data: series, trend, valueFormatter: cell(value) }, warnings };
    }

    case "progress": {
      const { value, max } = spec.encodings;
      if (!have([value, max])) return table();
      return {
        component: "ProgressCard",
        props: { ...base, value: num(first[value]), max: num(first[max]) || 100, type: spec.presentation?.type ?? "linear", valueFormatter: cell(value) },
        warnings,
      };
    }

    case "severity": {
      const { status, message } = spec.encodings;
      if (!have([status, message])) return table();
      const level = SEVERITY[String(first[status] ?? "").toLowerCase()] ?? "info";
      return { component: "SeverityCard", props: { ...base, status: level, message: String(first[message] ?? "") }, warnings };
    }

    case "line":
    case "area": {
      const x = spec.encodings.x;
      const ys = asList(spec.encodings.y);
      if (ys.length === 0 || !have([x, ...ys])) return table();
      return {
        component: spec.kind === "line" ? "LineChart" : spec.presentation?.mode === "stacked" ? "StackedAreaChart" : "AreaChart",
        props: { ...base, data: rows, index: x, categories: ys, valueFormatter: axis(ys) },
        warnings,
      };
    }

    case "bar": {
      // In a bar spec x holds the measure(s) and y the dimension: bars run sideways
      const xs = asList(spec.encodings.x);
      const y = spec.encodings.y;
      if (xs.length === 0 || !have([y, ...xs])) return table();
      const component = spec.presentation?.orientation === "vertical" ? "ColumnChart" : "BarChart";
      return {
        component,
        props: { ...base, data: rows, index: y, categories: xs, stacked: spec.presentation?.mode === "stacked", valueFormatter: axis(xs) },
        warnings,
      };
    }

    case "column": {
      const x = spec.encodings.x;
      const ys = asList(spec.encodings.y);
      if (ys.length === 0 || !have([x, ...ys])) return table();
      return {
        component: "ColumnChart",
        props: { ...base, data: rows, index: x, categories: ys, stacked: spec.presentation?.mode === "stacked", valueFormatter: axis(ys) },
        warnings,
      };
    }

    case "combo": {
      const { x, yBar, yLine } = spec.encodings;
      if (!have([x, yBar, yLine])) return table();
      return {
        component: "ComboChart",
        props: { ...base, data: rows, index: x, barCategories: [yBar], lineCategories: [yLine], valueFormatter: axis([yBar, yLine]) },
        warnings,
      };
    }

    case "pie":
    case "donut": {
      const { name, value } = spec.encodings;
      if (!have([name, value])) return table();
      const props: Record<string, any> = { ...base, data: rows, dataKey: value, nameKey: name };
      if (spec.kind === "donut") {
        const total = rows.reduce((sum, r) => sum + num(r[value]), 0);
        props.centerValue = cell(value)(total);
        props.centerLabel = spec.presentation?.centerLabel ?? label(value);
      }
      return { component: spec.kind === "pie" ? "PieChart" : "DonutChart", props, warnings };
    }

    case "funnel": {
      const { stage, value } = spec.encodings;
      if (!have([stage, value])) return table();
      return { component: "FunnelChart", props: { ...base, data: rows, dataKey: value, nameKey: stage, valueFormatter: axis([value]) }, warnings };
    }

    case "waterfall": {
      const { x, y } = spec.encodings;
      if (!have([x, y])) return table();
      const data = rows.map((r) => ({ name: String(r[x] ?? ""), value: num(r[y]) }));
      return { component: "WaterfallChart", props: { ...base, data, valueFormatter: axis([y]) }, warnings };
    }

    case "ranked_bar":
    case "lollipop":
    case "pareto":
    case "waffle":
    case "diverging_bar":
    case "treemap": {
      const { name, value } = spec.encodings;
      if (!have([name, value])) return table();
      const data = rows.map((r) => ({ name: String(r[name] ?? ""), value: num(r[value]) }));
      const fmtValue = cell(value);
      const component = {
        ranked_bar: "RankedBarChart",
        lollipop: "LollipopChart",
        pareto: "ParetoChart",
        waffle: "WaffleChart",
        diverging_bar: "DivergingBarChart",
        treemap: "TreemapChart",
      }[spec.kind];
      const props: Record<string, any> = { ...base, data, valueFormatter: spec.kind === "waffle" || spec.kind === "treemap" ? fmtValue : axis([value]) };
      if (spec.kind === "ranked_bar") {
        props.valueFormatter = fmtValue; // each bar carries its full figure
        props.highlightTop = Math.min(3, data.length);
      }
      if (spec.kind === "pareto") props.barLabel = label(value);
      if ((spec.kind === "waffle" || spec.kind === "treemap") && data.some((d) => d.value < 0)) {
        warnings.push("Negative values cannot be shown as parts of a whole; they were left out.");
        props.data = data.filter((d) => d.value > 0);
      }
      return { component, props, warnings };
    }

    case "dumbbell": {
      const { name, a, b } = spec.encodings;
      if (!have([name, a, b])) return table();
      const data = rows.map((r) => ({ name: String(r[name] ?? ""), a: num(r[a]), b: num(r[b]) }));
      return { component: "DumbbellChart", props: { ...base, data, aLabel: label(a), bLabel: label(b), valueFormatter: axis([a, b]) }, warnings };
    }

    case "slope": {
      const { name, start, end } = spec.encodings;
      if (!have([name, start, end])) return table();
      const data = rows.map((r) => ({ name: String(r[name] ?? ""), start: num(r[start]), end: num(r[end]) }));
      return { component: "SlopeChart", props: { ...base, data, startLabel: label(start), endLabel: label(end), valueFormatter: axis([start, end]) }, warnings };
    }

    case "progress_rings": {
      const { name, value, max } = spec.encodings;
      if (!have([name, value, ...(max ? [max] : [])])) return table();
      const data = rows.map((r) => ({
        name: String(r[name] ?? ""),
        value: num(r[value]),
        ...(max ? { max: num(r[max]) } : {}),
        amount: cell(value)(r[value]),
      }));
      return { component: "ProgressRingGroup", props: { ...base, data, valueFormatter: cell(value) }, warnings };
    }

    case "gauge": {
      const { value, max, target } = spec.encodings;
      if (!have([value, ...(max ? [max] : []), ...(target ? [target] : [])])) return table();
      const props: Record<string, any> = { ...base, value: num(first[value]), valueFormatter: cell(value) };
      if (max) props.max = num(first[max]) || 100;
      else if (fields.get(value)?.format !== "percent" && num(first[value]) > 100) {
        warnings.push("No maximum was given for the dial; showing the figure instead.");
        return { component: "MetricCard", props: { ...base, value: num(first[value]), valueFormatter: cell(value) }, warnings };
      }
      if (target) props.target = num(first[target]);
      return { component: "GaugeChart", props, warnings };
    }

    case "table": {
      const wanted = spec.encodings.columns;
      const columns = wanted.filter(present);
      const dropped = wanted.filter((c) => !present(c));
      if (dropped.length) warnings.push(`Column${dropped.length > 1 ? "s" : ""} ${dropped.join(", ")} not in the data.`);
      return { component: "DataTable", props: tableProps(spec.title, spec.description, frame, fmt, columns.length ? columns : undefined), warnings };
    }

    case "insight": {
      const e = spec.encodings;
      if (!have([e.severity, e.summary])) return table();
      const severity = SEVERITY[String(first[e.severity] ?? "").toLowerCase()] ?? "info";
      const metric = e.metric && present(e.metric) ? e.metric : undefined;
      return {
        component: "InsightCard",
        props: {
          ...base,
          severity,
          summary: String(first[e.summary] ?? ""),
          metric: metric ? label(metric) : undefined,
          metricValue: metric ? cell(metric)(first[metric]) : undefined,
        },
        warnings,
      };
    }

    case "recommendation": {
      const e = spec.encodings;
      if (!have([e.action, e.confidence, e.impact, e.reason])) return table();
      const impact = String(first[e.impact] ?? "medium").toLowerCase();
      return {
        component: "RecommendationCard",
        props: {
          ...base,
          action: String(first[e.action] ?? ""),
          confidence: Math.max(0, Math.min(1, num(first[e.confidence]))),
          impact: impact === "high" || impact === "low" ? impact : "medium",
          reason: String(first[e.reason] ?? ""),
        },
        warnings,
      };
    }

    default:
      return table(`"${(spec as ChartSpec).kind}" charts are not drawn by the renderer yet; showing a table.`);
  }
}
