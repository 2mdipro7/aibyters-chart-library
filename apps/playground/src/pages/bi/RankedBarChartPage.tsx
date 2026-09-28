import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { RankedBarChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Global Equities Fund', value: 1842300, meta: '18 accounts · 2 breaks' },
  { name: 'Fixed Income Core', value: 1210450, meta: '11 accounts · 0 breaks' },
  { name: 'Emerging Markets Debt', value: 918200, meta: '7 accounts · 5 breaks' },
  { name: 'Private Credit Sleeve', value: 655900, meta: '4 accounts · 1 break' },
  { name: 'Real Assets Portfolio', value: 402100, meta: '6 accounts · 3 breaks' },
  { name: 'Cash & Equivalents', value: 318750, meta: '22 accounts · 0 breaks' },
  { name: 'Hedge Fund of Funds', value: 274300, meta: '3 accounts · 4 breaks' },
  { name: 'Structured Products', value: 96400, meta: '2 accounts · 1 break' },
];

const codeExample = `import { RankedBarChart } from "@aibyters/charts-bi";

<RankedBarChart
  title="Unreconciled exposure by mandate"
  description="Absolute variance between custodian and portfolio system, USD"
  data={[
    { name: "Global Equities Fund", value: 1842300, meta: "18 accounts · 2 breaks" },
    { name: "Fixed Income Core", value: 1210450, meta: "11 accounts · 0 breaks" },
    // ...
  ]}
  highlightTop={3}
  maxRows={5}
  valueFormatter={(v) => "$" + v.toLocaleString()}
  onItemClick={(item) => openMandate(item.name)}
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number; meta?: string }[]", required: true, default: "-", description: "Rows to rank" },
  { name: 'highlightTop', type: "number", required: false, default: "0", description: "First N rows rendered bolder" },
  { name: 'maxRows', type: "number", required: false, default: "-", description: "Rows shown before the +N more toggle" },
  { name: 'sort', type: "'asc' | 'desc' | 'none'", required: false, default: "'desc'", description: "Sort order" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Rows become buttons when provided" },
  { name: 'barThickness', type: "number", required: false, default: "6", description: "Bar height in px" },
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

export default function RankedBarChartPage() {
  return (
    <ChartPageLayout
      title="Ranked Bar Chart"
      description="Ranked track-and-fill list with truncated labels, tabular values, optional meta line and a +N more toggle. Collapses to label-over-bar below 400px."
      category="bi"
      code={codeExample}
    >
      <RankedBarChart
        title="Unreconciled exposure by mandate"
        description="Absolute variance between custodian and portfolio system, USD"
        data={data}
        highlightTop={3}
        maxRows={5}
        valueFormatter={(v) => '$' + v.toLocaleString()}
        onItemClick={(item) => console.log('clicked', item)}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
