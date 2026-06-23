import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { CompetitivePositioningChart } from '@aibyters/charts-bi';

const sampleData = [
  { name: 'Apple', x: 85, y: 90, fill: '#ef4444' },
  { name: 'Samsung', x: 80, y: 85, fill: '#3b82f6' },
  { name: 'Google', x: 90, y: 75, fill: '#10b981' },
  { name: 'OnePlus', x: 60, y: 65, fill: '#f59e0b' },
  { name: 'Xiaomi', x: 55, y: 70, fill: '#8b5cf6' },
  { name: 'Sony', x: 40, y: 45, fill: '#64748b' },
  { name: 'Huawei', x: 70, y: 60, fill: '#ec4899' },
  { name: 'Nothing', x: 80, y: 40, fill: '#14b8a6' },
  { name: 'Nokia', x: 30, y: 50, fill: '#06b6d4' }
];

const codeExample = `import { CompetitivePositioningChart } from "@aibyters/charts-bi";

const data = [
  { name: 'Apple', x: 85, y: 90, fill: '#ef4444' },
  { name: 'Google', x: 90, y: 75, fill: '#10b981' },
  // ...
];

<CompetitivePositioningChart
  title="Smartphone Market 2024"
  description="Gartner Magic Quadrant style analysis"
  data={data}
  xAxisLabel="Completeness of Vision"
  yAxisLabel="Ability to Execute"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'Array<{name, x, y, z?, fill?}>', required: true, default: '-', description: 'Array of competitors' },
  { name: 'xAxisLabel', type: 'string', required: false, default: 'Completeness of Vision', description: 'X-axis label' },
  { name: 'yAxisLabel', type: 'string', required: false, default: 'Ability to Execute', description: 'Y-axis label' },
  { name: 'quadrantLabels', type: 'object', required: false, default: '{...}', description: 'Labels for the 4 quadrants' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function CompetitivePositioningPage() {
  return (
    <ChartPageLayout title="Competitive Positioning Matrix" description="A 2x2 scatter matrix plotting entities (e.g., competitors) across two axes. Ideal for 'Magic Quadrant' style frameworks." category="bi" code={codeExample}>
      <CompetitivePositioningChart 
        title="Smartphone Market 2024" 
        description="Market leaders and visionaries in the consumer electronics space."
        data={sampleData} 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
