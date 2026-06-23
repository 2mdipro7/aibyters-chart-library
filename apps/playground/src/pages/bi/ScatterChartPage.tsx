import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { ScatterChart } from '@aibyters/charts-bi';

const sampleData = [
  { x: 100, y: 200, z: 200, name: 'Campaign A' },
  { x: 120, y: 100, z: 260, name: 'Campaign B' },
  { x: 170, y: 300, z: 400, name: 'Campaign C' },
  { x: 140, y: 250, z: 280, name: 'Campaign D' },
  { x: 150, y: 400, z: 500, name: 'Campaign E' },
  { x: 110, y: 280, z: 200, name: 'Campaign F' }
];

const codeExample = `import { ScatterChart } from "@aibyters/charts-bi";

<ScatterChart
  title="Marketing Spend vs ROI"
  description="Analysis of campaign performance"
  data={sampleData}
  xKey="x"
  yKey="y"
  nameKey="name"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'xKey', type: 'string', required: true, default: '-', description: 'Key for X axis values' },
  { name: 'yKey', type: 'string', required: true, default: '-', description: 'Key for Y axis values' },
  { name: 'nameKey', type: 'string', required: false, default: '-', description: 'Key for point names (used in tooltips)' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function ScatterChartPage() {
  return (
    <ChartPageLayout
      title="Scatter Chart"
      description="Used to show the relationship between two numerical variables. Best for identifying correlations, trends, or outliers in large datasets."
      category="bi"
      code={codeExample}
    >
      <ScatterChart
        title="Marketing Spend vs ROI"
        description="Analysis of campaign performance (Spend vs Return)"
        data={sampleData}
        xKey="x"
        yKey="y"
        nameKey="name"
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
