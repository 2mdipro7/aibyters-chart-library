import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { SankeyChart } from '@aibyters/charts-bi';

const nodes = [
  { name: 'Website' },
  { name: 'App' },
  { name: 'Search' },
  { name: 'Direct' },
  { name: 'Purchase' },
  { name: 'Drop-off' }
];

const links = [
  { source: 2, target: 0, value: 50 },
  { source: 3, target: 0, value: 30 },
  { source: 2, target: 1, value: 20 },
  { source: 3, target: 1, value: 10 },
  { source: 0, target: 4, value: 40 },
  { source: 0, target: 5, value: 40 },
  { source: 1, target: 4, value: 25 },
  { source: 1, target: 5, value: 5 }
];

const codeExample = `import { SankeyChart } from "@aibyters/charts-bi";

<SankeyChart
  title="User Flow"
  description="Journey from source to outcome"
  nodes={nodes}
  links={links}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'nodes', type: 'Array<{name}>', required: true, default: '-', description: 'Array of nodes' },
  { name: 'links', type: 'Array<{source, target, value}>', required: true, default: '-', description: 'Array of links between nodes' },
  { name: 'colors', type: 'string[]', required: false, default: 'defaultColors', description: 'Array of hex colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function SankeyChartPage() {
  return (
    <ChartPageLayout
      title="Sankey Chart"
      description="Visualizes the flow of data or resources between different nodes. Width of the arrows is proportional to the flow quantity."
      category="bi"
      code={codeExample}
    >
      <SankeyChart
        title="User Flow"
        description="Journey from source to outcome"
        nodes={nodes}
        links={links}
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
