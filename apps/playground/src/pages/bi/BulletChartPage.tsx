import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable } from '../../components/PropsTable';
import { BulletChart } from '@aibyters/charts-bi';

const codeExample = `import { BulletChart } from "@aibyters/charts-bi";

<BulletChart
  title="Q3 Sales Performance"
  description="Actual vs Target with quality ranges"
  actual={275}
  target={250}
  ranges={[150, 225, 300]}
  label="Revenue (k)"
/>`;

const propsData = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'actual', type: 'number', required: true, default: '-', description: 'Primary metric value' },
  { name: 'target', type: 'number', required: true, default: '-', description: 'Goal or comparative marker' },
  { name: 'ranges', type: 'number[]', required: true, default: '-', description: 'Qualitative ranges (e.g. poor, satisfactory, good)' },
  { name: 'label', type: 'string', required: false, default: '-', description: 'Label for the bullet chart axis' }
];

export default function BulletChartPage() {
  return (
    <ChartPageLayout
      title="Bullet Chart"
      description="A compact variation of a bar chart used for comparing actual performance against a target."
      category="bi"
      code={codeExample}
    >
      <BulletChart 
        title="Q3 Sales Performance" 
        description="Actual vs Target with quality ranges" 
        actual={275}
        target={250}
        ranges={[150, 225, 300]}
        label="Revenue (k)"
      />
      <PropsTable data={propsData} />
    </ChartPageLayout>
  );
}
