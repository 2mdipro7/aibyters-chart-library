import { useEffect, useMemo, useState } from "react";
import { makeFormatter } from "@aibyters/spec";
import {
  LineChart, AreaChart, StackedAreaChart, ColumnChart, BarChart, ComboChart, PieChart, DonutChart, RadarChart, RadialBarChart,
  ScatterChart, TreemapChart, FunnelChart, WaterfallChart, GaugeChart, BulletChart, ParetoChart, RankedBarChart, DivergingBarChart,
  WaffleChart, CompositionBandChart, StatusStripChart, ProgressRingGroup, PairedBarChart, DumbbellChart, LollipopChart, SlopeChart, DataTable,
} from "@aibyters/charts-bi";
import { HeatmapChart, HistogramChart } from "@aibyters/charts-ds";
import { MetricCard, DeltaCard, TargetCard, SparklineCard, ProgressCard, MetricStrip } from "@aibyters/charts-kpi";
import type { FrappeClient } from "./api";
import { dashboardChartToSeries, listToDataFrame, pivotLong, reportToDataFrame } from "./data";
import type { DataSource, WidgetSpec } from "./spec";

export interface ResolvedData {
  rows: Record<string, any>[];
  /** Series keys when the source was pivoted / came from a Dashboard Chart. */
  categories?: string[];
  index?: string;
  /** Scalar result (Number Card). */
  value?: number;
  fields?: { key: string; label: string; type: string }[];
}

/** Fetches a source and normalises it into rows the widget renderers understand. */
export async function resolveSource(client: FrappeClient, source: DataSource, globalFilters: Record<string, any> = {}): Promise<ResolvedData> {
  switch (source.kind) {
    case "static":
      return { rows: source.rows };
    case "report": {
      const res = await client.runReport(source.name, { ...globalFilters, ...(source.filters ?? {}) });
      const df = reportToDataFrame(res, source.name);
      return { rows: df.rows as any, fields: df.fields };
    }
    case "list": {
      const rows = await client.getList(source.doctype, { fields: source.fields ?? ["*"], filters: mergeFilters(source.filters, globalFilters), order_by: source.order_by, limit_page_length: source.limit ?? 500, group_by: source.group_by });
      const df = listToDataFrame(rows, source.doctype);
      return { rows, fields: df.fields };
    }
    case "dashboard_chart": {
      const d = await client.getDashboardChart(source.name, Object.keys(globalFilters).length ? { filters: globalFilters } : {});
      const s = dashboardChartToSeries(d);
      return { rows: s.data, categories: s.categories, index: s.index };
    }
    case "number_card": {
      const v = await client.getNumberCard(source.name);
      return { rows: [], value: typeof v === "number" ? v : Number(v?.value ?? v) };
    }
    case "method": {
      const res = await client.call(source.method, { ...(source.args ?? {}), ...(Object.keys(globalFilters).length ? { filters: globalFilters } : {}) });
      if (Array.isArray(res)) return { rows: res };
      if (res && Array.isArray(res.result) && res.columns) {
        const df = reportToDataFrame(res, source.method);
        return { rows: df.rows as any, fields: df.fields };
      }
      if (res && Array.isArray(res.labels) && Array.isArray(res.datasets)) {
        const s = dashboardChartToSeries(res);
        return { rows: s.data, categories: s.categories, index: s.index };
      }
      if (typeof res === "number") return { rows: [], value: res };
      return { rows: res?.rows ?? [], value: res?.value, categories: res?.categories, index: res?.index };
    }
    case "query": {
      const res = await client.query({ ...source, filters: mergeFilters(source.filters, globalFilters) });
      if (source.series && source.dimension && source.measure) {
        const p = pivotLong(res.rows ?? [], source.dimension, source.series, "value");
        return { rows: p.data, categories: p.categories, index: p.index };
      }
      return { rows: res.rows ?? [], value: res.value, index: source.dimension };
    }
  }
}

function mergeFilters(a: any, b: Record<string, any>) {
  if (!a) return b;
  if (Array.isArray(a)) return [...a, ...Object.entries(b).map(([k, v]) => [k, "=", v])];
  return { ...a, ...b };
}

export interface WidgetRendererProps {
  spec: WidgetSpec;
  client: FrappeClient;
  globalFilters?: Record<string, any>;
  /** Called when a mark is clicked; the dashboard uses it for drilldowns. */
  onDrill?: (spec: WidgetSpec, datum: any) => void;
}

export function WidgetRenderer({ spec, client, globalFilters = {}, onDrill }: WidgetRendererProps) {
  const [state, setState] = useState<{ loading: boolean; error?: string; data?: ResolvedData }>({ loading: true });
  const filtersKey = JSON.stringify(globalFilters);
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      setState((s) => ({ ...s, loading: !s.data }));
      resolveSource(client, spec.source, globalFilters)
        .then((data) => !cancelled && setState({ loading: false, data }))
        .catch((e) => !cancelled && setState({ loading: false, error: e?.message ?? String(e) }));
    };
    load();
    const t = spec.refresh > 0 ? setInterval(load, spec.refresh * 1000) : undefined;
    return () => {
      cancelled = true;
      if (t) clearInterval(t);
    };
  }, [client, spec, filtersKey]);

  const fmt = useMemo(() => (spec.format ? makeFormatter(spec.format, { currency: spec.currency }) : undefined), [spec.format, spec.currency]);
  const e = spec.encodings;
  const d = state.data ?? { rows: [] };
  const rows = d.rows;
  const index = e.index ?? d.index ?? firstOfType(d, "string") ?? "name";
  const categories: string[] = e.categories ?? d.categories ?? numericKeys(d, index);
  // A single generic series ("value") gets the widget title as its label and no legend.
  const single = categories.length === 1 && ["line", "area", "stacked_area", "column", "bar", "radar"].includes(spec.type);
  const seriesLabels = e.seriesLabels ?? (single && categories[0] === "value" ? { value: spec.title } : undefined);
  const common = { title: spec.title, description: spec.description, loading: state.loading, error: state.error, valueFormatter: fmt, ...(single ? { legend: false, seriesLabels } : { seriesLabels }), ...spec.options };
  const dataKey = e.dataKey ?? e.value ?? categories[0] ?? "value";
  const nameKey = e.nameKey ?? e.label ?? index;
  const click = onDrill ? (datum: any) => onDrill(spec, datum) : undefined;
  const scalar = (key?: string) => (d.value !== undefined ? d.value : rows.length ? Number(rows[rows.length - 1]?.[key ?? dataKey]) : 0);
  const named = () => rows.map((r) => ({ name: String(r[nameKey]), value: Number(r[dataKey]) || 0, meta: e.meta ? String(r[e.meta] ?? "") : undefined }));

  switch (spec.type) {
    case "metric": return <MetricCard {...common} value={scalar()} format={spec.format as any} currency={spec.currency} />;
    case "delta": return <DeltaCard {...common} value={scalar()} delta={rows.length ? Number(rows[rows.length - 1]?.[e.delta ?? "delta"]) || 0 : 0} format={spec.format as any} currency={spec.currency} />;
    case "target": return <TargetCard {...common} value={scalar()} target={Number(rows[0]?.[e.target ?? "target"]) || Number(spec.options.target) || 0} format={spec.format as any} currency={spec.currency} />;
    case "sparkline": return <SparklineCard {...common} value={scalar()} data={rows.map((r) => Number(r[dataKey]) || 0)} format={spec.format as any} currency={spec.currency} />;
    case "progress": return <ProgressCard {...common} value={scalar()} max={Number(rows[0]?.[e.max ?? "max"]) || Number(spec.options.max) || 100} />;
    case "metric_strip": return <MetricStrip {...common} items={rows.map((r) => ({ label: String(r[nameKey]), value: Number(r[dataKey]) || 0, delta: e.delta ? Number(r[e.delta]) : typeof r.delta === "number" ? r.delta : undefined, format: (r.format ?? spec.format ?? "number") as any, sub: e.sub ? String(r[e.sub] ?? "") : r.sub, tone: r.tone }))} />;
    case "line": return <LineChart {...common} data={rows} index={index} categories={categories} onPointClick={click} />;
    case "area": return <AreaChart {...common} data={rows} index={index} categories={categories} />;
    case "stacked_area": return <StackedAreaChart {...common} data={rows} index={index} categories={categories} />;
    case "column": return <ColumnChart {...common} data={rows} index={index} categories={categories} onBarClick={click} />;
    case "bar": return <BarChart {...common} data={rows} index={index} categories={categories} onBarClick={click} />;
    case "combo": return <ComboChart {...common} data={rows} index={index} barCategories={e.barCategories ?? categories.slice(0, -1)} lineCategories={e.lineCategories ?? categories.slice(-1)} />;
    case "pie": return <PieChart {...common} data={rows} dataKey={dataKey} nameKey={nameKey} onSliceClick={click} />;
    case "donut": return <DonutChart {...common} data={rows} dataKey={dataKey} nameKey={nameKey} onSliceClick={click} />;
    case "radar": return <RadarChart {...common} data={rows} index={index} categories={categories} />;
    case "radial_bar": return <RadialBarChart {...common} data={rows} dataKey={dataKey} nameKey={nameKey} />;
    case "scatter": return <ScatterChart {...common} data={rows} xKey={e.x ?? categories[0]} yKey={e.y ?? categories[1]} sizeKey={e.size} groupKey={e.group} nameKey={e.nameKey} onPointClick={click} />;
    case "treemap": return <TreemapChart {...common} data={named()} />;
    case "funnel": return <FunnelChart {...common} data={rows} dataKey={dataKey} nameKey={nameKey} onStageClick={click} />;
    case "waterfall": return <WaterfallChart {...common} data={named().map((n) => ({ name: n.name, value: n.value }))} />;
    case "gauge": return <GaugeChart {...common} value={scalar()} min={spec.options.min} max={spec.options.max ?? 100} />;
    case "bullet": return <BulletChart {...common} rows={rows.map((r) => ({ label: String(r[nameKey]), actual: Number(r[e.actual ?? dataKey]) || 0, target: Number(r[e.target ?? "target"]) || 0, ranges: e.ranges ? e.ranges.map((k: string) => Number(r[k]) || 0) : undefined }))} />;
    case "pareto": return <ParetoChart {...common} data={named()} />;
    case "ranked_bar": return <RankedBarChart {...common} data={named()} onItemClick={click} />;
    case "diverging_bar": return <DivergingBarChart {...common} data={named()} onItemClick={click} />;
    case "waffle": return <WaffleChart {...common} data={named()} />;
    case "composition_band": return <CompositionBandChart {...common} data={named()} />;
    case "status_strip": return <StatusStripChart {...common} data={rows.map((r) => ({ label: String(r[nameKey]), status: String(r[e.status ?? "status"]), count: e.count ? Number(r[e.count]) : undefined }))} onCellClick={click} />;
    case "progress_rings": return <ProgressRingGroup {...common} data={rows.map((r) => ({ name: String(r[nameKey]), value: Number(r[dataKey]) || 0, max: e.max ? Number(r[e.max]) : undefined, amount: e.amount ? String(r[e.amount]) : undefined }))} />;
    case "paired_bar": return <PairedBarChart {...common} data={rows.map((r) => ({ name: String(r[nameKey]), a: Number(r[e.a ?? categories[0]]) || 0, b: Number(r[e.b ?? categories[1]]) || 0 }))} aLabel={e.aLabel ?? e.a} bLabel={e.bLabel ?? e.b} onItemClick={click} />;
    case "dumbbell": return <DumbbellChart {...common} data={rows.map((r) => ({ name: String(r[nameKey]), a: Number(r[e.a ?? categories[0]]) || 0, b: Number(r[e.b ?? categories[1]]) || 0 }))} aLabel={e.aLabel ?? e.a} bLabel={e.bLabel ?? e.b} />;
    case "lollipop": return <LollipopChart {...common} data={named()} />;
    case "slope": return <SlopeChart {...common} data={rows.map((r) => ({ name: String(r[nameKey]), start: Number(r[e.start ?? categories[0]]) || 0, end: Number(r[e.end ?? categories[1]]) || 0 }))} />;
    case "heatmap": return <HeatmapChart {...common} data={rows.map((r) => ({ x: String(r[e.x ?? "x"]), y: String(r[e.y ?? "y"]), value: Number(r[dataKey]) || 0 }))} />;
    case "histogram": return <HistogramChart {...common} data={rows.map((r) => Number(r[dataKey])).filter(Number.isFinite)} />;
    case "table":
    default:
      return <DataTable {...common} data={rows} columns={(e.columns as any[] | undefined) ?? (d.fields ?? Object.keys(rows[0] ?? {}).map((k) => ({ key: k, label: k, type: "string" }))).map((f: any) => ({ key: f.key, header: f.label, type: f.type === "number" ? "number" : f.type === "date" ? "date" : "text", format: f.type === "number" && fmt ? (v: any) => fmt(Number(v)) : undefined }))} pageSize={spec.options.pageSize ?? 10} onRowClick={click} />;
  }
}

function firstOfType(d: ResolvedData, type: string): string | undefined {
  return d.fields?.find((f) => f.type === type)?.key ?? (d.rows[0] ? Object.keys(d.rows[0]).find((k) => typeof d.rows[0][k] === "string") : undefined);
}
function numericKeys(d: ResolvedData, index: string): string[] {
  if (d.fields) return d.fields.filter((f) => f.type === "number" && f.key !== index).map((f) => f.key);
  const r = d.rows[0] ?? {};
  return Object.keys(r).filter((k) => k !== index && typeof r[k] === "number");
}
