import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { SWOTAnalysisCard } from '@aibyters/charts-bi';

const sampleData = {
  strengths: [
    "Strong brand reputation and recognition",
    "High profit margins and robust cash flow",
    "Proprietary technology patents",
    "Loyal customer base with high retention"
  ],
  weaknesses: [
    "Over-reliance on a single flagship product",
    "High pricing compared to competitors",
    "Slow iteration cycles on new features"
  ],
  opportunities: [
    "Expansion into emerging markets (APAC, LATAM)",
    "Strategic acquisitions of AI startups",
    "Growing demand for enterprise solutions"
  ],
  threats: [
    "Increasing regulatory scrutiny on data privacy",
    "Aggressive pricing strategies from new entrants",
    "Supply chain disruptions in semiconductor manufacturing"
  ]
};

const codeExample = `import { SWOTAnalysisCard } from "@aibyters/charts-bi";

const data = {
  strengths: ["Strong brand reputation", "High profit margins"],
  weaknesses: ["High pricing", "Slow iteration cycles"],
  opportunities: ["Expansion into APAC", "AI integrations"],
  threats: ["Regulatory scrutiny", "Supply chain disruptions"]
};

<SWOTAnalysisCard
  title="Q3 2024 SWOT Analysis"
  description="Strategic review of our current market position."
  data={data}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Card heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Card description' },
  { name: 'data', type: '{strengths: string[], weaknesses: string[], opportunities: string[], threats: string[]}', required: true, default: '-', description: 'The 4 quadrants of SWOT' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function SWOTAnalysisPage() {
  return (
    <ChartPageLayout title="SWOT Analysis" description="A 2x2 grid framework used to evaluate a company's competitive position and to develop strategic planning." category="bi" code={codeExample}>
      <SWOTAnalysisCard 
        title="Q3 2024 SWOT Analysis" 
        description="Strategic review of our current market position."
        data={sampleData} 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
