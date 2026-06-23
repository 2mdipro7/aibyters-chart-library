import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { RadarChart } from '@aibyters/charts-bi';

const sampleData = [
  { subject: 'Math', A: 120, B: 110, fullMark: 150 },
  { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
  { subject: 'English', A: 86, B: 130, fullMark: 150 },
  { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
  { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
  { subject: 'History', A: 65, B: 85, fullMark: 150 }
];

const codeExample = `import { RadarChart } from "@aibyters/charts-bi";

<RadarChart
  title="Student Skills"
  description="Comparison of two students across subjects"
  data={sampleData}
  index="subject"
  categories={['A', 'B']}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'Key for the axis labels' },
  { name: 'categories', type: 'string[]', required: true, default: '-', description: 'Keys for the radar polygons' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function RadarChartPage() {
  return (
    <ChartPageLayout
      title="Radar Chart"
      description="Used to compare multiple quantitative variables. Best for showing performance metrics across different categories or finding outliers."
      category="bi"
      code={codeExample}
    >
      <RadarChart
        title="Student Skills"
        description="Comparison of two students across subjects"
        data={sampleData}
        index="subject"
        categories={['A', 'B']}
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
