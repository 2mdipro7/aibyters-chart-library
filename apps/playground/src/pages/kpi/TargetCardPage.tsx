import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { TargetCard } from '@aibyters/charts-kpi';

const codeExample = `import { TargetCard } from "@aibyters/charts-kpi";

<TargetCard
  title="Q3 Sales Target"
  value={850000}
  target={1000000}
  format="currency"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'value', type: 'number', required: true, default: '-', description: 'The current value' },
  { name: 'target', type: 'number', required: true, default: '-', description: 'The target value' },
  { name: 'format', type: "'number' | 'currency' | 'percent'", required: false, default: "'number'", description: 'How to format the values' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function TargetCardPage() {
  return (
    <ChartPageLayout title="Target Card" description="Shows a metric against a specific target goal." category="kpi" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TargetCard title="Q3 Sales Target" value={850000} target={1000000} format="currency" description="Ends in 14 days" />
        <TargetCard title="Server Uptime" value={0.999} target={0.9999} format="percent" />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
