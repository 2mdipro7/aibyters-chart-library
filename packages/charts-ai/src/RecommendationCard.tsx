import React from 'react';
import { WidgetCard } from '@aibyters/layout';
import { formatPercent } from '@aibyters/spec';

export interface RecommendationCardProps {
  title: string;
  action: string;
  confidence: number; // 0-1
  impact: 'high' | 'medium' | 'low';
  reason: string;
  description?: string;
  className?: string;
}

export function RecommendationCard({
  title,
  action,
  confidence,
  impact,
  reason,
  description,
  className,
}: RecommendationCardProps) {
  const impactColors = {
    high: { bg: '#fee2e2', text: '#ef4444', label: 'High Impact' },
    medium: { bg: '#fef3c7', text: '#f59e0b', label: 'Medium Impact' },
    low: { bg: '#cffafe', text: '#06b6d4', label: 'Low Impact' },
  };
  
  const impactConfig = impactColors[impact];

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ color: 'var(--vi-color-text-primary)', fontSize: '16px', fontWeight: 600, lineHeight: '1.4' }}>
            {action}
          </div>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: impactConfig.bg,
            color: impactConfig.text,
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            marginLeft: '12px'
          }}>
            {impactConfig.label}
          </span>
        </div>
        
        <div style={{ color: 'var(--vi-color-text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
          {reason}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--vi-color-text-secondary)', fontSize: '12px', fontWeight: 500 }}>
              AI Confidence
            </span>
            <span style={{ color: 'var(--vi-color-text-primary)', fontSize: '12px', fontWeight: 600 }}>
              {formatPercent(confidence)}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--vi-color-surface-border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${confidence * 100}%`, height: '100%', backgroundColor: '#6366f1' }} />
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
