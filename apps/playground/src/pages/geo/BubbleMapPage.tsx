import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { BubbleMap } from '@aibyters/charts-geo';

const sampleData = [
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number], value: 8400000 },
  { name: 'London', coordinates: [-0.1276, 51.5074] as [number, number], value: 8980000 },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] as [number, number], value: 13960000 },
  { name: 'Mumbai', coordinates: [72.8777, 19.0760] as [number, number], value: 20410000 },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] as [number, number], value: 12330000 },
  { name: 'Johannesburg', coordinates: [28.0473, -26.2041] as [number, number], value: 5635000 },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] as [number, number], value: 5312000 }
];

const codeExample = `import { BubbleMap } from "@aibyters/charts-geo";

<BubbleMap
  title="Major City Populations"
  description="Global cities by population size"
  data={sampleData}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'data', type: 'Array<{ name: string; coordinates: [number, number]; value: number }>', required: true, default: '-', description: 'Bubble positions and values' },
  { name: 'color', type: 'string', required: false, default: 'Default indigo', description: 'Bubble color' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' }
];

export default function BubbleMapPage() {
  return (
    <ChartPageLayout
      title="Bubble Map"
      description="Displays bubbles of varying sizes on a map to represent data values."
      category="geo"
      code={codeExample}
    >
      <BubbleMap 
        title="Major City Populations" 
        description="Global cities by population size" 
        data={sampleData} 
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
