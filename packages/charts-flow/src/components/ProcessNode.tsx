import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import type { ProcessNodeData } from '../types';
import './ProcessNode.css';

export function ProcessNode({ data }: NodeProps) {
  const {
    label,
    subtitle,
    items,
    variant = 'default',
  } = data as ProcessNodeData;

  const className = [
    'flow-process-node',
    variant !== 'default' && `flow-process-node--${variant}`,
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

      <p className="flow-process-node__label">{label}</p>

      {subtitle && (
        <p className="flow-process-node__subtitle">{subtitle}</p>
      )}

      {items && items.length > 0 && (
        <ul className="flow-process-node__items">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
