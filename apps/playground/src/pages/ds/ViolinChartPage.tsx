import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ViolinChart } from '@aibyters/charts-ds';

function generateData(mean: number, stdDev: number, count: number) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    result.push(mean + z0 * stdDev);
  }
  return result;
}

const sampleData = [
  { label: 'Engineering', values: generateData(120000, 20000, 100) },
  { label: 'Marketing', values: generateData(90000, 15000, 100) },
  { label: 'Sales', values: [...generateData(80000, 10000, 50), ...generateData(140000, 15000, 50)] },
  { label: 'HR', values: generateData(85000, 12000, 100) }
];

const codeExample = `import { ViolinChart } from "@aibyters/charts-ds";

<ViolinChart
  title="Salary Distribution by Department"
  data={data}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'Array<{ label: string; values: number[] }>', required: true, default: '-', description: 'Grouped data arrays' },
  { name: 'color', type: 'string', required: false, default: 'defaultColors[0]', description: 'Fill color' },
];

export default function ViolinChartPage() {
  return (
    <ChartPageLayout
      title="Violin Chart"
      description="Combines a box plot and a kernel density plot to show the probability density of the data at different values."
      category="ds"
      code={codeExample}
    >
      <ViolinChart 
        title="Salary Distribution by Department" 
        data={sampleData} 
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
