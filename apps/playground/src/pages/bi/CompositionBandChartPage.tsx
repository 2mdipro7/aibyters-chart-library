import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { CompositionBandChart } from '@aibyters/charts-bi';

const data = [
  { name: 'Equities', value: 4820000 },
  { name: 'Fixed income', value: 3110000 },
  { name: 'Alternatives', value: 1275000 },
  { name: 'Cash', value: 640000 },
  { name: 'Derivatives', value: 155000 },
];

const codeExample = `import { CompositionBandChart } from "@aibyters/charts-bi";

<CompositionBandChart
  title="Position mix"
  data={[
    { name: "Equities", value: 4820000 },
    { name: "Fixed income", value: 3110000 },
    { name: "Alternatives", value: 1275000 },
    { name: "Cash", value: 640000 },
    { name: "Derivatives", value: 155000 },
  ]}
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number }[]", required: true, default: "-", description: "Segments of the band" },
  { name: 'bandHeight', type: "number", required: false, default: "28", description: "Band thickness (px)" },
  { name: 'showKey', type: "boolean", required: false, default: "true", description: "Show the key grid under the band" },
  { name: 'percentDecimals', type: "number", required: false, default: "1", description: "Decimals in percentages" },
  { name: 'dataLabels', type: "boolean | DataLabelOptions", required: false, default: "auto", description: "In-segment labels only when they fit" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Segment / key click handler" },
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

export default function CompositionBandChartPage() {
  return (
    <ChartPageLayout
      title="Composition Band Chart"
      description="A single 100% stacked band with in-segment labels where they fit and a key grid (name, share, absolute) beneath."
      category="bi"
      code={codeExample}
    >
      <CompositionBandChart
        title="Position mix"
        description="Market value by instrument type, USD"
        data={data}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
