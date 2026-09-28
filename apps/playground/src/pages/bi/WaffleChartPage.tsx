import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { WaffleChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Auto-matched', value: 8412 },
  { name: 'Matched with tolerance', value: 1207 },
  { name: 'Manually matched', value: 486 },
  { name: 'Open breaks', value: 295 },
];

const codeExample = `import { WaffleChart } from "@aibyters/charts-bi";

<WaffleChart
  title="Match status of 10,400 positions"
  data={[
    { name: "Auto-matched", value: 8412 },
    { name: "Matched with tolerance", value: 1207 },
    { name: "Manually matched", value: 486 },
    { name: "Open breaks", value: 295 },
  ]}
  valueFormatter={(v) => v.toLocaleString()}
  footer="Source: reconciliation engine"
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number }[]", required: true, default: "-", description: "Segments" },
  { name: 'columns / rows', type: "number", required: false, default: "10 / 10", description: "Grid size" },
  { name: 'total', type: "number", required: false, default: "sum of values", description: "Denominator; larger totals leave empty cells" },
  { name: 'cellGap', type: "number", required: false, default: "3", description: "Gap between cells (px)" },
  { name: 'maxCellSize', type: "number", required: false, default: "22", description: "Upper bound on cell size (px)" },
  { name: 'unitFormatter', type: "(v: number) => string", required: false, default: "valueFormatter", description: "Formats the '1 cell = X' footnote" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Cell click handler" },
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

export default function WaffleChartPage() {
  return (
    <ChartPageLayout
      title="Waffle Chart"
      description="A 10x10 unit grid where each cell represents an equal share of the total. Legend toggles recompute the shares."
      category="bi"
      code={codeExample}
    >
      <WaffleChart
        title="Match status of 10,400 positions"
        description="Month-end reconciliation, all custodians"
        data={data}
        valueFormatter={(v) => v.toLocaleString()}
        footer="Source: reconciliation engine, 30 Sep"
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
