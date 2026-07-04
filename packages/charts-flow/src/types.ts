import type { Node, Edge } from '@xyflow/react';

/* ------------------------------------------------------------------ */
/*  Node data types                                                    */
/* ------------------------------------------------------------------ */

export interface ProcessNodeData {
  label: string;
  subtitle?: string;
  items?: string[];
  variant?: 'default' | 'primary' | 'warning' | 'insight' | 'accent';
  icon?: string;
}

export interface DecisionNodeData {
  label: string;
  subtitle?: string;
  variant?: 'default' | 'warning';
}

export interface SwimlaneNodeData {
  label: string;
  subtitle?: string;
  variant?: 'row1' | 'row2' | 'row3' | 'row4' | 'row5';
}

export interface GroupNodeData {
  label: string;
  subtitle?: string;
  variant?: 'default' | 'loop' | 'parallel';
}

export interface StartEndNodeData {
  label: string;
  variant?: 'start' | 'end' | 'end-negative';
}

export interface DocumentNodeData {
  label: string;
  items?: string[];
  variant?: 'default' | 'primary';
}

/* ------------------------------------------------------------------ */
/*  Enum-like union for all flow node types                            */
/* ------------------------------------------------------------------ */

export type FlowNodeType =
  | 'process'
  | 'decision'
  | 'swimlane'
  | 'group'
  | 'startEnd'
  | 'document';

/* ------------------------------------------------------------------ */
/*  Flow template & chart props                                        */
/* ------------------------------------------------------------------ */

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface FlowChartProps {
  template: FlowTemplate;
  interactive?: boolean;
  showMinimap?: boolean;
  showControls?: boolean;
  showBackground?: boolean;
  className?: string;
  onNodeClick?: (nodeId: string) => void;
}
