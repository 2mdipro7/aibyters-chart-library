import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import type { StartEndNodeData } from '../types';
import './StartEndNode.css';

export function StartEndNode({ data }: NodeProps) {
  const { label, variant = 'default' } = data as unknown as StartEndNodeData;

  const className = [
    'flow-start-end-node',
    `flow-start-end-node--${variant}`,
  ].join(' ');

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

      <p className="flow-start-end-node__label">{label}</p>
    </div>
  );
}
