import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { MetricStrip } from '@aibyters/charts-kpi';

const items = [
  { label: 'Positions reconciled', value: 10105, format: 'count' as const, delta: 0.021, sub: 'of 10,400 total' },
  { label: 'Open breaks', value: 295, format: 'count' as const, delta: -0.184, tone: 'warning' as const, sub: 'vs. 361 last month' },
  { label: 'Unreconciled value', value: 5617000, format: 'currency' as const, delta: -0.093, tone: 'negative' as const, sub: 'absolute variance' },
  { label: 'Match rate', value: 0.9716, format: 'percent' as const, delta: 0.004, tone: 'positive' as const },
  { label: 'Avg. age of break', value: '3.4 days', delta: -0.12, sub: 'target < 5 days' },
];

const codeExample = `import { MetricStrip } from "@aibyters/charts-kpi";

<MetricStrip
  title="Reconciliation summary"
  items={[
    { label: "Positions reconciled", value: 10105, format: "count", delta: 0.021, sub: "of 10,400 total" },
    { label: "Open breaks", value: 295, format: "count", delta: -0.184, tone: "warning" },
    { label: "Unreconciled value", value: 5617000, format: "currency", delta: -0.093, tone: "negative" },
    { label: "Match rate", value: 0.9716, format: "percent", delta: 0.004, tone: "positive" },
  ]}
/>`;

const propsData = [
  { name: 'items', type: "MetricStripItem[]", required: true, default: "-", description: "{ label, value, sub?, delta?, format?, tone?, id? }" },
  { name: 'minTileWidth', type: "number", required: false, default: "150", description: "Minimum tile width for the auto-fit grid" },
  { name: 'currency', type: "string", required: false, default: "'USD'", description: "Currency code for format: 'currency'" },
  { name: 'countFormatter', type: "(n: number) => string", required: false, default: "toLocaleString", description: "Formats format: 'count' values (never compact)" },
  { name: 'deltaFormatter', type: "(delta: number) => string", required: false, default: "formatDelta", description: "Formats the delta fraction (0.12 = +12%)" },
  { name: 'showDelta', type: "boolean", required: false, default: "true", description: "Hide delta indicators" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Tiles become buttons when provided" },
  { name: 'title', type: "string", required: true, default: "-", description: "Chart heading" },
  { name: 'description', type: "string", required: false, default: "-", description: "Optional subtitle" },
  { name: 'loading / error / emptyMessage', type: "boolean / string / string", required: false, default: "-", description: "Shared loading, error and empty states" },
  { name: 'variant', type: "'card' | 'plain'", required: false, default: "'card'", description: "Render without card chrome" },
  { name: 'exportData', type: "Record<string, any>[]", required: false, default: "data", description: "Rows for the CSV / Excel export menu" },
];

export default function MetricStripPage() {
  return (
    <ChartPageLayout
      title="Metric Strip"
      description="A responsive row of KPI tiles in one card: kicker label, tabular value, delta and sub line. Tiles flow with an auto-fit grid."
      category="kpi"
      code={codeExample}
    >
      <MetricStrip
        title="Reconciliation summary"
        description="Month-end close, all custodians"
        items={items}
        onItemClick={(item) => console.log('kpi', item)}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
