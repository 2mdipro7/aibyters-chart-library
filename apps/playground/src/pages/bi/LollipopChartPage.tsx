import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { LollipopChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Price source mismatch', value: 148 },
  { name: 'Late settlement', value: 96 },
  { name: 'Corporate action', value: 71 },
  { name: 'FX rate timing', value: 54 },
  { name: 'Missing trade', value: 33 },
  { name: 'Duplicate booking', value: 19 },
  { name: 'Fee accrual', value: 12 },
];

const codeExample = `import { LollipopChart } from "@aibyters/charts-bi";

<LollipopChart
  title="Open breaks by root cause"
  data={[
    { name: "Price source mismatch", value: 148 },
    { name: "Late settlement", value: 96 },
    // ...
  ]}
  orientation="horizontal"
  sort="desc"
  valueFormatter={(v) => v.toLocaleString()}
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number }[]", required: true, default: "-", description: "Categories" },
  { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: "Stem direction" },
  { name: 'sort', type: "'asc' | 'desc' | 'none'", required: false, default: "'desc'", description: "Sort order" },
  { name: 'dataLabels', type: "boolean | DataLabelOptions", required: false, default: "auto", description: "Head labels only when they fit" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Click handler" },
  { name: 'title', type: "string", required: true, default: "-", description: "Chart heading" },
  { name: 'description', type: "string", required: false, default: "-", description: "Optional subtitle" },
  { name: 'height', type: "number | 'auto'", required: false, default: "fits content", description: "Plot height in px; legend is added outside" },
  { name: 'legend', type: "boolean | LegendOptions", required: false, default: "true", description: "HTML legend outside the plot; click to toggle series" },
  { name: 'colors', type: "string[]", required: false, default: "theme palette", description: "Series colours (CSS values)" },
  { name: 'valueFormatter', type: "(v: number) => string", required: false, default: "formatCompactNumber", description: "Formats values in labels and tooltips" },
  { name: 'loading / error / emptyMessage', type: "boolean / string / string", required: false, default: "-", description: "Shared loading, error and empty states" },
  { name: 'variant', type: "'card' | 'plain'", required: false, default: "'card'", description: "Render without card chrome" },
  { name: 'exportData', type: "Record<string, any>[]", required: false, default: "data", description: "Rows for the CSV / Excel export menu" },
  { name: 'animate', type: "boolean", required: false, default: "true", description: "Disable mount animations (SSR / PDF)" },
];

export default function LollipopChartPage() {
  return (
    <ChartPageLayout
      title="Lollipop Chart"
      description="Thin stem with a circle head, ranked. Horizontal by default; vertical orientation rotates category labels when needed."
      category="bi"
      code={codeExample}
    >
      <LollipopChart
        title="Open breaks by root cause"
        description="Count of unresolved exceptions"
        data={data}
        valueFormatter={(v) => v.toLocaleString()}
      />
      <div style={{ height: 24 }} />
      <LollipopChart
        title="Open breaks by root cause (vertical)"
        data={data}
        orientation="vertical"
        valueFormatter={(v) => v.toLocaleString()}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
