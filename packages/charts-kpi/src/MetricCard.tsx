import React from 'react';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber, formatCurrency, formatPercent } from '@aibyters/spec';

export interface MetricCardProps {
  title: string;
  value: number;
  format?: 'number' | 'currency' | 'percent';
  description?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  format = 'number',
  description,
  className = '',
}: MetricCardProps) {
  let formattedValue = value.toString();
  if (format === 'number') formattedValue = formatCompactNumber(value);
  if (format === 'currency') formattedValue = formatCurrency(value);
  if (format === 'percent') formattedValue = formatPercent(value);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--vi-color-text-primary)', marginTop: '8px' }}>
        {formattedValue}
      </div>
    </WidgetCard>
  );
}
