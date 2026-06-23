import React from "react";
import { WidgetCard } from "@aibyters/layout";

export interface DataTableColumn {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  title: string;
  description?: string;
  data: any[];
  columns: DataTableColumn[];
  className?: string;
}

export function DataTable({
  title,
  description,
  data,
  columns,
  className
}: DataTableProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--vi-color-text-primary)]">
          <thead className="text-xs text-[var(--vi-color-text-secondary)] uppercase bg-[var(--vi-color-surface-background)] border-b border-[var(--vi-color-surface-borderLight)]">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  scope="col" 
                  className={`px-6 py-3 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr 
                key={i} 
                className={`border-b border-[var(--vi-color-surface-borderLight)] hover:bg-[var(--vi-color-surface-cardHover)] transition-colors`}
              >
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-6 py-4 whitespace-nowrap ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-[var(--vi-color-text-secondary)]">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
