import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { DeltaCard } from '@aibyters/charts-kpi';

const codeExample = `import { DeltaCard } from "@aibyters/charts-kpi";

<DeltaCard
  title="Active Users"
  value={45200}
  delta={0.125}
  deltaType="increase"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'value', type: 'number', required: true, default: '-', description: 'The current value' },
  { name: 'delta', type: 'number', required: true, default: '-', description: 'The change amount (ratio)' },
  { name: 'deltaType', type: "'increase' | 'decrease' | 'neutral'", required: true, default: '-', description: 'The direction of the change' },
  { name: 'format', type: "'number' | 'currency' | 'percent'", required: false, default: "'number'", description: 'How to format the value' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function DeltaCardPage() {
  return (
    <ChartPageLayout title="Delta Card" description="Displays a metric along with its change over time." category="kpi" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <DeltaCard title="Active Users" value={45200} delta={0.125} deltaType="increase" format="number" />
        <DeltaCard title="Bounce Rate" value={0.45} delta={0.05} deltaType="decrease" format="percent" description="Compared to last month" />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
