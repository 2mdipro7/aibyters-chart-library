import React, { useEffect, useMemo } from "react";
import type { ChartSpec, DataFrame } from "@aibyters/spec";
import { DeltaCard, MetricCard, ProgressCard, SeverityCard, SparklineCard, TargetCard } from "@aibyters/charts-kpi";
import {
  AreaChart,
  BarChart,
  ColumnChart,
  ComboChart,
  DataTable,
  DonutChart,
  FunnelChart,
  LineChart,
  PieChart,
  WaterfallChart,
} from "@aibyters/charts-bi";
import { InsightCard, RecommendationCard } from "@aibyters/charts-ai";
import { planChart, type PlanOptions, type RenderPlan } from "./plan";

/** Components a plan may name. Hosts can add their own with registerComponent. */
export const components: Record<string, React.ComponentType<any>> = {
  MetricCard,
  DeltaCard,
  TargetCard,
  SparklineCard,
  ProgressCard,
  SeverityCard,
  LineChart,
  AreaChart,
  BarChart,
  ColumnChart,
  ComboChart,
  PieChart,
  DonutChart,
  DataTable,
  FunnelChart,
  WaterfallChart,
  InsightCard,
  RecommendationCard,
};

export function registerComponent(name: string, component: React.ComponentType<any>): void {
  components[name] = component;
}

export interface SpecChartProps extends PlanOptions {
  spec: ChartSpec;
  frame: DataFrame;
  className?: string;
  /** Receives the plan each time it is computed; check `warnings` to tell the user what changed. */
  onPlan?: (plan: RenderPlan) => void;
}

/** Draws a ChartSpec over a DataFrame with the matching AI Byters component. */
export function SpecChart({ spec, frame, className, onPlan, currencySymbol, locale }: SpecChartProps) {
  const plan = useMemo(() => planChart(spec, frame, { currencySymbol, locale }), [spec, frame, currencySymbol, locale]);

  useEffect(() => {
    onPlan?.(plan);
  }, [plan, onPlan]);

  const Component = components[plan.component];
  if (!Component) return null;
  return <Component {...plan.props} className={className} />;
}
