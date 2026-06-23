import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { ComboChart } from '@aibyters/charts-bi';

const sampleData = [
  { month: 'Jan', sales: 4000, target: 4500 },
  { month: 'Feb', sales: 3000, target: 3500 },
  { month: 'Mar', sales: 2000, target: 2500 },
  { month: 'Apr', sales: 2780, target: 3000 },
  { month: 'May', sales: 1890, target: 2000 },
  { month: 'Jun', sales: 2390, target: 2500 },
];

const codeExample = `import { ComboChart } from "@aibyters/charts-bi";

const data = [
  { month: 'Jan', sales: 4000, target: 4500 },
  { month: 'Feb', sales: 3000, target: 3500 },
  // ...
];

<ComboChart
  title="Sales vs Target"
  description="Monthly sales compared to target"
  data={data}
  index="month"
  barCategories={['sales']}
  lineCategories={['target']}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'Key mapping to the x-axis' },
  { name: 'barCategories', type: 'string[]', required: true, default: '-', description: 'Keys mapping to column series' },
  { name: 'lineCategories', type: 'string[]', required: true, default: '-', description: 'Keys mapping to line series' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Chart colors' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter for y-axis and tooltip' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function ComboChartPage() {
  return (
    <ChartPageLayout title="Combo Chart" description="Used to combine column and line charts to compare multiple categories." category="bi" code={codeExample}>
      <ComboChart 
        title="Sales vs Target" 
        description="Monthly sales compared to target"
        data={sampleData} 
        index="month" 
        barCategories={['sales']}
        lineCategories={['target']}
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
