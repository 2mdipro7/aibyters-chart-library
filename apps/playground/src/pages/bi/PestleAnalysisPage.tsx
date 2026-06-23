import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { PestleAnalysisCard } from '@aibyters/charts-bi';

const sampleData = {
  political: [
    "Upcoming elections may shift trade policies",
    "Government subsidies for green technology",
    "Tax policy changes in European markets"
  ],
  economic: [
    "High inflation impacting consumer purchasing power",
    "Rising interest rates affecting capital borrowing",
    "Favorable exchange rates for exports"
  ],
  sociocultural: [
    "Increasing consumer preference for sustainable products",
    "Shift towards remote work and digital nomadism",
    "Aging population in key demographics"
  ],
  technological: [
    "Rapid adoption of generative AI",
    "Increased automation in manufacturing",
    "Obsolescence of legacy software systems"
  ],
  legal: [
    "Stricter GDPR enforcement and data privacy laws",
    "New employment laws regarding gig workers",
    "Antitrust investigations in big tech"
  ],
  environmental: [
    "Pressure to achieve net-zero carbon emissions",
    "Supply chain vulnerability to extreme weather",
    "Shift towards circular economy models"
  ]
};

const codeExample = `import { PestleAnalysisCard } from "@aibyters/charts-bi";

const data = {
  political: ["Elections", "Trade policies"],
  economic: ["Inflation", "Interest rates"],
  sociocultural: ["Remote work trend", "Aging population"],
  technological: ["Gen AI adoption"],
  legal: ["GDPR enforcement"],
  environmental: ["Net-zero pressure"]
};

<PestleAnalysisCard
  title="Macro-Environmental Analysis"
  description="PESTLE framework evaluating external factors."
  data={data}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Card description' },
  { name: 'data', type: '{political: string[], economic: string[], sociocultural: string[], technological: string[], legal: string[], environmental: string[]}', required: true, default: '-', description: 'The 6 categories of PESTLE' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function PestleAnalysisPage() {
  return (
    <ChartPageLayout title="PESTLE Analysis" description="A framework to analyze and monitor the macro-environmental factors that may have a profound impact on an organization's performance." category="bi" code={codeExample}>
      <PestleAnalysisCard 
        title="Macro-Environmental Analysis" 
        description="PESTLE framework evaluating external factors impacting our 5-year strategy."
        data={sampleData} 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
