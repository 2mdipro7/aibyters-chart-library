import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { InsightCard } from '@aibyters/charts-ai';

const codeExample = `import { InsightCard } from "@aibyters/charts-ai";

<InsightCard
  title="Customer Churn Risk"
  severity="warning"
  summary="3 key accounts are showing decreased activity patterns typical of pre-churn behavior."
  metric="Est. Revenue at Risk"
  metricValue="$45,000"
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'severity', type: "'critical' | 'warning' | 'info' | 'success'", required: true, default: '-', description: 'Insight severity level' },
  { name: 'summary', type: 'string', required: true, default: '-', description: 'AI generated summary text' },
  { name: 'metric', type: 'string', required: false, default: '-', description: 'Optional metric label related to the insight' },
  { name: 'metricValue', type: 'string', required: false, default: '-', description: 'Value for the optional metric' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function InsightCardPage() {
  return (
    <ChartPageLayout title="Insight Card" description="Displays an AI-generated insight with severity and key metrics." category="ai" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InsightCard 
          title="Revenue Anomaly Detected" 
          severity="success" 
          summary="European region sales are 24% higher than the forecasted model for this quarter, driven by new product adoption." 
          metric="Deviation"
          metricValue="+24%"
        />
        <InsightCard 
          title="Supply Chain Risk" 
          severity="critical" 
          summary="Component shortage predicted for Q3 based on supplier delivery delays over the last 30 days." 
          metric="Affected SKUs"
          metricValue="14"
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
