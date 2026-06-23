import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ControlChart } from '@aibyters/charts-ds';

const sampleData = Array.from({ length: 30 }, (_, i) => {
  let value = 100 + (Math.random() * 10 - 5);
  if (i === 12) value = 115;
  if (i === 24) value = 82;
  return { id: `Batch ${i + 1}`, value };
});

const codeExample = `import { ControlChart } from "@aibyters/charts-ds";

<ControlChart
  title="Manufacturing Quality Control"
  data={data}
  index="id"
  valueKey="value"
  ucl={110}
  lcl={90}
  mean={100}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Data array' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'X-axis key' },
  { name: 'valueKey', type: 'string', required: true, default: '-', description: 'Y-axis value key' },
  { name: 'ucl', type: 'number', required: true, default: '-', description: 'Upper control limit' },
  { name: 'lcl', type: 'number', required: true, default: '-', description: 'Lower control limit' },
  { name: 'mean', type: 'number', required: true, default: '-', description: 'Mean value' },
];

export default function ControlChartPage() {
  return (
    <ChartPageLayout
      title="Control Chart"
      description="Statistical process control chart with Upper and Lower Control Limits."
      category="ds"
      code={codeExample}
    >
      <ControlChart 
        title="Manufacturing Quality Control" 
        data={sampleData} 
        index="id"
        valueKey="value"
        ucl={110}
        lcl={90}
        mean={100}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
