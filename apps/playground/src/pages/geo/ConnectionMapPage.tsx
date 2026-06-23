import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ConnectionMap } from '@aibyters/charts-geo';

const samplePoints = [
  { name: 'JFK (New York)', coordinates: [-73.7781, 40.6413] as [number, number] },
  { name: 'LHR (London)', coordinates: [-0.4543, 51.4700] as [number, number] },
  { name: 'HND (Tokyo)', coordinates: [139.7798, 35.5494] as [number, number] },
  { name: 'DXB (Dubai)', coordinates: [55.3657, 25.2532] as [number, number] },
  { name: 'SYD (Sydney)', coordinates: [151.1772, -33.9399] as [number, number] }
];

const sampleConnections = [
  { from: 0, to: 1, value: 50 },
  { from: 1, to: 3, value: 30 },
  { from: 3, to: 2, value: 40 },
  { from: 3, to: 4, value: 20 },
  { from: 0, to: 2, value: 10 } // Long haul
];

const codeExample = `import { ConnectionMap } from "@aibyters/charts-geo";

<ConnectionMap
  title="Flight Routes"
  description="Major international flight connections"
  points={points}
  connections={connections}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'points', type: 'Array<{ name: string; coordinates: [number, number] }>', required: true, default: '-', description: 'Map nodes' },
  { name: 'connections', type: 'Array<{ from: number; to: number; value?: number }>', required: true, default: '-', description: 'Edges connecting points by index' },
  { name: 'color', type: 'string', required: false, default: 'Default cyan', description: 'Connection color' }
];

export default function ConnectionMapPage() {
  return (
    <ChartPageLayout
      title="Connection Map"
      description="Visualizes relationships or flows between geographic locations using curved lines."
      category="geo"
      code={codeExample}
    >
      <ConnectionMap 
        title="Flight Routes" 
        description="Major international flight connections" 
        points={samplePoints}
        connections={sampleConnections}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
