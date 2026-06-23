import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { MetricCard } from '@aibyters/charts-kpi';

const codeExample = `import { MetricCard } from "@aibyters/charts-kpi";

<MetricCard
  title="Total Revenue"
  value={1250000}
  format="currency"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'value', type: 'number', required: true, default: '-', description: 'The numeric value to display' },
  { name: 'format', type: "'number' | 'currency' | 'percent'", required: false, default: "'number'", description: 'How to format the value' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle/description' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function MetricCardPage() {
  return (
    <ChartPageLayout title="Metric Card" description="A simple card to display a single metric." category="kpi" code={codeExample}>
      <div style={{ maxWidth: '400px' }}>
        <MetricCard title="Total Revenue" value={1250000} format="currency" description="Year to date" />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
