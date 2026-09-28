import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  useNodesInitialized,
  useReactFlow,
} from '@xyflow/react';
import type { NodeMouseHandler, Connection, Edge, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ProcessNode } from './components/ProcessNode';
import { DecisionNode } from './components/DecisionNode';
import { SwimlaneNode } from './components/SwimlaneNode';
import { GroupNode } from './components/GroupNode';
import { StartEndNode } from './components/StartEndNode';
import { DocumentNode } from './components/DocumentNode';
import type { FlowChartProps } from './types';
import './FlowChart.css';

/* ------------------------------------------------------------------ */
/*  Register all custom node types                                     */
/* ------------------------------------------------------------------ */

const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  swimlane: SwimlaneNode,
  group: GroupNode,
  startEnd: StartEndNode,
  document: DocumentNode,
} as const;

/* ------------------------------------------------------------------ */
/*  MiniMap colour helpers                                             */
/* ------------------------------------------------------------------ */

const MINIMAP_NODE_COLOR: Record<string, string> = {
  process: '#009B57',
  decision: '#D4A843',
  swimlane: '#DEE4E1',
  group: '#9CA3AF',
  startEnd: '#D4A843',
  document: '#009B57',
};

function minimapNodeColor(node: { type?: string }): string {
  return (node.type && MINIMAP_NODE_COLOR[node.type]) ?? '#DEE4E1';
}

/* ------------------------------------------------------------------ */
/*  FitView helper component                                           */
/* ------------------------------------------------------------------ */

function FitViewOnLoad({ enable }: { enable: boolean }) {
  const nodesInitialized = useNodesInitialized();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (enable && nodesInitialized) {
      // Execute fitView immediately and also after a short delay
      // Animations are removed because state updates might interrupt them
      fitView({ padding: 0.1 });
      
      setTimeout(() => {
        fitView({ padding: 0.1 });
      }, 100);
      
      setTimeout(() => {
        fitView({ padding: 0.1 });
      }, 500);
    }
  }, [enable, nodesInitialized, fitView]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  FlowChart component                                                */
/* ------------------------------------------------------------------ */

export function FlowChart({
  template,
  interactive = true,
  showMinimap = true,
  showControls = true,
  showBackground = true,
  className,
  onNodeClick,
}: FlowChartProps) {
  const [nodes, , onNodesChange] = useNodesState(template.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(template.edges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (!rfInstance) return;

    const handleResize = () => {
      setTimeout(() => {
        rfInstance.fitView({ padding: 0.1, duration: 500 });
      }, 50);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rfInstance]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick],
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge({ ...(params as Connection), type: 'smoothstep', style: { stroke: 'var(--vi-color-surface-border, #4A5F52)', strokeWidth: 2 } } as Edge, eds));
    },
    [setEdges],
  );

  const containerClass = ['flow-chart', className].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        defaultViewport={template.viewport}
        fitView={!template.viewport}
        fitViewOptions={{ padding: 0.1, duration: 500 }}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={interactive}
        nodesConnectable={interactive}
        elementsSelectable={interactive}
        proOptions={{ hideAttribution: true }}
      >
        {showBackground && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#DEE4E1"
          />
        )}

        {showControls && <Controls showInteractive={interactive} />}

        {showMinimap && (
          <MiniMap
            nodeColor={minimapNodeColor}
            maskColor="rgba(3, 72, 30, 0.08)"
            pannable
            zoomable
          />
        )}
        
        <FitViewOnLoad enable={!template.viewport} />
      </ReactFlow>
    </div>
  );
}
