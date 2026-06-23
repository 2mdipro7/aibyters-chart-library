import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { DependencyTree } from '@aibyters/charts-network';

const sampleData = {
  name: 'CEO',
  children: [
    {
      name: 'VP Engineering',
      children: [
        { name: 'Director Backend', children: [{ name: 'Team A' }, { name: 'Team B' }] },
        { name: 'Director Frontend', children: [{ name: 'Team C' }] }
      ]
    },
    {
      name: 'VP Sales',
      children: [
        { name: 'US Sales' },
        { name: 'EMEA Sales' }
      ]
    }
  ]
};

const codeExample = `import { DependencyTree } from "@aibyters/charts-network";

<DependencyTree
  title="Organization Chart"
  description="Company reporting structure"
  data={data}
  orientation="horizontal"
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'data', type: '{ name: string; children?: any[] }', required: true, default: '-', description: 'Hierarchical tree data' },
  { name: 'orientation', type: '"vertical" | "horizontal"', required: false, default: '"horizontal"', description: 'Tree flow direction' },
  { name: 'colors', type: 'string[]', required: false, default: 'Default palette', description: 'Node colors based on depth' }
];

export default function DependencyTreePage() {
  return (
    <ChartPageLayout
      title="Dependency Tree"
      description="Displays hierarchical data with parent-child relationships."
      category="network"
      code={codeExample}
    >
      <DependencyTree 
        title="Organization Chart" 
        description="Company reporting structure" 
        data={sampleData}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
