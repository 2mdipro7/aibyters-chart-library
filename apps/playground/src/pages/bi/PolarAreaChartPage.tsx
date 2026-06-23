import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { PolarAreaChart } from '@aibyters/charts-bi';

const sampleData = [
  { name: 'North', value: 45 },
  { name: 'North East', value: 25 },
  { name: 'East', value: 60 },
  { name: 'South East', value: 30 },
  { name: 'South', value: 75 },
  { name: 'South West', value: 40 },
  { name: 'West', value: 55 },
  { name: 'North West', value: 35 }
];

const codeExample = `import { PolarAreaChart } from "@aibyters/charts-bi";

<PolarAreaChart
  title="Wind Directions"
  description="Frequency by cardinal direction"
  data={data}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'data', type: 'Array<{ name: string; value: number }>', required: true, default: '-', description: 'Data for each wedge' },
  { name: 'colors', type: 'string[]', required: false, default: 'Default palette', description: 'Slice colors' }
];

export default function PolarAreaChartPage() {
  return (
    <ChartPageLayout
      title="Polar Area Chart"
      description="Similar to a pie chart, but segments have equal angles and vary in radius to indicate value."
      category="bi"
      code={codeExample}
    >
      <PolarAreaChart 
        title="Wind Directions" 
        description="Frequency by cardinal direction" 
        data={sampleData}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
