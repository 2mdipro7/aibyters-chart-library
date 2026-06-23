import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { MatrixTable } from '@aibyters/charts-bi';
import { formatCurrency } from '@aibyters/spec';

const sampleData = [
  { region: 'North America', Q1: 150000, Q2: 180000, Q3: 160000, Q4: 200000 },
  { region: 'Europe', Q1: 120000, Q2: 110000, Q3: 130000, Q4: 150000 },
  { region: 'Asia Pacific', Q1: 90000, Q2: 105000, Q3: 115000, Q4: 130000 },
  { region: 'Latin America', Q1: 40000, Q2: 45000, Q3: 42000, Q4: 50000 },
];

const columns = [
  { key: 'region', header: 'Region' },
  { key: 'Q1', header: 'Q1 Sales' },
  { key: 'Q2', header: 'Q2 Sales' },
  { key: 'Q3', header: 'Q3 Sales' },
  { key: 'Q4', header: 'Q4 Sales' },
];

const codeExample = `import { MatrixTable } from "@aibyters/charts-bi";
import { formatCurrency } from "@aibyters/spec";

const data = [
  { region: 'North America', Q1: 150000, Q2: 180000, Q3: 160000, Q4: 200000 },
  // ...
];

const columns = [
  { key: 'region', header: 'Region' },
  { key: 'Q1', header: 'Q1 Sales' },
  // ...
];

<MatrixTable
  title="Regional Sales Matrix"
  description="Quarterly sales performance by region"
  data={data}
  rowKey="region"
  columns={columns}
  colorScale={{ min: '#f1f5f9', max: '#3b82f6' }}
  valueFormatter={formatCurrency}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'rowKey', type: 'string', required: true, default: '-', description: 'Key mapping to the row identifier' },
  { name: 'columns', type: 'Array<{key: string, header: string}>', required: true, default: '-', description: 'Column definitions' },
  { name: 'colorScale', type: '{min: string, max: string}', required: false, default: '-', description: 'Optional heatmap colors' },
  { name: 'valueFormatter', type: '(value: number) => string', required: false, default: 'formatCompactNumber', description: 'Formatter for values' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function MatrixTablePage() {
  return (
    <ChartPageLayout title="Matrix Table" description="Used to display pivot table data with optional heatmap cell coloring." category="bi" code={codeExample}>
      <MatrixTable 
        title="Regional Sales Matrix" 
        description="Quarterly sales performance by region"
        data={sampleData} 
        rowKey="region"
        columns={columns}
        colorScale={{ min: '#f1f5f9', max: '#3b82f6' }}
        valueFormatter={formatCurrency}
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
