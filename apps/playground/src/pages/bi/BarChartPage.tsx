import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { BarChart } from '@aibyters/charts-bi';

const sampleData = [
  { product: 'Product A', Q1: 4000, Q2: 2400 },
  { product: 'Product B', Q1: 3000, Q2: 1398 },
  { product: 'Product C', Q1: 2000, Q2: 9800 },
  { product: 'Product D', Q1: 2780, Q2: 3908 },
];

const codeExample = `import { BarChart } from "@aibyters/charts-bi";

const data = [
  { product: 'Product A', Q1: 4000, Q2: 2400 },
  { product: 'Product B', Q1: 3000, Q2: 1398 },
  // ...
];

<BarChart
  title="Quarterly Sales by Product"
  description="Comparison of Q1 and Q2 sales"
  data={data}
  index="product"
  categories={['Q1', 'Q2']}
  stacked={true}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'Key mapping to the y-axis' },
  { name: 'categories', type: 'string[]', required: true, default: '-', description: 'Keys mapping to bar series' },
  { name: 'stacked', type: 'boolean', required: false, default: 'false', description: 'Whether to stack the bars' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Bar colors' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter for x-axis and tooltip' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function BarChartPage() {
  return (
    <ChartPageLayout title="Bar Chart" description="Used to compare quantities of different categories using horizontal bars." category="bi" code={codeExample}>
      <BarChart 
        title="Quarterly Sales by Product" 
        description="Comparison of Q1 and Q2 sales"
        data={sampleData} 
        index="product" 
        categories={['Q1', 'Q2']} 
        stacked={true}
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
