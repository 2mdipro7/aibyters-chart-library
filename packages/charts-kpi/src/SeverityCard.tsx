import React from 'react';
import { WidgetCard } from '@aibyters/layout';

export interface SeverityCardProps {
  title: string;
  status: 'critical' | 'warning' | 'info' | 'success';
  message: string;
  description?: string;
  className?: string;
}

export function SeverityCard({
  title,
  status,
  message,
  description,
  className,
}: SeverityCardProps) {
  const statusColors = {
    critical: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    success: '#22c55e',
  };
  
  const color = statusColors[status];

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '8px' }}>
        <div style={{ 
          width: '16px', 
          height: '16px', 
          borderRadius: '50%', 
          backgroundColor: color,
          flexShrink: 0,
          marginTop: '4px'
        }} />
        <div style={{ color: 'var(--vi-color-text-primary)', fontSize: '16px', lineHeight: '1.5' }}>
          {message}
        </div>
      </div>
    </WidgetCard>
  );
}
