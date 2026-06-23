import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { FunnelChart } from '@aibyters/charts-bi';

const sampleData = [
  { step: 'Website Visits', count: 100000 },
  { step: 'Sign Ups', count: 50000 },
  { step: 'Product Views', count: 25000 },
  { step: 'Add to Cart', count: 10000 },
  { step: 'Purchases', count: 5000 },
];

const codeExample = `import { FunnelChart } from "@aibyters/charts-bi";

const data = [
  { step: 'Website Visits', count: 100000 },
  { step: 'Sign Ups', count: 50000 },
  // ...
];

<FunnelChart
  title="Conversion Funnel"
  description="User journey from visit to purchase"
  data={data}
  dataKey="count"
  nameKey="step"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'dataKey', type: 'string', required: true, default: '-', description: 'Key mapping to the value' },
  { name: 'nameKey', type: 'string', required: true, default: '-', description: 'Key mapping to the stage name' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Funnel colors' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter for values' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function FunnelChartPage() {
  return (
    <ChartPageLayout title="Funnel Chart" description="Used to visualize stages in a sales process or user journey." category="bi" code={codeExample}>
      <FunnelChart 
        title="Conversion Funnel" 
        description="User journey from visit to purchase"
        data={sampleData} 
        dataKey="count" 
        nameKey="step" 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
