import React from 'react';
import { WidgetCard } from '@aibyters/layout';
import { formatPercent } from '@aibyters/spec';

export interface ProgressCardProps {
  title: string;
  value: number;
  max: number;
  type?: 'circular' | 'linear';
  color?: string;
  description?: string;
  className?: string;
}

export function ProgressCard({
  title,
  value,
  max,
  type = 'linear',
  color = '#6366f1',
  description,
  className,
}: ProgressCardProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const formattedPercent = formatPercent(percentage / 100);

  return (
    <WidgetCard title={title} description={description} className={className}>
      {type === 'linear' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--vi-color-text-primary)', fontWeight: 500 }}>
              {value} / {max}
            </span>
            <span style={{ color: 'var(--vi-color-text-secondary)' }}>
              {formattedPercent}
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--vi-color-surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--vi-color-surface-border)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--vi-color-text-primary)' }}>
                {formattedPercent}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--vi-color-text-secondary)' }}>
                {value} / {max}
              </span>
            </div>
          </div>
        </div>
      )}
    </WidgetCard>
  );
}
