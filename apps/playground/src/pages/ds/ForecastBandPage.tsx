import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { ForecastBand } from '@aibyters/charts-ds';

const sampleData = [
  { date: 'Jan', actual: 400, forecast: 420, lower: 380, upper: 460 },
  { date: 'Feb', actual: 300, forecast: 310, lower: 280, upper: 340 },
  { date: 'Mar', actual: 550, forecast: 500, lower: 450, upper: 550 },
  { date: 'Apr', actual: 480, forecast: 490, lower: 440, upper: 540 },
  { date: 'May', actual: null, forecast: 600, lower: 540, upper: 660 },
  { date: 'Jun', actual: null, forecast: 650, lower: 580, upper: 720 },
];

const codeExample = `import { ForecastBand } from "@aibyters/charts-ds";

<ForecastBand
  title="Sales Forecast"
  data={data}
  index="date"
  actualKey="actual"
  forecastKey="forecast"
  lowerBandKey="lower"
  upperBandKey="upper"
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Data points' },
  { name: 'index', type: 'string', required: true, default: '-', description: 'X-axis data key' },
  { name: 'actualKey', type: 'string', required: true, default: '-', description: 'Key for actual values' },
  { name: 'forecastKey', type: 'string', required: true, default: '-', description: 'Key for forecasted values' },
  { name: 'lowerBandKey', type: 'string', required: true, default: '-', description: 'Key for lower bound of forecast band' },
  { name: 'upperBandKey', type: 'string', required: true, default: '-', description: 'Key for upper bound of forecast band' },
];

export default function ForecastBandPage() {
  return (
    <ChartPageLayout
      title="Forecast Band"
      description="Visualizes historical actuals alongside future predictions with a confidence interval band."
      category="ds"
      code={codeExample}
    >
      <ForecastBand 
        title="Sales Forecast" 
        data={sampleData} 
        index="date"
        actualKey="actual"
        forecastKey="forecast"
        lowerBandKey="lower"
        upperBandKey="upper"
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
