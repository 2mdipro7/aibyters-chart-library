import React from 'react';
import { MetricStrip } from '@aibyters/charts-kpi';
import { DonutChart, RankedBarChart, DivergingBarChart, WaffleChart, PairedBarChart, ProgressRingGroup, StatusStripChart, ScatterChart, DataTable, LineChart } from '@aibyters/charts-bi';
import { HeatmapChart } from '@aibyters/charts-ds';
import { DashboardLayout, Cell, rng, usd, pct0 } from './DashboardLayout';

const r = rng(99);
const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const assets = ['Global Equities Fund', 'Fixed Income Core', 'EM Debt', 'Private Credit', 'Real Assets', 'Structured Notes', 'FX Forwards', 'Cash'];

export default function Reconciliation() {
  return (
    <DashboardLayout
      title="Reconciliation & Controls"
      audience="Operations control / Finance"
      description="Two systems, one truth: where valuations agree, where they differ, which source marks higher and what to inspect first. Mixes status donut, ranked bars, diverging bars, waffle, paired bars, priority rings, status strip, scatter, heatmap and a records table."
      visuals={['Metric strip', 'Donut (status)', 'Ranked bars', 'Diverging bars', 'Waffle', 'Paired bars', 'Progress rings', 'Status strip', 'Scatter', 'Heatmap', 'Line', 'Data table']}
    >
      <Cell span={4}>
        <MetricStrip title="Holdings · 30 Sep" items={[
          { label: 'Linked', value: 8999, format: 'count', sub: 'of 8,999' },
          { label: 'Values agree', value: 8404, format: 'count', tone: 'positive', sub: '93.4%' },
          { label: 'Values differ', value: 595, format: 'count', tone: 'warning' },
          { label: 'Absolute gap', value: 12.45e6, format: 'currency', tone: 'negative', delta: -0.08 },
          { label: 'Missing a valuation', value: 61, format: 'count', tone: 'neutral' },
        ]} />
      </Cell>
      <Cell span={2}>
        <DonutChart title="Are the positions reconciled?" data={[{ s: 'Values agree', v: 8404 }, { s: 'Values differ', v: 595 }, { s: 'Custodian missing', v: 38 }, { s: 'Portfolio system missing', v: 23 }]} dataKey="v" nameKey="s" colors={['var(--vi-color-positive-main)', 'var(--vi-color-warning-main)', 'var(--vi-color-critical-main)', 'var(--vi-color-text-muted)']} centerValue="595" centerLabel="need review" legend={{ position: 'right' }} valueFormatter={(v) => v.toLocaleString()} />
      </Cell>
      <Cell span={2}>
        <RankedBarChart title="Which assets account for the gap?" valueFormatter={usd} highlightTop={3} data={assets.map((a, i) => ({ name: a, value: 4.1e6 * Math.pow(0.68, i), meta: `${Math.round(120 * Math.pow(0.7, i))} positions` }))} />
      </Cell>
      <Cell span={2}>
        <DivergingBarChart title="Which source marks higher?" description="Net difference by asset class" valueFormatter={usd} negativeLabel="Custodian higher" positiveLabel="Portfolio system higher" data={[{ name: 'US Large Cap', value: 412500 }, { name: 'European Equities', value: -188200 }, { name: 'IG Credit', value: 96400 }, { name: 'High Yield', value: -245900 }, { name: 'EM Debt', value: 61200 }, { name: 'FX Forwards', value: -32000 }]} />
      </Cell>
      <Cell span={2}>
        <WaffleChart title="Widespread or concentrated?" description="Each cell ≈ 90 holdings" data={[{ name: 'Agree', value: 8404 }, { name: 'Differ < 1%', value: 402 }, { name: 'Differ ≥ 1%', value: 193 }, { name: 'Missing', value: 61 }]} colors={['var(--vi-color-positive-main)', 'var(--vi-color-warning-main)', 'var(--vi-color-critical-main)', 'var(--vi-color-text-muted)']} />
      </Cell>
      <Cell span={2}>
        <PairedBarChart title="Five to inspect first" aLabel="Portfolio system" bLabel="Custodian" valueFormatter={usd} data={[{ name: 'GEF-0931', a: 2.84e6, b: 2.41e6, meta: 'Global Equities Fund' }, { name: 'FIC-1174', a: 1.92e6, b: 2.18e6, meta: 'Fixed Income Core' }, { name: 'EMD-0220', a: 1.31e6, b: 1.11e6 }, { name: 'PCS-0087', a: 0.98e6, b: 1.12e6 }, { name: 'RAP-0412', a: 0.77e6, b: 0.64e6 }]} />
      </Cell>
      <Cell span={2}>
        <ProgressRingGroup title="Where should the team start?" description="Share of the gap by priority tier" valueFormatter={pct0} data={[{ name: 'Tier 1 · > $250K', value: 61, max: 100, amount: '$7.6M · 14 rows' }, { name: 'Tier 2 · $25K–250K', value: 28, max: 100, amount: '$3.5M · 71 rows' }, { name: 'Tier 3 · < $25K', value: 11, max: 100, amount: '$1.4M · 510 rows' }]} />
      </Cell>
      <Cell span={2}>
        <StatusStripChart title="Unmatched rows by month" data={months.map((m, i) => ({ label: m, status: i === 10 ? 'breach' : [2, 5, 11].includes(i) ? 'review' : 'reconciled', count: Math.round(3 + r() * 20 + (i === 10 ? 25 : 0)) }))} selected="Sep" />
      </Cell>
      <Cell span={2}>
        <ScatterChart title="How large are the differences?" description="Position value vs absolute difference" xLabel="Position value" yLabel="Abs. difference" xFormatter={usd} yFormatter={usd} groupKey="tier" data={Array.from({ length: 120 }, () => { const v = 50000 + r() * r() * 5e6; const d = v * (0.002 + r() * r() * 0.08); return { v, d, tier: d > 250000 ? 'Tier 1' : d > 25000 ? 'Tier 2' : 'Tier 3' }; })} xKey="v" yKey="d" />
      </Cell>
      <Cell span={2}>
        <HeatmapChart title="When is the unmatched share highest?" description="Transaction category × month, unmatched %" data={['Trades', 'Corporate actions', 'Cash', 'Fees', 'FX'].flatMap((c) => months.map((m) => ({ x: m, y: c, value: Math.round(r() * 9 + (c === 'Corporate actions' ? 6 : 0)) })))} xOrder={months} valueFormatter={pct0} />
      </Cell>
      <Cell span={2}>
        <LineChart title="Unmatched rate trend" data={months.map((m, i) => ({ month: m, rate: 5.2 - i * 0.25 + r() * 0.8 }))} index="month" categories={['rate']} seriesLabels={{ rate: 'Unmatched %' }} legend={false} valueFormatter={(v) => `${v.toFixed(1)}%`} dataLabels referenceLines={[{ y: 3, label: 'Tolerance 3%' }]} />
      </Cell>
      <Cell span={4}>
        <DataTable title="Holdings records" pageSize={6} data={Array.from({ length: 24 }, (_, i) => { const a = 200000 + r() * 2.5e6; const b = a * (1 + (r() - 0.5) * 0.08); return { id: `HLD-${1000 + i}`, asset: assets[i % assets.length], portfolio: a, custodian: b, diff: a - b, status: Math.abs(a - b) / a < 0.005 ? 'Exact match' : 'Mismatch' }; })} columns={[{ key: 'id', header: 'Row' }, { key: 'asset', header: 'Asset' }, { key: 'portfolio', header: 'Portfolio system', type: 'number', format: (v) => usd(v) }, { key: 'custodian', header: 'Custodian', type: 'number', format: (v) => usd(v) }, { key: 'diff', header: 'Difference', type: 'number', format: (v) => usd(v) }, { key: 'status', header: 'Status' }]} dense />
      </Cell>
    </DashboardLayout>
  );
}
