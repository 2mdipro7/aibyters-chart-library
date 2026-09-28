import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ParetoChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Price source mismatch', value: 1842000 },
  { name: 'Late settlement', value: 1210000 },
  { name: 'Corporate action', value: 918000 },
  { name: 'FX rate timing', value: 655000 },
  { name: 'Missing trade', value: 402000 },
  { name: 'Duplicate booking', value: 318000 },
  { name: 'Fee accrual', value: 174000 },
  { name: 'Other', value: 96000 },
];

const codeExample = `import { ParetoChart } from "@aibyters/charts-bi";

<ParetoChart
  title="Break value by root cause"
  data={[
    { name: "Price source mismatch", value: 1842000 },
    { name: "Late settlement", value: 1210000 },
    // ...
  ]}
  barLabel="Break value"
  lineLabel="Cumulative %"
  threshold={80}
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number }[]", required: true, default: "-", description: "Unsorted categories (sorted internally)" },
  { name: 'barLabel / lineLabel', type: "string", required: false, default: "'Value' / 'Cumulative %'", description: "Legend labels" },
  { name: 'threshold', type: "number | null", required: false, default: "80", description: "Reference line percentage; null hides it" },
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

export default function ParetoChartPage() {
  return (
    <ChartPageLayout
      title="Pareto Chart"
      description="Bars sorted descending with a cumulative percentage line on a secondary axis and an 80% reference line."
      category="bi"
      code={codeExample}
    >
      <ParetoChart
        title="Break value by root cause"
        description="Which causes drive 80% of the unreconciled amount"
        data={data}
        barLabel="Break value"
        lineLabel="Cumulative %"
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
