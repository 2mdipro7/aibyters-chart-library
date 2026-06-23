import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { BoxPlotChart } from '@aibyters/charts-ds';

const sampleData = [
  { label: 'Math', values: [65, 70, 72, 75, 80, 85, 86, 88, 92, 95, 98] },
  { label: 'Science', values: [50, 55, 60, 65, 68, 70, 75, 78, 80, 82, 85, 90, 100] },
  { label: 'History', values: [75, 78, 80, 82, 84, 85, 86, 88, 90, 92, 95] },
  { label: 'Art', values: [85, 88, 90, 92, 94, 95, 96, 98, 99, 100] }
];

const codeExample = `import { BoxPlotChart } from "@aibyters/charts-ds";

<BoxPlotChart
  title="Exam Score Distribution"
  data={data}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'Array<{ label: string; values: number[] }>', required: true, default: '-', description: 'Grouped data arrays' },
  { name: 'color', type: 'string', required: false, default: 'defaultColors[0]', description: 'Box and whisker color' },
];

export default function BoxPlotChartPage() {
  return (
    <ChartPageLayout
      title="Box Plot Chart"
      description="Displays the distribution of data based on a five-number summary: minimum, first quartile, median, third quartile, and maximum."
      category="ds"
      code={codeExample}
    >
      <BoxPlotChart 
        title="Exam Scores by Subject" 
        data={sampleData} 
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
