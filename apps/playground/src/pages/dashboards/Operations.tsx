import React from 'react';
import { MetricStrip } from '@aibyters/charts-kpi';
import { ProgressRingGroup, DivergingBarChart, TreemapChart, PairedBarChart, ColumnChart, SankeyChart } from '@aibyters/charts-bi';
import { ControlChart, AnomalyTimeline, HistogramChart, BoxPlotChart } from '@aibyters/charts-ds';
import { DashboardLayout, Cell, rng, usd, pct0 } from './DashboardLayout';

const r = rng(23);
const days = Array.from({ length: 30 }, (_, i) => `D${i + 1}`);
const leadTime = days.map((d, i) => ({ day: d, lead: 6.2 + (r() - 0.5) * 1.6 + (i === 17 ? 2.4 : 0) }));
const defects = days.map((d, i) => ({ day: d, rate: 1.4 + (r() - 0.5) * 0.6 + (i === 9 || i === 24 ? 2.1 : 0), anomaly: i === 9 || i === 24 ? 1 : 0 }));

export default function Operations() {
  return (
    <DashboardLayout
      title="Operations & Supply Chain"
      audience="COO / Plant and logistics"
      description="Service levels, process stability and inventory posture. Mixes control chart, anomaly timeline, progress rings, diverging bars, treemap, histogram, box plot, paired bars and Sankey."
      visuals={['Metric strip', 'Control chart', 'Anomaly timeline', 'Progress rings', 'Diverging bars', 'Treemap', 'Histogram', 'Box plot', 'Paired bars', 'Sankey', 'Stacked columns']}
    >
      <Cell span={4}>
        <MetricStrip title="This week" items={[
          { label: 'OTIF', value: 0.943, format: 'percent', delta: 0.012, tone: 'positive' },
          { label: 'Orders shipped', value: 18432, format: 'count', delta: 0.06 },
          { label: 'Inventory value', value: 42.7e6, format: 'currency', delta: 0.03, tone: 'warning' },
          { label: 'Backorders', value: 312, format: 'count', delta: -0.18, tone: 'positive' },
          { label: 'Defect rate', value: 0.0142, format: 'percent', delta: 0.004, tone: 'negative' },
        ]} />
      </Cell>
      <Cell span={2}>
        <ControlChart title="Order lead time (days)" description="Daily mean with 3σ control limits" data={leadTime} index="day" valueKey="lead" mean={6.2} ucl={7.6} lcl={4.8} valueFormatter={(v) => `${v.toFixed(1)}d`} />
      </Cell>
      <Cell span={2}>
        <AnomalyTimeline title="Defect rate with detected spikes" data={defects} index="day" valueKey="rate" anomalyKey="anomaly" valueFormatter={(v) => `${v.toFixed(2)}%`} />
      </Cell>
      <Cell span={2}>
        <ProgressRingGroup title="OTIF by region" valueFormatter={pct0} data={[{ name: 'North', value: 96, max: 100, amount: '4,210 orders' }, { name: 'South', value: 91, max: 100, amount: '3,870 orders' }, { name: 'East', value: 94, max: 100, amount: '5,020 orders' }, { name: 'West', value: 89, max: 100, amount: '5,332 orders' }]} />
      </Cell>
      <Cell span={2}>
        <DivergingBarChart title="Inventory vs target by category" description="Weeks of cover above (+) or below (−) target" valueFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)} wk`} negativeLabel="Below target" positiveLabel="Above target" data={[{ name: 'Raw materials', value: 2.4 }, { name: 'Packaging', value: -1.1 }, { name: 'Finished goods', value: 3.8 }, { name: 'Spares', value: -0.6 }, { name: 'Consumables', value: 0.9 }]} />
      </Cell>
      <Cell span={2}>
        <TreemapChart title="Stock value by warehouse" valueFormatter={usd} data={[{ name: 'Rotterdam', value: 14.2e6 }, { name: 'Dallas', value: 9.8e6 }, { name: 'Singapore', value: 7.1e6 }, { name: 'Pune', value: 5.4e6 }, { name: 'São Paulo', value: 3.3e6 }, { name: 'Lagos', value: 1.6e6 }, { name: 'Other', value: 1.3e6 }]} />
      </Cell>
      <Cell>
        <HistogramChart title="Order cycle time" description="Hours from order to dispatch" data={Array.from({ length: 400 }, () => Math.max(2, 24 + (r() + r() + r() - 1.5) * 14))} bins={14} />
      </Cell>
      <Cell>
        <BoxPlotChart title="Supplier lead times" colorByGroup data={['Alpha', 'Beta', 'Gamma', 'Delta'].map((s, k) => ({ label: s, values: Array.from({ length: 40 }, () => 5 + k * 2 + (r() + r()) * 4) }))} valueFormatter={(v) => `${v.toFixed(0)}d`} />
      </Cell>
      <Cell span={2}>
        <PairedBarChart title="Planned vs actual production" aLabel="Planned" bLabel="Actual" valueFormatter={(v) => `${(v / 1000).toFixed(1)}K`} data={['Line A', 'Line B', 'Line C', 'Line D', 'Line E'].map((n, i) => ({ name: n, a: 42000 - i * 3000, b: 42000 - i * 3000 + (r() - 0.55) * 7000 }))} />
      </Cell>
      <Cell span={2}>
        <SankeyChart title="Material flow (tonnes)" nodes={[{ name: 'Suppliers' }, { name: 'Rotterdam DC' }, { name: 'Dallas DC' }, { name: 'Plants' }, { name: 'Customers' }, { name: 'Returns' }]} links={[{ source: 0, target: 1, value: 820 }, { source: 0, target: 2, value: 610 }, { source: 1, target: 3, value: 540 }, { source: 2, target: 3, value: 390 }, { source: 1, target: 4, value: 280 }, { source: 2, target: 4, value: 220 }, { source: 3, target: 4, value: 900 }, { source: 4, target: 5, value: 60 }]} valueFormatter={(v) => `${v} t`} />
      </Cell>
      <Cell span={2}>
        <ColumnChart title="Shipments by carrier" stacked data={['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((w, i) => ({ week: w, DHL: 2100 + i * 80, FedEx: 1600 + (i % 2) * 200, Maersk: 900 + i * 40, Local: 700 }))} index="week" categories={['DHL', 'FedEx', 'Maersk', 'Local']} dataLabels={false} />
      </Cell>
    </DashboardLayout>
  );
}
