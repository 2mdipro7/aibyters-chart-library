import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { TimelineChart } from '@aibyters/charts-bi';

const sampleEvents = [
  { date: '2023-01-15', label: 'Project Kickoff', category: 'Milestone' },
  { date: '2023-03-01', label: 'Alpha Release', category: 'Release', description: 'Internal testing only' },
  { date: '2023-06-15', label: 'Beta Release', category: 'Release', description: 'Public beta' },
  { date: '2023-09-01', label: 'Marketing Campaign', category: 'Marketing' },
  { date: '2023-11-20', label: 'V1.0 Launch', category: 'Milestone', description: 'General availability' }
];

const codeExample = `import { TimelineChart } from "@aibyters/charts-bi";

<TimelineChart
  title="Product Roadmap"
  description="Key milestones for current year"
  events={events}
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'events', type: 'Array<{ date: string; label: string; category?: string; description?: string }>', required: true, default: '-', description: 'Timeline events' },
  { name: 'colors', type: 'string[]', required: false, default: 'Default palette', description: 'Marker colors based on category' }
];

export default function TimelineChartPage() {
  return (
    <ChartPageLayout
      title="Timeline Chart"
      description="Displays a sequence of events along a horizontal time axis."
      category="bi"
      code={codeExample}
    >
      <TimelineChart 
        title="Product Roadmap" 
        description="Key milestones for current year" 
        events={sampleEvents}
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
