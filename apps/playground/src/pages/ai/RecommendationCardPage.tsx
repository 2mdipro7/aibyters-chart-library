import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { RecommendationCard } from '@aibyters/charts-ai';

const codeExample = `import { RecommendationCard } from "@aibyters/charts-ai";

<RecommendationCard
  title="Pricing Optimization"
  action="Increase Premium Tier by $5"
  confidence={0.87}
  impact="high"
  reason="Competitor analysis and price elasticity models suggest a 5% price increase will have minimal impact on churn while boosting MRR."
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'action', type: 'string', required: true, default: '-', description: 'The recommended action to take' },
  { name: 'confidence', type: 'number', required: true, default: '-', description: 'AI confidence score (0 to 1)' },
  { name: 'impact', type: "'high' | 'medium' | 'low'", required: true, default: '-', description: 'Estimated business impact' },
  { name: 'reason', type: 'string', required: true, default: '-', description: 'Explanation for the recommendation' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'Additional CSS classes' },
];

export default function RecommendationCardPage() {
  return (
    <ChartPageLayout title="Recommendation Card" description="Actionable AI recommendation with confidence score and impact." category="ai" code={codeExample}>
      <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <RecommendationCard 
          title="Campaign Optimization" 
          action="Reallocate budget from Facebook to LinkedIn" 
          confidence={0.92}
          impact="high"
          reason="LinkedIn campaigns are showing a 40% lower CPA for enterprise leads compared to Facebook over the last 14 days."
        />
        <RecommendationCard 
          title="Resource Management" 
          action="Scale down rendering cluster by 2 nodes" 
          confidence={0.75}
          impact="low"
          reason="Historical utilization patterns suggest weekend usage will remain below 30% of current capacity."
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
