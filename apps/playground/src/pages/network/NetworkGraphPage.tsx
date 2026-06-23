import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { NetworkGraph } from '@aibyters/charts-network';

const sampleNodes = [
  { id: '1', label: 'User A', group: 0 },
  { id: '2', label: 'User B', group: 0 },
  { id: '3', label: 'System X', group: 1 },
  { id: '4', label: 'System Y', group: 1 },
  { id: '5', label: 'Service 1', group: 2 },
  { id: '6', label: 'Service 2', group: 2 },
  { id: '7', label: 'Database', group: 3 }
];

const sampleLinks = [
  { source: '1', target: '3', value: 2 },
  { source: '2', target: '3', value: 1 },
  { source: '3', target: '4', value: 3 },
  { source: '3', target: '5', value: 2 },
  { source: '4', target: '6', value: 1 },
  { source: '5', target: '7', value: 4 },
  { source: '6', target: '7', value: 4 }
];

const codeExample = `import { NetworkGraph } from "@aibyters/charts-network";

<NetworkGraph
  title="System Architecture"
  description="Dependency map of microservices"
  nodes={nodes}
  links={links}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'nodes', type: 'Array<{ id: string; label: string; group?: number }>', required: true, default: '-', description: 'Network nodes' },
  { name: 'links', type: 'Array<{ source: string; target: string; value?: number }>', required: true, default: '-', description: 'Edges connecting nodes' },
  { name: 'colors', type: 'string[]', required: false, default: 'Default palette', description: 'Node colors based on group' }
];

export default function NetworkGraphPage() {
  return (
    <ChartPageLayout
      title="Network Graph"
      description="Visualizes complex relationships and interconnections between entities."
      category="network"
      code={codeExample}
    >
      <NetworkGraph 
        title="System Architecture" 
        description="Dependency map of microservices" 
        nodes={sampleNodes}
        links={sampleLinks}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
