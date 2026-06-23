import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { TreemapChart } from '@aibyters/charts-bi';

const sampleData = [
  {
    name: 'Electronics',
    children: [
      { name: 'Phones', value: 400 },
      { name: 'Laptops', value: 300 },
      { name: 'Tablets', value: 200 }
    ]
  },
  {
    name: 'Clothing',
    children: [
      { name: 'Shirts', value: 200 },
      { name: 'Pants', value: 150 },
      { name: 'Shoes', value: 100 }
    ]
  },
  {
    name: 'Home',
    children: [
      { name: 'Furniture', value: 350 },
      { name: 'Decor', value: 150 }
    ]
  }
];

const codeExample = `import { TreemapChart } from "@aibyters/charts-bi";

<TreemapChart
  title="Sales by Category"
  description="Hierarchical view of product sales"
  data={sampleData}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'data', type: 'Array<{name, value, children?}>', required: true, default: '-', description: 'Hierarchical data array' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function TreemapChartPage() {
  return (
    <ChartPageLayout
      title="Treemap Chart"
      description="Displays hierarchical data as a set of nested rectangles. Size of rectangles is proportional to the specified value."
      category="bi"
      code={codeExample}
    >
      <TreemapChart
        title="Sales by Category"
        description="Hierarchical view of product sales"
        data={sampleData}
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
