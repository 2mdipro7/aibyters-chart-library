import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { AnomalyTimeline } from '@aibyters/charts-ds';

const sampleData = [
  { time: '00:00', value: 45, isAnomaly: false },
  { time: '01:00', value: 48, isAnomaly: false },
  { time: '02:00', value: 50, isAnomaly: false },
  { time: '03:00', value: 120, isAnomaly: true },
  { time: '04:00', value: 47, isAnomaly: false },
  { time: '05:00', value: 49, isAnomaly: false },
  { time: '06:00', value: 15, isAnomaly: true },
  { time: '07:00', value: 52, isAnomaly: false },
];

const codeExample = `import { AnomalyTimeline } from "@aibyters/charts-ds";

<AnomalyTimeline
  title="Server CPU Usage"
  data={data}
  index="time"
  valueKey="value"
  anomalyKey="isAnomaly"
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Data points' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'X-axis data key' },
  { name: 'valueKey', type: 'string', required: true, default: '-', description: 'Key for normal values' },
  { name: 'anomalyKey', type: 'string', required: true, default: '-', description: 'Boolean key indicating if the point is an anomaly' },
];

export default function AnomalyTimelinePage() {
  return (
    <ChartPageLayout
      title="Anomaly Timeline"
      description="Highlights statistical outliers or anomalies within a time series dataset."
      category="ds"
      code={codeExample}
    >
      <AnomalyTimeline 
        title="Server CPU Usage" 
        data={sampleData} 
        index="time"
        valueKey="value"
        anomalyKey="isAnomaly"
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
