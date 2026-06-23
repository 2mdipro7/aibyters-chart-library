import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface BulletChartProps {
  title: string;
  description?: string;
  actual: number;
  target: number;
  ranges: number[]; // e.g. [150, 225, 300] for poor/satisfactory/good
  label?: string;
  className?: string;
}

export function BulletChart({
  title,
  description,
  actual,
  target,
  ranges,
  label,
  ...props
}: BulletChartProps) {
  
  const maxVal = Math.max(...ranges, actual, target);
  
  // Create layered ranges
  const sortedRanges = [...ranges].sort((a, b) => b - a);

  const getPercent = (val: number) => `${(val / maxVal) * 100}%`;

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {label && (
            <div style={{ width: '80px', textAlign: 'right', fontSize: '14px', fontWeight: 500, color: 'var(--vi-color-text-primary)' }}>
              {label}
            </div>
          )}
          
          <div style={{ flex: 1, position: 'relative', height: '40px' }}>
            {/* Background ranges */}
            {sortedRanges.map((range, i) => {
              // Calculate a gray tone based on index. Darker for lower, lighter for higher?
              // Standard bullet chart: dark -> light. We sort descending so first is max.
              const opacity = 0.1 + ((i + 1) / sortedRanges.length) * 0.3;
              return (
                <div
                  key={`range-${i}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: getPercent(range),
                    backgroundColor: `color-mix(in srgb, var(--vi-color-text-secondary) ${opacity * 100}%, transparent)`,
                    borderRadius: i === 0 ? '4px' : '4px 0 0 4px', // rounded corners on the right for max range
                    zIndex: 0
                  }}
                  title={`Range: ${formatCompactNumber(range)}`}
                />
              );
            })}
            
            {/* Actual bar */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: 0,
                height: '16px',
                width: getPercent(actual),
                backgroundColor: 'var(--vi-color-primary)',
                borderRadius: '2px',
                zIndex: 1,
                transition: 'width 0.5s ease-in-out'
              }}
              title={`Actual: ${formatCompactNumber(actual)}`}
            />
            
            {/* Target marker */}
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: getPercent(target),
                height: '32px',
                width: '4px',
                backgroundColor: 'var(--vi-color-text-primary)',
                transform: 'translateX(-50%)',
                zIndex: 2
              }}
              title={`Target: ${formatCompactNumber(target)}`}
            />

            {/* Scale lines */}
            <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', height: '20px', display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--vi-color-text-secondary)' }}>0</span>
              <span style={{ fontSize: '10px', color: 'var(--vi-color-text-secondary)' }}>{formatCompactNumber(maxVal)}</span>
            </div>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
