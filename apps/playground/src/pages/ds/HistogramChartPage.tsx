import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { HistogramChart } from '@aibyters/charts-ds';

const sampleData = Array.from({ length: 100 }, () => 
  Math.max(50, Math.min(250, 150 + (Math.random() * 100 - 50) + (Math.random() * 100 - 50)))
);

const codeExample = `import { HistogramChart } from "@aibyters/charts-ds";

<HistogramChart
  title="Response Time Distribution"
  data={data}
  bins={15}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'number[]', required: true, default: '-', description: 'Array of numeric values' },
  { name: 'bins', type: 'number', required: false, default: '10', description: 'Number of bins to divide the data into' },
  { name: 'color', type: 'string', required: false, default: 'defaultColors[0]', description: 'Bar color' },
];

export default function HistogramChartPage() {
  return (
    <ChartPageLayout
      title="Histogram Chart"
      description="Displays the frequency distribution of continuous data."
      category="ds"
      code={codeExample}
    >
      <HistogramChart 
        title="API Response Time (ms)" 
        data={sampleData} 
        bins={15}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
