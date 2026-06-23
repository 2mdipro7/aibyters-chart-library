import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { PieChart } from '@aibyters/charts-bi';

const sampleData = [
  { name: 'Marketing', value: 400000 },
  { name: 'Sales', value: 300000 },
  { name: 'Engineering', value: 300000 },
  { name: 'HR', value: 200000 },
  { name: 'Support', value: 100000 }
];

const codeExample = `import { PieChart } from "@aibyters/charts-bi";

<PieChart
  title="Revenue by Department"
  description="Distribution of revenue generation"
  data={sampleData}
  dataKey="value"
  nameKey="name"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle/description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'dataKey', type: 'string', required: true, default: '-', description: 'Key for values in data' },
  { name: 'nameKey', type: 'string', required: true, default: '-', description: 'Key for names in data' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'showLabels', type: 'boolean', required: false, default: 'true', description: 'Show labels on pie slices' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function PieChartPage() {
  return (
    <ChartPageLayout
      title="Pie Chart"
      description="Used to show proportional data and percentages of a whole. Best for showing a small number of categories (2-5)."
      category="bi"
      code={codeExample}
    >
      <PieChart
        title="Revenue by Department"
        description="Distribution of revenue generation"
        data={sampleData}
        dataKey="value"
        nameKey="name"
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
