import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { RefreshCw } from 'lucide-react';
import type { GroupNodeData } from '../types';
import './GroupNode.css';

const BADGE_LABELS: Record<string, string> = {
  default: 'Group',
  loop: 'Loop',
  parallel: 'Parallel',
};

export function GroupNode({ data }: NodeProps) {
  const { label, subtitle, variant = 'default' } = data as unknown as GroupNodeData;

  const className = [
    'flow-group-node',
    variant !== 'default' && `flow-group-node--${variant}`,
  ]
    .filter(Boolean)
    .join(' ');

  const badgeLabel = label || BADGE_LABELS[variant] || 'Group';

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

      <div className="flow-group-node__badge">
        {variant === 'loop' && <RefreshCw className="flow-group-node__loop-icon" />}
        {badgeLabel}
      </div>
      {subtitle && <p className="flow-group-node__subtitle">{subtitle}</p>}
    </div>
  );
}
