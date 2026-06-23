import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { DataTable } from '@aibyters/charts-bi';
import { formatCurrency, formatPercent } from '@aibyters/spec';

const sampleData = [
  { id: 1, name: 'John Doe', department: 'Sales', revenue: 150000, quota: 0.85 },
  { id: 2, name: 'Jane Smith', department: 'Marketing', revenue: 120000, quota: 1.10 },
  { id: 3, name: 'Bob Johnson', department: 'Sales', revenue: 95000, quota: 0.90 },
  { id: 4, name: 'Alice Williams', department: 'Engineering', revenue: 0, quota: 0 },
];

const columns = [
  { key: 'name', header: 'Employee' },
  { key: 'department', header: 'Department' },
  { key: 'revenue', header: 'Revenue', formatter: formatCurrency },
  { key: 'quota', header: 'Quota Attainment', formatter: formatPercent },
];

const codeExample = `import { DataTable } from "@aibyters/charts-bi";
import { formatCurrency, formatPercent } from "@aibyters/spec";

const data = [
  { id: 1, name: 'John Doe', department: 'Sales', revenue: 150000, quota: 0.85 },
  // ...
];

const columns = [
  { key: 'name', header: 'Employee' },
  { key: 'department', header: 'Department' },
  { key: 'revenue', header: 'Revenue', formatter: formatCurrency },
  { key: 'quota', header: 'Quota Attainment', formatter: formatPercent },
];

<DataTable
  title="Employee Performance"
  description="Q3 Performance metrics by employee"
  data={data}
  columns={columns}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Chart description' },
  { name: 'data', type: 'any[]', required: true, default: '-', description: 'Array of data objects' },
  { name: 'columns', type: 'DataTableColumn[]', required: true, default: '-', description: 'Column definitions {key, header, formatter?}' },
  { name: 'className', type: 'string', required: false, default: '-', description: 'CSS class' },
];

export default function DataTablePage() {
  return (
    <ChartPageLayout title="Data Table" description="Used to display raw tabular data with optional formatting." category="bi" code={codeExample}>
      <DataTable 
        title="Employee Performance" 
        description="Q3 Performance metrics by employee"
        data={sampleData} 
        columns={columns} 
      />
      <div style={{ marginTop: 24 }}><PropsTable data={propsData} /></div>
    </ChartPageLayout>
  );
}
