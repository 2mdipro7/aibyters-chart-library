import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { RadialBarChart } from '@aibyters/charts-bi';

const sampleData = [
  { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8' },
  { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed' },
  { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
  { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d' },
  { name: '40-49', uv: 8.63, pv: 3908, fill: '#a4de6c' },
  { name: '50+', uv: 2.63, pv: 4800, fill: '#d0ed57' },
  { name: 'Unknown', uv: 6.67, pv: 4800, fill: '#ffc658' }
];

const codeExample = `import { RadialBarChart } from "@aibyters/charts-bi";

<RadialBarChart
  title="Audience Age"
  description="Distribution by age group"
  data={sampleData}
  dataKey="uv"
  nameKey="name"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'dataKey', type: 'string', required: true, default: '-', description: 'Key for radial bar values' },
  { name: 'nameKey', type: 'string', required: true, default: '-', description: 'Key for category names' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function RadialBarChartPage() {
  return (
    <ChartPageLayout
      title="Radial Bar Chart"
      description="A bar chart plotted on a polar coordinate system rather than a Cartesian one."
      category="bi"
      code={codeExample}
    >
      <RadialBarChart
        title="Audience Age"
        description="Distribution by age group"
        data={sampleData}
        dataKey="uv"
        nameKey="name"
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
