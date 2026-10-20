import React from 'react';
import { MetricStrip, SparklineCard } from '@aibyters/charts-kpi';
import { WaterfallChart, ComboChart, DonutChart, RankedBarChart, BulletChart, DataTable, StackedAreaChart, GaugeChart } from '@aibyters/charts-bi';
import { ForecastBand } from '@aibyters/charts-ds';
import { DashboardLayout, Cell, MONTHS, rng, usd, pct0 } from './DashboardLayout';

const r = rng(7);
const monthly = MONTHS.map((m, i) => {
  const revenue = 4.1e6 + i * 180000 + r() * 250000;
  const cogs = revenue * (0.52 + r() * 0.04);
  const opex = 1.1e6 + r() * 120000;
  return { month: m, revenue, cogs, opex, margin: ((revenue - cogs) / revenue) * 100, ebitda: revenue - cogs - opex };
});
const cash = MONTHS.map((m, i) => {
  const actual = i < 8 ? 12e6 + i * 450000 + (r() - 0.5) * 600000 : null;
  const forecast = 12e6 + i * 430000;
  return { month: m, actual, forecast, lower: forecast - 400000 - i * 120000, upper: forecast + 400000 + i * 120000 };
});
const ytd = monthly.reduce((a, m) => ({ revenue: a.revenue + m.revenue, ebitda: a.ebitda + m.ebitda, cogs: a.cogs + m.cogs }), { revenue: 0, ebitda: 0, cogs: 0 });

export default function ExecutiveFinance() {
  return (
    <DashboardLayout
      title="Executive Finance"
      audience="CFO / Board"
      description="Year-to-date P&L health, cash runway and budget discipline in one screen. Mixes KPI tiles, a P&L bridge, dual-axis trend, composition, ranking, forecasting with confidence bands and budget bullets."
      visuals={['Metric strip', 'Waterfall', 'Combo (dual axis)', 'Donut', 'Ranked bars', 'Forecast band', 'Bullet', 'Stacked area', 'Gauge', 'Sparkline', 'Data table']}
    >
      <Cell span={4}>
        <MetricStrip
          title="Year to date"
          items={[
            { label: 'Revenue', value: ytd.revenue, format: 'currency', delta: 0.112, sub: 'vs prior year' },
            { label: 'Gross margin', value: 1 - ytd.cogs / ytd.revenue, format: 'percent', delta: 0.014, tone: 'positive' },
            { label: 'EBITDA', value: ytd.ebitda, format: 'currency', delta: 0.087 },
            { label: 'Cash on hand', value: 15.6e6, format: 'currency', delta: -0.021, tone: 'warning', sub: '14.2 months runway' },
            { label: 'DSO', value: 41, format: 'number', delta: -0.05, sub: 'days' },
          ]}
        />
      </Cell>
      <Cell span={2}>
        <WaterfallChart
          title="P&L bridge (YTD)"
          description="From revenue to EBITDA"
          valueFormatter={usd}
          data={[
            { name: 'Revenue', value: ytd.revenue },
            { name: 'COGS', value: -ytd.cogs },
            { name: 'Opex', value: -(ytd.revenue - ytd.cogs - ytd.ebitda) },
            { name: 'EBITDA', value: ytd.ebitda, isTotal: true },
          ]}
        />
      </Cell>
      <Cell span={2}>
        <ComboChart title="Revenue and gross margin" description="Bars: revenue · Line: margin % (right axis)" data={monthly} index="month" barCategories={['revenue']} lineCategories={['margin']} seriesLabels={{ revenue: 'Revenue', margin: 'Gross margin %' }} valueFormatter={usd} secondaryAxis secondaryFormatter={pct0} />
      </Cell>
      <Cell>
        <DonutChart title="Revenue by segment" data={[{ s: 'Enterprise', v: 22.4 }, { s: 'Mid-market', v: 14.1 }, { s: 'SMB', v: 8.7 }, { s: 'Services', v: 4.2 }, { s: 'Other', v: 1.1 }]} dataKey="v" nameKey="s" valueFormatter={(v) => `$${v.toFixed(1)}M`} centerValue="$50.5M" centerLabel="YTD" legend={{ position: 'bottom' }} />
      </Cell>
      <Cell>
        <RankedBarChart title="Largest cost centres" valueFormatter={usd} highlightTop={2} data={[{ name: 'Engineering', value: 6.2e6, meta: '41% of opex' }, { name: 'Sales & marketing', value: 4.9e6, meta: '32%' }, { name: 'G&A', value: 2.1e6 }, { name: 'Customer success', value: 1.4e6 }, { name: 'Facilities', value: 0.6e6 }]} />
      </Cell>
      <Cell span={2}>
        <ForecastBand title="Cash forecast" description="Actuals to date, 90% confidence band on forecast" data={cash} index="month" actualKey="actual" forecastKey="forecast" lowerBandKey="lower" upperBandKey="upper" valueFormatter={usd} />
      </Cell>
      <Cell span={2}>
        <BulletChart
          title="Budget vs actual by department"
          description="Bar: actual · Tick: budget · Shades: 70 / 90 / 110% of budget"
          valueFormatter={usd}
          rows={[
            { label: 'Engineering', actual: 6.2e6, target: 6.0e6, ranges: [4.2e6, 5.4e6, 6.6e6] },
            { label: 'Sales', actual: 4.9e6, target: 5.4e6, ranges: [3.8e6, 4.9e6, 5.9e6] },
            { label: 'G&A', actual: 2.1e6, target: 2.0e6, ranges: [1.4e6, 1.8e6, 2.2e6] },
            { label: 'Success', actual: 1.4e6, target: 1.6e6, ranges: [1.1e6, 1.4e6, 1.8e6] },
          ]}
        />
      </Cell>
      <Cell>
        <GaugeChart title="Budget consumed" value={68} max={100} caption="of annual budget · month 8 of 12" valueFormatter={pct0} bands={[{ to: 60, color: 'var(--vi-color-positive-main)' }, { to: 75, color: 'var(--vi-color-warning-main)' }, { to: 100, color: 'var(--vi-color-critical-main)' }]} target={67} />
      </Cell>
      <Cell>
        <SparklineCard title="Operating cash flow" value={1.9e6} format="currency" data={[1.2, 1.4, 1.1, 1.6, 1.7, 1.5, 1.8, 1.9].map((v) => v * 1e6)} />
      </Cell>
      <Cell span={2}>
        <StackedAreaChart title="Opex composition" data={monthly.map((m, i) => ({ month: m.month, People: 720000 + i * 9000, Cloud: 180000 + i * 6000, Marketing: 140000 + (i % 3) * 25000, Other: 90000 }))} index="month" categories={['People', 'Cloud', 'Marketing', 'Other']} valueFormatter={usd} />
      </Cell>
      <Cell span={4}>
        <DataTable
          title="Variance to budget"
          data={[
            { line: 'Revenue', budget: 48.2e6, actual: 50.5e6 },
            { line: 'COGS', budget: 25.1e6, actual: 26.9e6 },
            { line: 'Engineering', budget: 6.0e6, actual: 6.2e6 },
            { line: 'Sales & marketing', budget: 5.4e6, actual: 4.9e6 },
            { line: 'G&A', budget: 2.0e6, actual: 2.1e6 },
          ].map((x) => ({ ...x, variance: x.actual - x.budget, variance_pct: (x.actual - x.budget) / x.budget }))}
          columns={[
            { key: 'line', header: 'Line item' },
            { key: 'budget', header: 'Budget', type: 'number', format: (v) => usd(v) },
            { key: 'actual', header: 'Actual', type: 'number', format: (v) => usd(v) },
            { key: 'variance', header: 'Variance', type: 'number', format: (v) => <span style={{ color: v >= 0 ? 'var(--vi-color-positive-main)' : 'var(--vi-color-critical-main)' }}>{v >= 0 ? '+' : ''}{usd(v)}</span> },
            { key: 'variance_pct', header: 'Var %', type: 'number', format: (v) => `${(v * 100).toFixed(1)}%` },
          ]}
          dense
        />
      </Cell>
    </DashboardLayout>
  );
}
