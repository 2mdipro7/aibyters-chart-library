import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { DumbbellChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Global Equities Fund', a: 18420000, b: 18395000 },
  { name: 'Fixed Income Core', a: 12104000, b: 12104000 },
  { name: 'EM Debt', a: 9182000, b: 9410000 },
  { name: 'Private Credit', a: 6559000, b: 6320000 },
  { name: 'Real Assets', a: 4021000, b: 4105000 },
  { name: 'Cash', a: 3187000, b: 3187000 },
];

const codeExample = `import { DumbbellChart } from "@aibyters/charts-bi";

<DumbbellChart
  title="Custodian vs portfolio system NAV"
  data={[
    { name: "Global Equities Fund", a: 18420000, b: 18395000 },
    { name: "EM Debt", a: 9182000, b: 9410000 },
    // ...
  ]}
  aLabel="Custodian"
  bLabel="Portfolio system"
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; a: number; b: number }[]", required: true, default: "-", description: "Two values per category" },
  { name: 'aLabel / bLabel', type: "string", required: false, default: "'A' / 'B'", description: "Legend labels" },
  { name: 'sort', type: "'asc' | 'desc' | 'none'", required: false, default: "'none'", description: "Sort by gap (b - a)" },
  { name: 'dataLabels', type: "boolean | DataLabelOptions", required: false, default: "auto", description: "End labels only when they fit" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Row click handler" },
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

export default function DumbbellChartPage() {
  return (
    <ChartPageLayout
      title="Dumbbell Chart"
      description="Two dots per category connected by a line, to compare two sources or periods. End labels appear only where they fit."
      category="bi"
      code={codeExample}
    >
      <DumbbellChart
        title="Custodian vs portfolio system NAV"
        description="Net asset value per mandate, USD"
        data={data}
        aLabel="Custodian"
        bLabel="Portfolio system"
        sort="desc"
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
