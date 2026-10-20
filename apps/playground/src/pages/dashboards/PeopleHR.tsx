import React from 'react';
import { MetricStrip } from '@aibyters/charts-kpi';
import { WaffleChart, CompositionBandChart, DumbbellChart, ColumnChart, RadarChart, PolarAreaChart, TimelineChart, RiskMatrixChart, LineChart } from '@aibyters/charts-bi';
import { DashboardLayout, Cell, MONTHS, rng, pct0 } from './DashboardLayout';

const r = rng(42);
const depts = ['Engineering', 'Sales', 'Operations', 'Finance', 'People', 'Marketing'];

export default function PeopleHR() {
  return (
    <DashboardLayout
      title="People & HR"
      audience="CHRO / People ops"
      description="Workforce shape, movement, engagement and talent risk. Mixes waffle, composition band, dumbbell, stacked columns, radar, polar area, timeline and a risk matrix."
      visuals={['Metric strip', 'Waffle', 'Composition band', 'Dumbbell', 'Stacked columns', 'Radar', 'Polar area', 'Timeline', 'Risk matrix', 'Line']}
    >
      <Cell span={4}>
        <MetricStrip title="Workforce" items={[
          { label: 'Headcount', value: 1248, format: 'count', delta: 0.034 },
          { label: 'Attrition (12m)', value: 0.118, format: 'percent', delta: -0.021, tone: 'positive' },
          { label: 'Time to hire', value: 34, format: 'number', sub: 'days', delta: -0.08, tone: 'positive' },
          { label: 'Open roles', value: 57, format: 'count', delta: 0.12, tone: 'warning' },
          { label: 'eNPS', value: 31, format: 'number', delta: 0.15, tone: 'positive' },
        ]} />
      </Cell>
      <Cell span={2}>
        <WaffleChart title="Headcount by department" description="1 cell ≈ 12 people" data={[{ name: 'Engineering', value: 512 }, { name: 'Sales', value: 236 }, { name: 'Operations', value: 198 }, { name: 'Finance', value: 96 }, { name: 'People', value: 48 }, { name: 'Marketing', value: 158 }]} />
      </Cell>
      <Cell span={2}>
        <CompositionBandChart title="Contract mix" data={[{ name: 'Permanent', value: 968 }, { name: 'Contractor', value: 184 }, { name: 'Intern', value: 52 }, { name: 'Part-time', value: 44 }]} />
      </Cell>
      <Cell span={2}>
        <DumbbellChart title="Engagement score by department" description="2025 vs 2026 survey" aLabel="2025" bLabel="2026" valueFormatter={(v) => v.toFixed(0)} data={depts.map((d) => { const a = 58 + r() * 20; return { name: d, a, b: Math.min(95, a + (r() - 0.3) * 14) }; })} />
      </Cell>
      <Cell span={2}>
        <ColumnChart title="Hires and exits" data={MONTHS.map((m, i) => ({ month: m, Hires: Math.round(18 + r() * 14), Exits: Math.round(8 + r() * 10 + (i === 0 ? 8 : 0)) }))} index="month" categories={['Hires', 'Exits']} colors={['var(--vi-color-positive-main)', 'var(--vi-color-critical-main)']} dataLabels={false} />
      </Cell>
      <Cell span={2}>
        <RadarChart title="Engagement dimensions" description="Score out of 100" max={100} data={['Autonomy', 'Growth', 'Recognition', 'Manager', 'Workload', 'Pay'].map((k) => ({ dim: k, Engineering: 55 + r() * 35, Sales: 50 + r() * 40 }))} index="dim" categories={['Engineering', 'Sales']} />
      </Cell>
      <Cell>
        <PolarAreaChart title="Absence by reason (days)" data={[{ name: 'Sick', value: 412 }, { name: 'Parental', value: 290 }, { name: 'Unpaid', value: 86 }, { name: 'Study', value: 64 }, { name: 'Other', value: 48 }]} legend={{ position: 'bottom' }} />
      </Cell>
      <Cell>
        <LineChart title="Attrition trend" data={MONTHS.map((m, i) => ({ month: m, Voluntary: 1.1 - i * 0.03 + r() * 0.2, Involuntary: 0.3 + r() * 0.1 }))} index="month" categories={['Voluntary', 'Involuntary']} valueFormatter={(v) => `${v.toFixed(1)}%`} showDots={false} />
      </Cell>
      <Cell span={2}>
        <TimelineChart title="Hiring plan milestones" events={[{ date: '2026-02-01', label: 'Q1 req approvals', category: 'Plan' }, { date: '2026-03-15', label: 'Campus drive', category: 'Sourcing' }, { date: '2026-05-01', label: 'Engineering cohort start', category: 'Onboarding' }, { date: '2026-07-01', label: 'Mid-year calibration', category: 'Plan' }, { date: '2026-09-10', label: 'Sales kickoff hiring', category: 'Sourcing' }, { date: '2026-11-15', label: 'Budget 2027 headcount', category: 'Plan' }]} />
      </Cell>
      <Cell span={2}>
        <RiskMatrixChart title="Talent risks" data={[{ id: 'r1', name: 'Key-person dependency (Platform)', likelihood: 4, impact: 5 }, { id: 'r2', name: 'Sales attrition H2', likelihood: 3, impact: 4 }, { id: 'r3', name: 'Visa delays', likelihood: 2, impact: 3 }, { id: 'r4', name: 'Pay compression', likelihood: 4, impact: 3 }, { id: 'r5', name: 'Office relocation', likelihood: 1, impact: 2 }]} />
      </Cell>
    </DashboardLayout>
  );
}
