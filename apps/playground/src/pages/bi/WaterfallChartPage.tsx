import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { WaterfallChart } from '@aibyters/charts-bi';
import { formatCurrency } from '@aibyters/spec';

const sampleData = [
  { name: 'Starting Revenue', value: 100000 },
  { name: 'New Customers', value: 25000 },
  { name: 'Upsells', value: 15000 },
  { name: 'Churn', value: -10000 },
  { name: 'Downgrades', value: -5000 },
  { name: 'Total', value: 125000 },
];

const codeExample = `import { WaterfallChart } from "@aibyters/charts-bi";
import { formatCurrency } from "@aibyters/spec";

const data = [
  { name: 'Starting Revenue', value: 100000 },
  { name: 'New Customers', value: 25000 },
  { name: 'Upsells', value: 15000 },
  { name: 'Churn', value: -10000 },
  { name: 'Downgrades', value: -5000 },
  { name: 'Total', value: 125000 },
];

<WaterfallChart
  title="Monthly ARR Changes"
  description="Breakdown of ARR movements"
  data={data}
  valueFormatter={formatCurrency}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'Array<{name: string, value: number}>', required: true, default: '-', description: 'Array of data objects' },
  { name: 'colors', type: '{increase: string, decrease: string, total: string}', required: false, default: '-', description: 'Colors for bars' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter for values' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function WaterfallChartPage() {
  return (
    <ChartPageLayout title="Waterfall Chart" description="Used to show incremental positive/negative contributions to a running total." category="bi" code={codeExample}>
      <WaterfallChart 
        title="Monthly ARR Changes" 
        description="Breakdown of ARR movements"
        data={sampleData} 
        valueFormatter={formatCurrency}
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
