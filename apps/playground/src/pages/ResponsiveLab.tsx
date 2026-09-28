import React from 'react';
import { RankedBarChart, DivergingBarChart, CompositionBandChart, StatusStripChart } from '@aibyters/charts-bi';

const ranked = [
  { name: 'Global Equities Fund', value: 1842300, meta: '18 accounts · 2 breaks' },
  { name: 'Fixed Income Core', value: 1210450, meta: '11 accounts · 0 breaks' },
  { name: 'Emerging Markets Debt', value: 918200, meta: '7 accounts · 5 breaks' },
  { name: 'Private Credit Sleeve', value: 655900, meta: '4 accounts · 1 break' },
  { name: 'Real Assets Portfolio', value: 402100, meta: '6 accounts · 3 breaks' },
];

const diverging = [
  { name: 'US Large Cap', value: 412500 },
  { name: 'European Equities', value: -188200 },
  { name: 'Investment Grade Credit', value: 96400 },
  { name: 'High Yield', value: -245900 },
  { name: 'FX Forwards', value: 302100 },
];

const mix = [
  { name: 'Equities', value: 4820000 },
  { name: 'Fixed income', value: 3110000 },
  { name: 'Alternatives', value: 1275000 },
  { name: 'Cash', value: 640000 },
  { name: 'Derivatives', value: 155000 },
];

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const statuses = ['Reconciled', 'Reconciled', 'Review', 'Reconciled', 'Breach', 'Review', 'Reconciled', 'Reconciled', 'Review', 'Reconciled', 'Breach', 'Review'];
const counts = [4, 2, 17, 3, 42, 11, 0, 1, 9, 2, 27, 12];
const strip = months.map((label, i) => ({ label, status: statuses[i], count: counts[i] }));

const widths: Array<number | string> = [320, 480, 720, '100%'];

function Column({ width }: { width: number | string }) {
  return (
    <div style={{ flex: width === '100%' ? '1 1 320px' : 'none', width, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--vi-color-text-secondary, #64748b)', fontVariantNumeric: 'tabular-nums' }}>
        {typeof width === 'number' ? `${width}px` : 'fluid (100%)'}
      </div>
      <RankedBarChart title="Unreconciled exposure" description="By mandate, USD" data={ranked} highlightTop={2} valueFormatter={(v) => '$' + v.toLocaleString()} />
      <DivergingBarChart title="Valuation differences" description="By asset class" data={diverging} negativeLabel="Portfolio system higher" positiveLabel="Custodian higher" />
      <CompositionBandChart title="Position mix" data={mix} />
      <StatusStripChart title="Month-end status" data={strip} selected="Sep" />
    </div>
  );
}

export default function ResponsiveLab() {
  return (
    <div className="chart-page">
      <div className="chart-page-header">
        <span className="chart-page-badge" style={{ backgroundColor: '#06b6d420', color: '#06b6d4' }}>Lab</span>
        <h1 className="chart-page-title">Responsive Lab</h1>
        <p className="chart-page-description">
          The same four charts rendered in 320px, 480px, 720px and fluid containers. Breakpoints are driven by the
          container width, so this page shows exactly what a phone, a narrow dashboard column and a wide card will get.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 16 }}>
        {widths.map((w) => (
          <Column key={String(w)} width={w} />
        ))}
      </div>
    </div>
  );
}
