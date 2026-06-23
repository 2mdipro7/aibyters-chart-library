import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { CandlestickChart } from '@aibyters/charts-ds';

const sampleData = [
  { date: '2023-01-01', open: 150, high: 155, low: 148, close: 152 },
  { date: '2023-01-02', open: 152, high: 160, low: 150, close: 158 },
  { date: '2023-01-03', open: 158, high: 159, low: 154, close: 155 },
  { date: '2023-01-04', open: 155, high: 157, low: 145, close: 146 },
  { date: '2023-01-05', open: 146, high: 150, low: 144, close: 149 },
  { date: '2023-01-06', open: 149, high: 162, low: 148, close: 160 },
  { date: '2023-01-07', open: 160, high: 165, low: 158, close: 164 },
];

const codeExample = `import { CandlestickChart } from "@aibyters/charts-ds";

<CandlestickChart
  title="Stock Price History"
  data={data}
  colors={{ up: "#22c55e", down: "#ef4444" }}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'data', type: 'Array<{ date: string; open: number; high: number; low: number; close: number }>', required: true, default: '-', description: 'OHLC data points' },
  { name: 'colors', type: '{ up: string; down: string }', required: false, default: '{ up: "#22c55e", down: "#ef4444" }', description: 'Colors for up and down days' },
];

export default function CandlestickChartPage() {
  return (
    <ChartPageLayout
      title="Candlestick Chart"
      description="Used to describe price movements of a security, derivative, or currency over time."
      category="ds"
      code={codeExample}
    >
      <CandlestickChart 
        title="Stock Price History (Daily)" 
        data={sampleData} 
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
