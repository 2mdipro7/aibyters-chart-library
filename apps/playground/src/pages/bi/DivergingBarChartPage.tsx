import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { DivergingBarChart } from '@aibyters/charts-bi';

const data = [
  { name: 'US Large Cap', value: 412500 },
  { name: 'European Equities', value: -188200 },
  { name: 'Investment Grade Credit', value: 96400 },
  { name: 'High Yield', value: -245900 },
  { name: 'Sovereign Bonds', value: 31200 },
  { name: 'Commodities', value: -58700 },
  { name: 'FX Forwards', value: 302100 },
  { name: 'Money Market', value: -12400 },
];

const codeExample = `import { DivergingBarChart } from "@aibyters/charts-bi";

<DivergingBarChart
  title="Valuation differences by asset class"
  data={[
    { name: "US Large Cap", value: 412500 },
    { name: "European Equities", value: -188200 },
    // ...
  ]}
  negativeLabel="Portfolio system higher"
  positiveLabel="Custodian higher"
  sort="desc"
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number }[]", required: true, default: "-", description: "Signed values" },
  { name: 'negativeLabel / positiveLabel', type: "string", required: false, default: "'Negative' / 'Positive'", description: "Legend labels for each side" },
  { name: 'sort', type: "'asc' | 'desc' | 'none'", required: false, default: "'none'", description: "Sort by value" },
  { name: 'dataLabels', type: "boolean | DataLabelOptions", required: false, default: "auto", description: "Value labels drawn only when they fit" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Bar click handler" },
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

export default function DivergingBarChartPage() {
  return (
    <ChartPageLayout
      title="Diverging Bar Chart"
      description="Two-sided bars around a zero axis. Negative values run left, positive run right; labels appear only where they fit."
      category="bi"
      code={codeExample}
    >
      <DivergingBarChart
        title="Valuation differences by asset class"
        description="Positive = custodian higher, negative = portfolio system higher (USD)"
        data={data}
        negativeLabel="Portfolio system higher"
        positiveLabel="Custodian higher"
        sort="desc"
        valueFormatter={(v) => (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString()}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
