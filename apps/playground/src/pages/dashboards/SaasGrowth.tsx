import React from 'react';
import { MetricStrip, SparklineCard, TargetCard } from '@aibyters/charts-kpi';
import { AreaChart, LineChart, RadialBarChart, ParetoChart, CompetitivePositioningChart, SWOTAnalysisCard, BarChart } from '@aibyters/charts-bi';
import { HeatmapChart } from '@aibyters/charts-ds';
import { InsightCard, RecommendationCard } from '@aibyters/charts-ai';
import { DashboardLayout, Cell, MONTHS, rng, usd, pct0 } from './DashboardLayout';

const r = rng(5);
const cohorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function SaasGrowth() {
  return (
    <DashboardLayout
      title="SaaS Growth"
      audience="CEO / Product & Growth"
      description="Recurring revenue movements, retention, activation and strategic positioning. Mixes stacked area, line, radial bars, Pareto, cohort heatmap, 2×2 positioning, SWOT and AI insight cards."
      visuals={['Metric strip', 'Stacked area', 'Line', 'Radial bars', 'Pareto', 'Cohort heatmap', 'Competitive 2×2', 'SWOT', 'Sparkline', 'Target', 'Insight', 'Recommendation']}
    >
      <Cell span={4}>
        <MetricStrip title="This month" items={[
          { label: 'MRR', value: 2.84e6, format: 'currency', delta: 0.046 },
          { label: 'Net revenue retention', value: 1.12, format: 'percent', delta: 0.02, tone: 'positive' },
          { label: 'Logo churn', value: 0.013, format: 'percent', delta: -0.002, tone: 'positive' },
          { label: 'CAC payback', value: 14, format: 'number', sub: 'months', delta: -0.07 },
          { label: 'Active accounts', value: 3182, format: 'count', delta: 0.031 },
        ]} />
      </Cell>
      <Cell span={2}>
        <AreaChart title="MRR movements" description="Stacked: new, expansion, contraction, churn" stacked fillOpacity={0.7} data={MONTHS.map((m, i) => ({ month: m, New: 90000 + r() * 30000, Expansion: 60000 + i * 4000, Contraction: -(15000 + r() * 8000), Churn: -(25000 + r() * 12000) }))} index="month" categories={['New', 'Expansion', 'Contraction', 'Churn']} colors={['var(--vi-color-chart-0)', 'var(--vi-color-positive-main)', 'var(--vi-color-warning-main)', 'var(--vi-color-critical-main)']} valueFormatter={usd} />
      </Cell>
      <Cell span={2}>
        <LineChart title="Daily vs weekly active users" data={Array.from({ length: 16 }, (_, i) => ({ week: `W${i + 1}`, DAU: 18000 + i * 600 + r() * 1500, WAU: 52000 + i * 1400 + r() * 3000 }))} index="week" categories={['DAU', 'WAU']} valueFormatter={(v) => `${(v / 1000).toFixed(0)}K`} showDots={false} />
      </Cell>
      <Cell>
        <RadialBarChart title="Activation funnel" description="% of sign-ups reaching each step" data={[{ step: 'Signed up', v: 100 }, { step: 'Connected data', v: 71 }, { step: 'First dashboard', v: 52 }, { step: 'Invited team', v: 34 }, { step: 'Converted', v: 19 }]} dataKey="v" nameKey="step" max={100} valueFormatter={pct0} legend={{ position: 'bottom' }} />
      </Cell>
      <Cell span={2}>
        <ParetoChart title="Feature usage" description="Weekly active users per feature" barLabel="Users" data={['Dashboards', 'Alerts', 'Exports', 'Sharing', 'API', 'Mobile', 'Comments', 'Templates', 'SSO'].map((n, i) => ({ name: n, value: Math.round(42000 * Math.pow(0.68, i)) }))} valueFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
      </Cell>
      <Cell>
        <TargetCard title="ARR target" value={34.1e6} target={40e6} format="currency" />
      </Cell>
      <Cell span={2}>
        <HeatmapChart title="Retention cohorts" description="% of cohort still active after N months" data={cohorts.flatMap((c, ci) => Array.from({ length: 6 - ci }, (_, m) => ({ y: c, x: `M${m}`, value: Math.round(100 * Math.pow(0.9 - ci * 0.01, m)) })))} yOrder={cohorts} xOrder={['M0', 'M1', 'M2', 'M3', 'M4', 'M5']} valueFormatter={pct0} />
      </Cell>
      <Cell span={2}>
        <CompetitivePositioningChart title="Competitive positioning" xAxisLabel="Ease of adoption" yAxisLabel="Depth of analytics" data={[{ name: 'Us', x: 78, y: 72, z: 60 }, { name: 'Legacy BI', x: 30, y: 85, z: 90 }, { name: 'Spreadsheet add-on', x: 88, y: 28, z: 40 }, { name: 'Niche startup', x: 60, y: 45, z: 25 }, { name: 'Suite vendor', x: 45, y: 65, z: 110 }]} quadrantLabels={{ topLeft: 'Powerful, hard', topRight: 'Leaders', bottomLeft: 'Laggards', bottomRight: 'Easy, shallow' }} />
      </Cell>
      <Cell span={2}>
        <SWOTAnalysisCard title="Strategic review Q3" data={{ strengths: ['Fastest time-to-dashboard in category', 'NRR 112%'], weaknesses: ['Mobile usage 11% of WAU', 'Single-region hosting'], opportunities: ['Embedded analytics for ERP vendors', 'Marketplace distribution'], threats: ['Suite vendor bundling', 'AI-native entrants'] }} />
      </Cell>
      <Cell>
        <SparklineCard title="Trial → paid conversion" value={0.19} format="percent" data={[0.14, 0.15, 0.15, 0.17, 0.16, 0.18, 0.19]} />
      </Cell>
      <Cell>
        <BarChart title="Churn reasons (last 90 days)" data={[{ reason: 'Budget cut', n: 21 }, { reason: 'Low usage', n: 17 }, { reason: 'Missing feature', n: 12 }, { reason: 'Switched vendor', n: 8 }, { reason: 'Company closed', n: 4 }]} index="reason" categories={['n']} seriesLabels={{ n: 'Accounts' }} legend={false} colorByCategory />
      </Cell>
      <Cell>
        <InsightCard title="AI insight" severity="warning" summary="Expansion is concentrated: 62% of expansion MRR this quarter came from 14 Enterprise accounts." metric="Non-enterprise expansion" metricValue="−9% QoQ" />
      </Cell>
      <Cell>
        <RecommendationCard title="AI recommendation" action="Launch a usage-based add-on for Mid-market" impact="high" confidence={0.74} reason="Mid-market accounts hit plan limits 3.1× more often than Enterprise but expand 40% less; a metered add-on removes the sales-assisted step." />
      </Cell>
    </DashboardLayout>
  );
}
