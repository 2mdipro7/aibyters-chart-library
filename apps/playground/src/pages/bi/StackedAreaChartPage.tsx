import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { StackedAreaChart } from '@aibyters/charts-bi';
import { formatCompactNumber } from '@aibyters/spec';

const sampleData = [
  { month: 'Jan', 'Product A': 4000, 'Product B': 2400, 'Product C': 2400 },
  { month: 'Feb', 'Product A': 3000, 'Product B': 1398, 'Product C': 2210 },
  { month: 'Mar', 'Product A': 2000, 'Product B': 9800, 'Product C': 2290 },
  { month: 'Apr', 'Product A': 2780, 'Product B': 3908, 'Product C': 2000 },
  { month: 'May', 'Product A': 1890, 'Product B': 4800, 'Product C': 2181 },
  { month: 'Jun', 'Product A': 2390, 'Product B': 3800, 'Product C': 2500 },
  { month: 'Jul', 'Product A': 3490, 'Product B': 4300, 'Product C': 2100 }
];

const codeExample = `import { StackedAreaChart } from "@aibyters/charts-bi";

<StackedAreaChart
  title="Sales Overview"
  description="Monthly sales by product"
  data={sampleData}
  index="month"
  categories={['Product A', 'Product B', 'Product C']}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'Key for the X-axis (e.g., dates/categories)' },
  { name: 'categories', type: 'string[]', required: true, default: '-', description: 'Keys representing each stacked area' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter function for Y-axis values' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function StackedAreaChartPage() {
  return (
    <ChartPageLayout
      title="Stacked Area Chart"
      description="Shows the trend of multiple series over time, while emphasizing the cumulative total by stacking the areas on top of each other."
      category="bi"
      code={codeExample}
    >
      <StackedAreaChart
        title="Sales Overview"
        description="Monthly sales by product"
        data={sampleData}
        index="month"
        categories={['Product A', 'Product B', 'Product C']}
        valueFormatter={formatCompactNumber}
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
