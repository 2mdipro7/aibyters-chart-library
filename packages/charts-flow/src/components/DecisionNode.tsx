import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import type { DecisionNodeData } from '../types';
import './DecisionNode.css';

export function DecisionNode({ data }: NodeProps) {
  const { label, subtitle, variant = 'default' } = data as DecisionNodeData;

  const className = [
    'flow-decision-node',
    variant !== 'default' && `flow-decision-node--${variant}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Right} id="right-source" />

      <div className="flow-decision-node__content">
        <p className="flow-decision-node__label">{label}</p>
        {subtitle && (
          <p className="flow-decision-node__subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
