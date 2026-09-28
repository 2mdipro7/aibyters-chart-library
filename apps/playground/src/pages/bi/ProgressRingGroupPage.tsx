import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ProgressRingGroup } from '@aibyters/charts-bi';

const data = [
  { name: 'Tier 1 · Core', value: 6120000, amount: '$6.12M' },
  { name: 'Tier 2 · Satellite', value: 2870000, amount: '$2.87M' },
  { name: 'Tier 3 · Tactical', value: 1340000, amount: '$1.34M' },
  { name: 'Tier 4 · Cash', value: 670000, amount: '$0.67M' },
];

const codeExample = `import { ProgressRingGroup } from "@aibyters/charts-bi";

<ProgressRingGroup
  title="AUM by tier"
  data={[
    { name: "Tier 1 · Core", value: 6120000, amount: "$6.12M" },
    { name: "Tier 2 · Satellite", value: 2870000, amount: "$2.87M" },
    { name: "Tier 3 · Tactical", value: 1340000, amount: "$1.34M" },
    { name: "Tier 4 · Cash", value: 670000, amount: "$0.67M" },
  ]}
/>`;

const propsData = [
  { name: 'data', type: "{ name: string; value: number; max?: number; amount?: string }[]", required: true, default: "-", description: "One ring per item; max defaults to the sum of values" },
  { name: 'ringSize', type: "number", required: false, default: "96", description: "Ring diameter (px) at desktop widths" },
  { name: 'strokeWidth', type: "number", required: false, default: "8", description: "Ring thickness (px)" },
  { name: 'onItemClick', type: "(item, index) => void", required: false, default: "-", description: "Rings become buttons when provided" },
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

export default function ProgressRingGroupPage() {
  return (
    <ChartPageLayout
      title="Progress Ring Group"
      description="A row of small circular progress rings showing each tier's share of the total, with name and amount beneath. Wraps on narrow widths."
      category="bi"
      code={codeExample}
    >
      <ProgressRingGroup
        title="AUM by tier"
        description="Share of total assets under reconciliation"
        data={data}
        onItemClick={(item) => console.log('tier', item)}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
