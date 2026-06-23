import React from 'react';
import { WidgetCard } from '@aibyters/layout';

export interface InsightCardProps {
  title: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  summary: string;
  metric?: string;
  metricValue?: string;
  description?: string;
  className?: string;
}

export function InsightCard({
  title,
  severity,
  summary,
  metric,
  metricValue,
  description,
  className,
}: InsightCardProps) {
  const statusColors = {
    critical: { bg: '#fee2e2', text: '#ef4444', label: 'CRITICAL' },
    warning: { bg: '#fef3c7', text: '#f59e0b', label: 'WARNING' },
    info: { bg: '#cffafe', text: '#06b6d4', label: 'INFO' },
    success: { bg: '#dcfce7', text: '#22c55e', label: 'SUCCESS' },
  };
  
  const statusConfig = statusColors[severity];

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        <div>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: statusConfig.bg,
            color: statusConfig.text,
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            {statusConfig.label}
          </span>
        </div>
        <div style={{ color: 'var(--vi-color-text-primary)', fontSize: '15px', lineHeight: '1.5' }}>
          {summary}
        </div>
        {metric && metricValue && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px', paddingTop: '12px', borderTop: '1px solid var(--vi-color-surface-border)' }}>
            <span style={{ color: 'var(--vi-color-text-secondary)', fontSize: '14px' }}>{metric}:</span>
            <span style={{ color: 'var(--vi-color-text-primary)', fontSize: '16px', fontWeight: 600 }}>{metricValue}</span>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
