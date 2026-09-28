import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { StatusStripChart } from '@aibyters/charts-bi';

const data = [
  { label: 'Oct', status: 'Reconciled', count: 4 },
  { label: 'Nov', status: 'Reconciled', count: 2 },
  { label: 'Dec', status: 'Review', count: 17 },
  { label: 'Jan', status: 'Reconciled', count: 3 },
  { label: 'Feb', status: 'Breach', count: 42 },
  { label: 'Mar', status: 'Review', count: 11 },
  { label: 'Apr', status: 'Reconciled', count: 0 },
  { label: 'May', status: 'Reconciled', count: 1 },
  { label: 'Jun', status: 'Review', count: 9 },
  { label: 'Jul', status: 'Reconciled', count: 2 },
  { label: 'Aug', status: 'Breach', count: 27 },
  { label: 'Sep', status: 'Review', count: 12 },
];

const codeExample = `import { StatusStripChart } from "@aibyters/charts-bi";

<StatusStripChart
  title="Month-end reconciliation status"
  data={[
    { label: "Oct", status: "Reconciled", count: 4 },
    { label: "Dec", status: "Review", count: 17 },
    { label: "Feb", status: "Breach", count: 42 },
    // ...
  ]}
  statusColors={{ Reconciled: "var(--vi-color-positive-main)" }}
  selected="Sep"
  onCellClick={(cell) => selectMonth(cell.label)}
/>`;

const propsData = [
  { name: 'data', type: "{ label: string; status: string; count?: number }[]", required: true, default: "-", description: "One cell per item" },
  { name: 'statusColors', type: "Record<string, string>", required: false, default: "semantic / palette", description: "Colour per status key" },
  { name: 'selected', type: "string", required: false, default: "-", description: "Label of the outlined cell" },
  { name: 'countFormatter', type: "(n: number) => string", required: false, default: "toLocaleString", description: "Formats counts (never compact)" },
  { name: 'cellHeight', type: "number", required: false, default: "36", description: "Cell height (px); 44 on touch" },
  { name: 'onCellClick', type: "(item, index) => void", required: false, default: "-", description: "Cells become buttons when provided" },
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

export default function StatusStripChartPage() {
  return (
    <ChartPageLayout
      title="Status Strip Chart"
      description="Timeline-style strip of status cells (e.g. months), coloured by category with counts inside. Statuses form the legend."
      category="bi"
      code={codeExample}
    >
      <StatusStripChart
        title="Month-end reconciliation status"
        description="Trailing 12 months, open breaks at close"
        data={data}
        selected="Sep"
        onCellClick={(cell) => console.log('month', cell)}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
