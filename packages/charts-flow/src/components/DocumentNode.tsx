import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import type { DocumentNodeData } from '../types';
import './DocumentNode.css';

export function DocumentNode({ data }: NodeProps) {
  const { label, items, variant = 'default' } = data as unknown as DocumentNodeData;

  const className = [
    'flow-document-node',
    variant !== 'default' && `flow-document-node--${variant}`,
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

      <p className="flow-document-node__label">{label}</p>

      {items && items.length > 0 && (
        <ul className="flow-document-node__items">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
