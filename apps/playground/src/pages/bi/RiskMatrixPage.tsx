import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { RiskMatrixChart } from '@aibyters/charts-bi';

const sampleData: Array<{ id: string; name: string; likelihood: 1|2|3|4|5; impact: 1|2|3|4|5 }> = [
  { id: "R1", name: "Data Breach / Cyber Attack", likelihood: 3, impact: 5 },
  { id: "R2", name: "Supply Chain Disruption", likelihood: 4, impact: 4 },
  { id: "R3", name: "Loss of Key Personnel", likelihood: 2, impact: 3 },
  { id: "R4", name: "Regulatory Compliance Failure", likelihood: 2, impact: 5 },
  { id: "R5", name: "Economic Downturn", likelihood: 4, impact: 3 },
  { id: "R6", name: "New Competitor Entry", likelihood: 5, impact: 2 },
  { id: "R7", name: "Software Bug in Production", likelihood: 5, impact: 1 },
  { id: "R8", name: "Natural Disaster at HQ", likelihood: 1, impact: 5 },
  { id: "R9", name: "Vendor Price Increases", likelihood: 4, impact: 2 },
  { id: "R10", name: "Project Delivery Delay", likelihood: 3, impact: 3 }
];

const codeExample = `import { RiskMatrixChart } from "@aibyters/charts-bi";

const data = [
  { id: "R1", name: "Data Breach", likelihood: 3, impact: 5 },
  { id: "R2", name: "Supply Chain Disruption", likelihood: 4, impact: 4 },
  // likelihood (1-5), impact (1-5)
];

<RiskMatrixChart
  title="Enterprise Risk Assessment"
  description="5x5 matrix evaluating likelihood vs. impact."
  data={data}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'Array<{id, name, likelihood(1-5), impact(1-5)}>', required: true, default: '-', description: 'Array of risks to plot' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function RiskMatrixPage() {
  return (
    <ChartPageLayout title="Risk Matrix" description="A 5x5 matrix used during risk assessment to define the level of risk by considering the category of probability or likelihood against the category of consequence severity." category="bi" code={codeExample}>
      <RiskMatrixChart 
        title="Enterprise Risk Assessment" 
        description="5x5 matrix evaluating likelihood vs. impact across active projects."
        data={sampleData} 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
