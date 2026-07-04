import type { NodeProps } from '@xyflow/react';

import type { SwimlaneNodeData } from '../types';
import './SwimlaneNode.css';

export function SwimlaneNode({ data }: NodeProps) {
  const { label, subtitle, variant = 'default' } = data as unknown as SwimlaneNodeData;

  const className = [
    'flow-swimlane-node',
    `flow-swimlane-node--${variant}`,
  ].join(' ');

  return (
    <div className={className}>
      <div className="flow-swimlane-node__header">
        <div className="flow-swimlane-node__label-wrap">
          <p className="flow-swimlane-node__label">{label}</p>
          {subtitle && (
            <p className="flow-swimlane-node__subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flow-swimlane-node__body" />
    </div>
  );
}
