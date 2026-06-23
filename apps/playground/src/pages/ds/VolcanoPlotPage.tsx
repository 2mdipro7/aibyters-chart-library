import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { VolcanoPlot } from '@aibyters/charts-ds';

// Generate some random simulated transcriptomics data
const sampleData = Array.from({ length: 1500 }).map((_, i) => {
  // Normally distributed fold change
  const x = (Math.random() - 0.5) * 6;
  // P-value correlates roughly with extreme fold changes, but with noise
  const yBase = Math.abs(x) * 0.8 + Math.random() * 2;
  const y = yBase < 0 ? 0 : yBase;
  
  return {
    id: `GENE_${i}`,
    name: `Gene ${i}`,
    x,
    y
  };
});

const codeExample = `import { VolcanoPlot } from "@aibyters/charts-ds";

<VolcanoPlot
  title="Differential Expression Analysis"
  description="Volcano plot of PDAC vs Normal"
  data={data}
  pThreshold={1.3}
  fcThreshold={1.0}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'data', type: 'Array<{ id, x, y, name? }>', required: true, default: '-', description: 'Points with Log2FC (x) and -Log10 P-val (y)' },
  { name: 'pThreshold', type: 'number', required: false, default: '1.3', description: 'Y-axis significance threshold' },
  { name: 'fcThreshold', type: 'number', required: false, default: '1.0', description: 'X-axis fold change threshold' },
  { name: 'colors', type: '{ up, down, ns }', required: false, default: 'red, blue, grey', description: 'Colors for point categories' },
];

export default function VolcanoPlotPage() {
  return (
    <ChartPageLayout
      title="Volcano Plot"
      description="Visualizes significance vs fold-change, commonly used for differential expression analysis in bioinformatics."
      category="ds"
      code={codeExample}
    >
      <VolcanoPlot 
        title="Differential Expression Analysis" 
        description="Simulated Volcano plot showing up/down regulated data points" 
        data={sampleData} 
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
