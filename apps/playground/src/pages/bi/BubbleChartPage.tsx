import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { BubbleChart } from '@aibyters/charts-bi';

const sampleData = [
  { x: 100, y: 200, z: 200, name: 'Product A' },
  { x: 120, y: 100, z: 260, name: 'Product B' },
  { x: 170, y: 300, z: 400, name: 'Product C' },
  { x: 140, y: 250, z: 280, name: 'Product D' },
  { x: 150, y: 400, z: 500, name: 'Product E' },
  { x: 110, y: 280, z: 200, name: 'Product F' }
];

const codeExample = `import { BubbleChart } from "@aibyters/charts-bi";

<BubbleChart
  title="Market Analysis"
  description="Market Share vs Growth (Bubble Size = Revenue)"
  data={sampleData}
  xKey="x"
  yKey="y"
  sizeKey="z"
  nameKey="name"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'xKey', type: 'string', required: true, default: '-', description: 'Key for X axis values' },
  { name: 'yKey', type: 'string', required: true, default: '-', description: 'Key for Y axis values' },
  { name: 'sizeKey', type: 'string', required: true, default: '-', description: 'Key for bubble size (Z axis)' },
  { name: 'nameKey', type: 'string', required: false, default: '-', description: 'Key for point names (used in tooltips)' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function BubbleChartPage() {
  return (
    <ChartPageLayout
      title="Bubble Chart"
      description="An extension of the scatter chart that adds a third dimension (bubble size). Great for visualizing complex relationships between three variables."
      category="bi"
      code={codeExample}
    >
      <BubbleChart
        title="Market Analysis"
        description="Market Share vs Growth (Bubble Size = Revenue)"
        data={sampleData}
        xKey="x"
        yKey="y"
        sizeKey="z"
        nameKey="name"
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
