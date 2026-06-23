import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { SeverityCard } from '@aibyters/charts-kpi';

const codeExample = `import { SeverityCard } from "@aibyters/charts-kpi";

<SeverityCard
  title="System Status"
  status="critical"
  message="Database connection failed in production region."
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'status', type: "'critical' | 'warning' | 'info' | 'success'", required: true, default: '-', description: 'Severity level' },
  { name: 'message', type: 'string', required: true, default: '-', description: 'The main status message' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function SeverityCardPage() {
  return (
    <ChartPageLayout title="Severity Card" description="A card showing a status or severity level with a colored indicator." category="kpi" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SeverityCard 
          title="Database Alert" 
          status="critical" 
          message="Connection timeout to primary replica in us-east-1." 
          description="2 minutes ago" 
        />
        <SeverityCard 
          title="Memory Usage" 
          status="warning" 
          message="Node-A memory utilization exceeds 85%." 
        />
        <SeverityCard 
          title="Deployment" 
          status="success" 
          message="Release v2.4.0 successfully deployed to all regions." 
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
