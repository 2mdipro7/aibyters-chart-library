import React, { useMemo } from 'react';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber } from '@aibyters/spec';

export interface MatrixTableProps {
  title: string;
  description?: string;
  data: any[];
  rowKey: string;
  columns: Array<{ key: string; header: string }>;
  colorScale?: { min: string; max: string };
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function MatrixTable({
  title,
  description,
  data,
  rowKey,
  columns,
  colorScale,
  valueFormatter = formatCompactNumber,
  className
}: MatrixTableProps) {

  const minMax = useMemo(() => {
    if (!colorScale) return { min: 0, max: 0 };
    let min = Infinity;
    let max = -Infinity;
    data.forEach(row => {
      columns.forEach(col => {
        if (col.key !== rowKey) {
          const val = row[col.key];
          if (typeof val === 'number') {
            if (val < min) min = val;
            if (val > max) max = val;
          }
        }
      });
    });
    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 0 : max };
  }, [data, columns, rowKey, colorScale]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const getCellColor = (val: any) => {
    if (!colorScale || typeof val !== 'number') return undefined;
    const { min, max } = minMax;
    if (max === min) return colorScale.min;
    
    const ratio = (val - min) / (max - min);
    const minRgb = hexToRgb(colorScale.min);
    const maxRgb = hexToRgb(colorScale.max);
    
    const r = Math.round(minRgb.r + ratio * (maxRgb.r - minRgb.r));
    const g = Math.round(minRgb.g + ratio * (maxRgb.g - minRgb.g));
    const b = Math.round(minRgb.b + ratio * (maxRgb.b - minRgb.b));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key} style={{ padding: '12px 16px', borderBottom: '1px solid var(--vi-color-surface-border)', color: 'var(--vi-color-text-secondary)', fontWeight: 500, fontSize: 14 }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row[rowKey] || rowIdx} style={{ borderBottom: '1px solid var(--vi-color-surface-border)' }}>
                {columns.map((col) => {
                  const val = row[col.key];
                  const isRowKey = col.key === rowKey;
                  const bgColor = !isRowKey ? getCellColor(val) : undefined;
                  
                  return (
                    <td key={col.key} style={{ 
                      padding: '12px 16px', 
                      fontSize: 14, 
                      color: bgColor ? '#fff' : 'var(--vi-color-text-primary)',
                      backgroundColor: bgColor,
                      fontWeight: isRowKey ? 500 : 400
                    }}>
                      {isRowKey ? val : (typeof val === 'number' ? valueFormatter(val) : val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
