import React from 'react';
import { MetricStrip } from '@aibyters/charts-kpi';
import { FunnelChart, ParetoChart, SlopeChart, StackedAreaChart, LollipopChart, GaugeChart, StatusStripChart, BarChart, PieChart } from '@aibyters/charts-bi';
import { HeatmapChart } from '@aibyters/charts-ds';
import { DashboardLayout, Cell, MONTHS, rng, usd, pct0 } from './DashboardLayout';

const r = rng(11);
const regions = ['North America', 'EMEA', 'APAC', 'LATAM'];
const products = ['Core', 'Analytics', 'Automation', 'Support plan'];
const reps = ['Priya', 'Marcus', 'Elena', 'Tomas', 'Aiko', 'Daniel', 'Fatima', 'Lukas'];

export default function SalesPipeline() {
  return (
    <DashboardLayout
      title="Sales & Pipeline"
      audience="CRO / Sales leadership"
      description="Pipeline conversion, concentration risk, rep performance and regional momentum. Mixes funnel, Pareto, slope, stacked area, heatmap, lollipop, gauge and status strip."
      visuals={['Metric strip', 'Funnel', 'Pareto', 'Slope', 'Stacked area', 'Heatmap', 'Lollipop', 'Gauge', 'Status strip', 'Horizontal bars', 'Pie']}
    >
      <Cell span={4}>
        <MetricStrip title="Quarter to date" items={[
          { label: 'Bookings', value: 18.4e6, format: 'currency', delta: 0.21 },
          { label: 'Pipeline coverage', value: 3.2, format: 'number', sub: '× of remaining quota', delta: 0.08 },
          { label: 'Win rate', value: 0.284, format: 'percent', delta: -0.012, tone: 'warning' },
          { label: 'Avg deal size', value: 86500, format: 'currency', delta: 0.05 },
          { label: 'Sales cycle', value: 47, format: 'number', sub: 'days', delta: -0.09 },
        ]} />
      </Cell>
      <Cell span={2}>
        <FunnelChart title="Pipeline by stage" description="Open opportunities, value" data={[{ stage: 'Lead', v: 42.0e6 }, { stage: 'Qualified', v: 27.5e6 }, { stage: 'Proposal', v: 15.2e6 }, { stage: 'Negotiation', v: 8.9e6 }, { stage: 'Closed won', v: 5.1e6 }]} dataKey="v" nameKey="stage" valueFormatter={usd} />
      </Cell>
      <Cell span={2}>
        <ParetoChart title="Revenue concentration" description="Customers ranked by bookings; 80% line" valueFormatter={usd} data={['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark', 'Wayne', 'Wonka', 'Vandelay', 'Dunder', 'Others'].map((n, i) => ({ name: n, value: i === 10 ? 2.4e6 : 4.2e6 * Math.pow(0.72, i) }))} />
      </Cell>
      <Cell span={2}>
        <SlopeChart title="Quota attainment by rep" description="Q1 → Q2" startLabel="Q1" endLabel="Q2" valueFormatter={pct0} data={reps.map((n) => { const a = 60 + r() * 60; return { name: n, start: a, end: Math.max(30, a + (r() - 0.45) * 40) }; })} />
      </Cell>
      <Cell span={2}>
        <StackedAreaChart title="Bookings by region" data={MONTHS.slice(0, 9).map((m, i) => ({ month: m, ...Object.fromEntries(regions.map((reg, k) => [reg, (1.2 - k * 0.25) * 1e6 + i * 60000 + r() * 150000])) }))} index="month" categories={regions} valueFormatter={usd} />
      </Cell>
      <Cell span={2}>
        <HeatmapChart title="Win rate: region × product" data={regions.flatMap((reg) => products.map((p) => ({ x: p, y: reg, value: Math.round(15 + r() * 30) })))} valueLabel="win %" valueFormatter={pct0} />
      </Cell>
      <Cell>
        <LollipopChart title="Deals closed by rep" orientation="horizontal" sort="desc" data={reps.map((n) => ({ name: n, value: Math.round(4 + r() * 14) }))} />
      </Cell>
      <Cell>
        <GaugeChart title="Team quota attainment" value={87} max={120} caption="target 100%" valueFormatter={pct0} target={100} bands={[{ to: 70, color: 'var(--vi-color-critical-main)' }, { to: 95, color: 'var(--vi-color-warning-main)' }, { to: 120, color: 'var(--vi-color-positive-main)' }]} />
      </Cell>
      <Cell span={2}>
        <StatusStripChart title="Monthly target status" data={MONTHS.slice(0, 9).map((m, i) => ({ label: m, status: [0, 3, 6].includes(i) ? 'review' : i === 4 ? 'breach' : 'ok', count: Math.round(1.1e6 + i * 90000) }))} countFormatter={(n) => usd(n)} selected="Sep" />
      </Cell>
      <Cell>
        <PieChart title="Lead source" data={[{ s: 'Inbound', v: 38 }, { s: 'Outbound', v: 27 }, { s: 'Partner', v: 19 }, { s: 'Events', v: 11 }, { s: 'Referral', v: 5 }]} dataKey="v" nameKey="s" valueFormatter={pct0} legend={{ position: 'bottom' }} />
      </Cell>
      <Cell>
        <BarChart title="Lost reasons" data={[{ reason: 'Price', n: 31 }, { reason: 'Timing', n: 22 }, { reason: 'Competitor', n: 18 }, { reason: 'No decision', n: 14 }, { reason: 'Feature gap', n: 9 }]} index="reason" categories={['n']} seriesLabels={{ n: 'Lost deals' }} legend={false} colorByCategory />
      </Cell>
    </DashboardLayout>
  );
}
