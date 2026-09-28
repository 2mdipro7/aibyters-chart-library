import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { SlopeChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Global Equities', start: 42, end: 18 },
  { name: 'Fixed Income', start: 27, end: 31 },
  { name: 'EM Debt', start: 35, end: 12 },
  { name: 'Private Credit', start: 14, end: 15 },
  { name: 'Real Assets', start: 22, end: 9 },
  { name: 'Cash', start: 8, end: 3 },
  { name: 'Hedge FoF', start: 19, end: 24 },
];

const codeExample = `import { SlopeChart } from "@aibyters/charts-bi";

<SlopeChart
  title="Open breaks per mandate"
  data={[
    { name: "Global Equities", start: 42, end: 18 },
    { name: "Fixed Income", start: 27, end: 31 },
    // ...
  ]}
  startLabel="Aug"
  endLabel="Sep"
  colorBy="direction"
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; start: number; end: number }[]", required: true, default: "-", description: "One entity per row" },
  { name: 'startLabel / endLabel', type: "string", required: false, default: "'Before' / 'After'", description: "Column headings" },
  { name: 'colorBy', type: "'entity' | 'direction'", required: false, default: "'direction'", description: "Palette per entity, or positive/negative by direction" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Line click handler" },
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

export default function SlopeChartPage() {
  return (
    <ChartPageLayout
      title="Slope Chart"
      description="One line per entity between two periods with collision-resolved labels at both ends. Hover to highlight."
      category="bi"
      code={codeExample}
    >
      <SlopeChart
        title="Open breaks per mandate"
        description="August vs September month-end"
        data={data}
        startLabel="Aug"
        endLabel="Sep"
        valueFormatter={(v) => v.toLocaleString()}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
