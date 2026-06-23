import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { ProgressCard } from '@aibyters/charts-kpi';

const codeExample = `import { ProgressCard } from "@aibyters/charts-kpi";

<ProgressCard
  title="Storage Usage"
  value={450}
  max={500}
  type="linear"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'value', type: 'number', required: true, default: '-', description: 'Current progress value' },
  { name: 'max', type: 'number', required: true, default: '-', description: 'Maximum possible value' },
  { name: 'type', type: "'circular' | 'linear'", required: false, default: "'linear'", description: 'Type of progress visualization' },
  { name: 'color', type: 'string', required: false, default: "'#6366f1'", description: 'Color of the progress bar/circle' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function ProgressCardPage() {
  return (
    <ChartPageLayout title="Progress Card" description="Displays progress towards a goal in a linear or circular format." category="kpi" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ProgressCard 
          title="Monthly Quota" 
          value={8500} 
          max={10000} 
          type="linear" 
          description="API requests" 
        />
        <ProgressCard 
          title="Project Completion" 
          value={12} 
          max={16} 
          type="circular" 
          color="#22c55e"
          description="Sprints completed" 
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
