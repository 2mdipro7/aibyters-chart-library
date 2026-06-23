import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ChoroplethMap } from '@aibyters/charts-geo';

const sampleData = [
  { region: 'US', value: 25346805 },
  { region: 'CN', value: 19911593 },
  { region: 'JP', value: 4912147 },
  { region: 'DE', value: 4259935 },
  { region: 'IN', value: 3385090 },
  { region: 'UK', value: 3332059 },
  { region: 'FR', value: 2778090 },
  { region: 'CA', value: 2139840 },
  { region: 'IT', value: 2010432 },
  { region: 'BR', value: 1920096 }
];

const codeExample = `import { ChoroplethMap } from "@aibyters/charts-geo";

<ChoroplethMap
  title="Global GDP Distribution"
  description="Top 10 economies by GDP (in millions USD)"
  data={sampleData}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'data', type: 'Array<{ region: string; value: number }>', required: true, default: '-', description: 'Map data' },
  { name: 'colorScale', type: '{ min: string; max: string }', required: false, default: '-', description: 'Gradient range colors' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' }
];

export default function ChoroplethMapPage() {
  return (
    <ChartPageLayout
      title="Choropleth Map"
      description="Visualizes data by shading or coloring regions according to values."
      category="geo"
      code={codeExample}
    >
      <ChoroplethMap 
        title="Global GDP Distribution" 
        description="Top economies by GDP" 
        data={sampleData} 
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
