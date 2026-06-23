import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { DonutChart } from '@aibyters/charts-bi';

const sampleData = [
  { name: 'Direct', value: 45000 },
  { name: 'Organic', value: 30000 },
  { name: 'Referral', value: 15000 },
  { name: 'Social', value: 10000 }
];

const codeExample = `import { DonutChart } from "@aibyters/charts-bi";

<DonutChart
  title="Traffic Sources"
  description="Distribution of incoming website traffic"
  data={sampleData}
  dataKey="value"
  nameKey="name"
  centerLabel="Total"
  centerValue="100k"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle/description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'dataKey', type: 'string', required: true, default: '-', description: 'Key for values in data' },
  { name: 'nameKey', type: 'string', required: true, default: '-', description: 'Key for names in data' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'centerLabel', type: 'string', required: false, default: '-', description: 'Text label for the center of the donut' },
  { name: 'centerValue', type: 'string', required: false, default: '-', description: 'Value text for the center of the donut' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function DonutChartPage() {
  return (
    <ChartPageLayout
      title="Donut Chart"
      description="Similar to a pie chart, but with a hollow center. Great for showing parts of a whole while prominently displaying the total value in the center."
      category="bi"
      code={codeExample}
    >
      <DonutChart
        title="Traffic Sources"
        description="Distribution of incoming website traffic"
        data={sampleData}
        dataKey="value"
        nameKey="name"
        centerLabel="Total Visits"
        centerValue="100k"
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
