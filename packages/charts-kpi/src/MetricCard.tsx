import React from 'react';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber, formatCurrency, formatPercent } from '@aibyters/spec';

export interface MetricCardProps {
  title: string;
  value: number;
  format?: 'number' | 'currency' | 'percent';
  /** ISO 4217 code used when format is "currency" (default USD). */
  currency?: string;
  /** BCP 47 locale for number grouping (default en-US). */
  locale?: string;
  /** Full control over the displayed text; takes precedence over `format`. */
  valueFormatter?: (value: number) => string;
  description?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  format = 'number',
  currency,
  locale,
  valueFormatter,
  description,
  className = '',
}: MetricCardProps) {
  let formattedValue = value.toString();
  if (valueFormatter) formattedValue = valueFormatter(value);
  else if (format === 'number') formattedValue = formatCompactNumber(value, locale);
  else if (format === 'currency') formattedValue = formatCurrency(value, currency, locale);
  else if (format === 'percent') formattedValue = formatPercent(value, locale);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--vi-color-text-primary)', marginTop: '8px' }}>
        {formattedValue}
      </div>
    </WidgetCard>
  );
}
