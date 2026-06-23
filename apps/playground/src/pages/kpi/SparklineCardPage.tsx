import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { SparklineCard } from '@aibyters/charts-kpi';

const sampleData = [12, 14, 18, 15, 22, 28, 25, 30, 35, 32, 40, 45, 42, 50];

const codeExample = `import { SparklineCard } from "@aibyters/charts-kpi";

<SparklineCard
  title="Monthly Traffic"
  value={50400}
  data={[12, 14, 18, 15, 22, 28, 25, 30, 35, 32, 40, 45, 42, 50]}
  trend="up"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'value', type: 'number', required: true, default: '-', description: 'The primary metric value' },
  { name: 'data', type: 'number[]', required: true, default: '-', description: 'Array of numbers for the sparkline' },
  { name: 'color', type: 'string', required: false, default: "'#6366f1'", description: 'Color of the sparkline' },
  { name: 'trend', type: "'up' | 'down' | 'neutral'", required: false, default: "'neutral'", description: 'Trend indicator direction' },
  { name: 'format', type: "'number' | 'currency' | 'percent'", required: false, default: "'number'", description: 'How to format the value' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function SparklineCardPage() {
  return (
    <ChartPageLayout title="Sparkline Card" description="A KPI card with a tiny inline trend line." category="kpi" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SparklineCard 
          title="Monthly Traffic" 
          value={50400} 
          data={sampleData} 
          trend="up" 
          description="Last 30 days" 
        />
        <SparklineCard 
          title="Conversion Rate" 
          value={0.032} 
          format="percent"
          data={[3.5, 3.8, 3.4, 3.2, 3.1, 3.3, 3.0, 2.9, 3.2]} 
          trend="down" 
          color="#f59e0b"
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
