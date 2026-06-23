import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { HeatmapChart } from '@aibyters/charts-ds';

const variables = ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'];
const sampleData = [];
for (let i = 0; i < variables.length; i++) {
  for (let j = 0; j < variables.length; j++) {
    let value;
    if (i === j) {
      value = 1;
    } else {
      value = Math.max(0, Math.min(1, Math.random() * 0.8 + 0.1));
    }
    sampleData.push({ x: variables[i], y: variables[j], value });
  }
}

const codeExample = `import { HeatmapChart } from "@aibyters/charts-ds";

<HeatmapChart
  title="Feature Correlation Matrix"
  data={data}
  colorScale={{ min: "#eff6ff", max: "#1d4ed8" }}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'Array<{ x: string; y: string; value: number }>', required: true, default: '-', description: 'Data points with x, y, and value' },
  { name: 'colorScale', type: '{ min: string; max: string }', required: false, default: '{ min: "#eff6ff", max: "#1d4ed8" }', description: 'Color interpolation scale' },
];

export default function HeatmapChartPage() {
  return (
    <ChartPageLayout
      title="Heatmap Chart"
      description="Visualizes 2D data where values are represented by colors, useful for correlation matrices."
      category="ds"
      code={codeExample}
    >
      <HeatmapChart 
        title="Feature Correlation Matrix" 
        data={sampleData} 
        colorScale={{ min: "#eff6ff", max: "#1d4ed8" }}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
