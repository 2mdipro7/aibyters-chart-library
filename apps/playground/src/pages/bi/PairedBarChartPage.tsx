import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { PairedBarChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Global Equities Fund', a: 18420000, b: 18395000, meta: 'Custody: UBS' },
  { name: 'Fixed Income Core', a: 12104000, b: 12104000, meta: 'Custody: BNY' },
  { name: 'EM Debt', a: 9182000, b: 9410000, meta: 'Custody: Citi' },
  { name: 'Private Credit', a: 6559000, b: 6320000, meta: 'Custody: State Street' },
  { name: 'Real Assets', a: 4021000, b: 4105000, meta: 'Custody: UBS' },
];

const codeExample = `import { PairedBarChart } from "@aibyters/charts-bi";

<PairedBarChart
  title="Custodian vs portfolio system"
  data={[
    { name: "Global Equities Fund", a: 18420000, b: 18395000, meta: "Custody: UBS" },
    { name: "EM Debt", a: 9182000, b: 9410000, meta: "Custody: Citi" },
    // ...
  ]}
  aLabel="Custodian"
  bLabel="Portfolio system"
  onItemClick={(item) => openBreak(item.name)}
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; a: number; b: number; meta?: string }[]", required: true, default: "-", description: "Row values" },
  { name: 'aLabel / bLabel', type: "string", required: false, default: "'A' / 'B'", description: "Legend labels" },
  { name: 'deltaFormatter', type: "(delta, item) => string", required: false, default: "signed valueFormatter", description: "Formats the delta (a - b)" },
  { name: 'sort', type: "'asc' | 'desc' | 'none'", required: false, default: "'none'", description: "Sort by absolute delta" },
  { name: 'barThickness', type: "number", required: false, default: "6", description: "Bar height (px)" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Rows become buttons when provided" },
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

export default function PairedBarChartPage() {
  return (
    <ChartPageLayout
      title="Paired Bar Chart"
      description="For each row, two thin bars (source A over source B) and the delta at right, colour-coded by sign."
      category="bi"
      code={codeExample}
    >
      <PairedBarChart
        title="Custodian vs portfolio system"
        description="Market value per mandate and the resulting break, USD"
        data={data}
        aLabel="Custodian"
        bLabel="Portfolio system"
        sort="desc"
        onItemClick={(item) => console.log('row', item)}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
