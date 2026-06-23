import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { GaugeChart } from '@aibyters/charts-bi';

const codeExample = `import { GaugeChart } from "@aibyters/charts-bi";

<GaugeChart
  title="System Load"
  description="Current CPU usage percentage"
  value={82}
  min={0}
  max={100}
  thresholds={[
    { value: 0, color: '#22c55e' },
    { value: 70, color: '#f59e0b' },
    { value: 90, color: '#ef4444' }
  ]}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart title' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart subtitle' },
  { name: 'value', type: 'number', required: true, default: '-', description: 'The current value to display' },
  { name: 'min', type: 'number', required: false, default: '0', description: 'Minimum possible value' },
  { name: 'max', type: 'number', required: false, default: '100', description: 'Maximum possible value' },
  { name: 'thresholds', type: 'Array<{value, color}>', required: false, default: '-', description: 'Color thresholds for the gauge arc' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS class' }
];

export default function GaugeChartPage() {
  return (
    <ChartPageLayout
      title="Gauge Chart"
      description="A semi-circular gauge that indicates a single value within a specific range, often used for performance metrics or KPIs."
      category="bi"
      code={codeExample}
    >
      <GaugeChart
        title="System Load"
        description="Current CPU usage percentage"
        value={82}
        min={0}
        max={100}
        thresholds={[
          { value: 0, color: '#22c55e' },
          { value: 70, color: '#f59e0b' },
          { value: 90, color: '#ef4444' }
        ]}
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
