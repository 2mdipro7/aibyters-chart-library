import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ChordDiagram } from '@aibyters/charts-network';

// Trade flows between regions
const sampleMatrix = [
  [0, 50, 30, 20],
  [10, 0, 40, 60],
  [20, 15, 0, 35],
  [5, 10, 15, 0]
];
const sampleLabels = ['North America', 'Europe', 'Asia', 'South America'];

const codeExample = `import { ChordDiagram } from "@aibyters/charts-network";

<ChordDiagram
  title="Global Trade Flows"
  description="Export volume between major regions"
  matrix={matrix}
  labels={labels}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'matrix', type: 'number[][]', required: true, default: '-', description: 'N x N matrix representing flows' },
  { name: 'labels', type: 'string[]', required: true, default: '-', description: 'Names for each row/col in matrix' },
  { name: 'colors', type: 'string[]', required: false, default: 'Default palette', description: 'Arc colors' }
];

export default function ChordDiagramPage() {
  return (
    <ChartPageLayout
      title="Chord Diagram"
      description="Visualizes inter-relationships and flows between a group of entities."
      category="network"
      code={codeExample}
    >
      <ChordDiagram 
        title="Global Trade Flows" 
        description="Export volume between major regions" 
        matrix={sampleMatrix}
        labels={sampleLabels}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
