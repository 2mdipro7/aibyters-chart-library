import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { AreaChart } from '@aibyters/charts-bi';

const sampleData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 2000, profit: 9800 },
  { month: 'Apr', revenue: 2780, profit: 3908 },
  { month: 'May', revenue: 1890, profit: 4800 },
  { month: 'Jun', revenue: 2390, profit: 3800 },
];

const codeExample = `import { AreaChart } from "@aibyters/charts-bi";

const data = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  // ...
];

<AreaChart
  title="Revenue vs Profit"
  description="Monthly comparison showing volume"
  data={data}
  index="month"
  categories={['revenue', 'profit']}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'Key mapping to the x-axis' },
  { name: 'categories', type: 'string[]', required: true, default: '-', description: 'Keys mapping to area series' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Area colors' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter for y-axis and tooltip' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function AreaChartPage() {
  return (
    <ChartPageLayout title="Area Chart" description="Used to show trends and volume over time." category="bi" code={codeExample}>
      <AreaChart 
        title="Revenue vs Profit" 
        description="Monthly comparison showing volume"
        data={sampleData} 
        index="month" 
        categories={['revenue', 'profit']} 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
