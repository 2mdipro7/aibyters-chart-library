import type { Node, Edge } from '@xyflow/react';
import type { FlowTemplate } from '../types';
import { MarkerType } from '@xyflow/react';

const edgeStyle = { stroke: '#4A5F52', strokeWidth: 2 };
const dashedEdgeStyle = { stroke: '#4A5F52', strokeWidth: 2, strokeDasharray: '8 4' };
const markerEnd = { type: MarkerType.ArrowClosed, color: '#4A5F52' };

const nodes: Node[] = [
  // SWIMLANE BACKGROUND NODES
  { id: 'swim-1', type: 'swimlane', position: { x: 100, y: 0 }, zIndex: -1, draggable: false, selectable: false, className: 'flow-swimlane-wrapper', data: { label: '1) Core Deal Team', subtitle: 'PMO / M&A Lead', variant: 'row1' }, style: { width: 2800, height: 200 } },
  { id: 'swim-2', type: 'swimlane', position: { x: 100, y: 220 }, zIndex: -1, draggable: false, selectable: false, className: 'flow-swimlane-wrapper', data: { label: '2) Pillar Owners', subtitle: 'Ops, Finance, HR, Tax, RE, Support Services, etc.', variant: 'row2' }, style: { width: 2800, height: 200 } },
  { id: 'swim-3', type: 'swimlane', position: { x: 100, y: 440 }, zIndex: -1, draggable: false, selectable: false, className: 'flow-swimlane-wrapper', data: { label: '3) Support Services / Legal / Finance', variant: 'row3' }, style: { width: 2800, height: 200 } },
  { id: 'swim-4', type: 'swimlane', position: { x: 100, y: 660 }, zIndex: -1, draggable: false, selectable: false, className: 'flow-swimlane-wrapper', data: { label: '4) Governance', subtitle: 'ACAC / Board checkpoints as needed', variant: 'row4' }, style: { width: 2800, height: 200 } },
  { id: 'swim-5', type: 'swimlane', position: { x: 100, y: 880 }, zIndex: -1, draggable: false, selectable: false, className: 'flow-swimlane-wrapper', data: { label: 'Deal OS System', subtitle: 'snapshot, waves, audit, reporting', variant: 'row5' }, style: { width: 2800, height: 200 } },

  // PHASE HEADER NODES
  { id: 'phase-1', type: 'process', position: { x: 150, y: -60 }, data: { label: 'Diligence Setup', variant: 'accent' }, style: { width: 450 } },
  { id: 'phase-2', type: 'process', position: { x: 620, y: -60 }, data: { label: 'Freeze Snapshot + Wave Workflow', variant: 'accent' }, style: { width: 600 } },
  { id: 'phase-3', type: 'process', position: { x: 1240, y: -60 }, data: { label: 'Core Execution (Parallel)', variant: 'accent' }, style: { width: 720 } },
  { id: 'phase-4', type: 'process', position: { x: 1980, y: -60 }, data: { label: 'Rollup, Risk Gates, Readout', variant: 'accent' }, style: { width: 650 } },

  // ROW 1 NODES (Core Deal Team)
  { id: 'start', type: 'startEnd', position: { x: 200, y: 20 }, data: { label: 'Start: LOI signed / diligence authorized', variant: 'start' } },
  { id: 'kickoff', type: 'process', position: { x: 200, y: 100 }, data: { label: 'Diligence kickoff', items: ['scope, timeline, cadence', 'assign pillar owners + RACI'], variant: 'default' } },
  { id: 'select-approach', type: 'process', position: { x: 420, y: 100 }, data: { label: 'Select approach', items: ['Full vs Lean diligence', 'define materiality thresholds + priorities'], variant: 'default' } },
  { id: 'create-snapshot', type: 'process', position: { x: 680, y: 60 }, data: { label: 'Create "Diligence Freeze Snapshot"', items: ['baseline dataset'], variant: 'default' } },
  { id: 'build-wave-plan', type: 'process', position: { x: 920, y: 50 }, data: { label: 'Build "Wave Plan"', items: ['Wave 1: critical path', 'Wave 2+: follow-ups'], variant: 'default' } },
  { id: 'wave-plan-doc', type: 'document', position: { x: 1150, y: 50 }, data: { label: 'Wave Plan', variant: 'primary' } },
  { id: 'decision-d2', type: 'decision', position: { x: 1320, y: 30 }, data: { label: 'D2-1: Critical data missing / contradictions?', variant: 'warning' } },
  { id: 'escalation-gate', type: 'process', position: { x: 1550, y: 30 }, data: { label: 'Escalation gate', variant: 'warning' } },
  { id: 'consolidate', type: 'process', position: { x: 1980, y: 50 }, data: { label: 'Consolidate findings', items: ['single Risk Register +', 'Obligations Register'], variant: 'default' } },
  { id: 'risk-register', type: 'document', position: { x: 2250, y: 30 }, data: { label: 'Risk Register / Obligations Register', variant: 'primary' } },

  // ROW 2 NODES (Pillar Owners)
  { id: 'decision-full-lean', type: 'decision', position: { x: 440, y: 260 }, data: { label: 'Full or Lean?', variant: 'default' } },
  { id: 'yes-proceed', type: 'process', position: { x: 200, y: 380 }, data: { label: 'YES / proceed', variant: 'primary' }, style: { width: 120 } },
  { id: 'no-stop', type: 'process', position: { x: 440, y: 450 }, data: { label: 'NO / stop / re-scope', variant: 'warning' }, style: { width: 150 } },
  { id: 'milestone-note', type: 'process', position: { x: 200, y: 520 }, data: { label: 'Milestone / gate / escalation accents', variant: 'insight' }, style: { width: 180 } },

  // WAVE-BASED REQUEST LOOP GROUP
  { id: 'wave-loop-group', type: 'group', position: { x: 620, y: 240 }, data: { label: 'Wave-Based Request Loop', variant: 'loop' }, style: { width: 580, height: 600 } },
  { id: 'draft-request', type: 'process', position: { x: 30, y: 40 }, parentId: 'wave-loop-group', extent: 'parent', data: { label: 'Deal Team drafts request wave', items: ['dedupe + scope control'], variant: 'default' } },
  { id: 'internal-review', type: 'process', position: { x: 30, y: 140 }, parentId: 'wave-loop-group', extent: 'parent', data: { label: 'Internal review/approval of wave', variant: 'default' } },
  { id: 'send-requests', type: 'process', position: { x: 30, y: 240 }, parentId: 'wave-loop-group', extent: 'parent', data: { label: 'Requests sent to seller via single channel', variant: 'default' } },
  { id: 'responses-received', type: 'process', position: { x: 30, y: 340 }, parentId: 'wave-loop-group', extent: 'parent', data: { label: 'Responses received / ingested', variant: 'default' } },
  { id: 'deal-os-tracking', type: 'process', position: { x: 30, y: 450 }, parentId: 'wave-loop-group', extent: 'parent', data: { label: 'Deal OS completeness tracking', items: ['timestamps + audit trail'], variant: 'default' } },
  { id: 'clarifications', type: 'process', position: { x: 320, y: 450 }, parentId: 'wave-loop-group', extent: 'parent', data: { label: 'Clarifications issued as needed', variant: 'default' } },

  // DUE DILIGENCE PILLARS GROUP
  { id: 'pillars-group', type: 'group', position: { x: 1240, y: 230 }, data: { label: 'Core Due Diligence Pillars', subtitle: 'Parallel Workstreams', variant: 'parallel' }, style: { width: 700, height: 550 } },
  { id: 'pillar-financial', type: 'process', position: { x: 20, y: 50 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Financial:', items: ['normalized EBITDA +', 'risk items'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-inventory', type: 'process', position: { x: 250, y: 50 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Inventory & Working Capital:', items: ['WC peg +', 'true-up sensitivities'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-vendor', type: 'process', position: { x: 480, y: 50 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Vendor & Rebate Economics:', items: ['concentration +', 'rebate continuity risks'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-insurance', type: 'process', position: { x: 20, y: 210 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Insurance & Risk Exposure:', items: ['coverage +', 'gaps + claims exposure'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-hr', type: 'process', position: { x: 250, y: 210 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'HR / Payroll / People:', items: ['liabilities +', 'key-person continuity'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-tax', type: 'process', position: { x: 480, y: 210 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Tax & Compliance:', items: ['exposures +', 'structure issues'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-realestate', type: 'process', position: { x: 20, y: 370 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Real Estate & Facilities:', items: ['consents +', 'lease/deed + env flags'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-support', type: 'process', position: { x: 250, y: 370 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Support Services (Back Office Controls):', items: ['control gaps +', 'readiness'], variant: 'default' }, style: { width: 200 } },
  { id: 'pillar-operations', type: 'process', position: { x: 480, y: 370 }, parentId: 'pillars-group', extent: 'parent', data: { label: 'Operations:', items: ['Day1 blockers +', 'stabilization needs'], variant: 'default' }, style: { width: 200 } },

  // ROW 2 CONTINUED
  { id: 'update-terms', type: 'process', position: { x: 1980, y: 280 }, data: { label: 'Update deal terms / protections', items: ['purchase agreement terms', 'schedules, disclosure updates'], variant: 'default' } },

  // ROW 3 NODES
  { id: 'evidence-pack', type: 'document', position: { x: 1980, y: 480 }, data: { label: 'Versioned evidence pack + audit log', variant: 'default' } },
  { id: 'readout-checkpoint', type: 'process', position: { x: 2250, y: 480 }, data: { label: 'Diligence readout checkpoint', items: ['ACAC / Board if required'], variant: 'default' } },
  { id: 'readout-deck', type: 'document', position: { x: 2520, y: 480 }, data: { label: 'Diligence Readout Deck', variant: 'primary' } },

  // ROW 4 NODES
  { id: 'decision-d4', type: 'decision', position: { x: 2280, y: 680 }, data: { label: 'D4-1: Proceed / Re-scope / Stop?', variant: 'default' } },
  { id: 'diligence-complete', type: 'process', position: { x: 2480, y: 700 }, data: { label: 'Diligence Complete → ready for Final Approval / Close Prep', variant: 'primary' } },

  // ROW 5 NODES
  { id: 'repeat-waves', type: 'process', position: { x: 500, y: 920 }, data: { label: 'Repeat for Wave 2 / Wave 3 until "Complete"', variant: 'insight' } },
  { id: 'freeze-snapshot', type: 'document', position: { x: 800, y: 920 }, data: { label: 'Diligence Freeze Snapshot', variant: 'primary' } },
  { id: 'end-stop', type: 'startEnd', position: { x: 2480, y: 940 }, data: { label: 'END\nStop Pursuit', variant: 'end-negative' } },
];

const edges: Edge[] = [
  { id: 'e-start-kickoff', source: 'start', sourceHandle: 'right-source', target: 'kickoff', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-kickoff-select', source: 'kickoff', sourceHandle: 'right-source', target: 'select-approach', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  // From select-approach: one to the right, one down to diamond
  { id: 'e-select-create', source: 'select-approach', sourceHandle: 'right-source', target: 'create-snapshot', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-select-decision', source: 'select-approach', sourceHandle: 'bottom-source', target: 'decision-full-lean', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  // Full / Lean both route to create-snapshot
  { id: 'e-decision-full', source: 'decision-full-lean', target: 'create-snapshot', sourceHandle: 'left-source', targetHandle: 'bottom', type: 'smoothstep', label: 'Full', style: edgeStyle, markerEnd },
  { id: 'e-decision-lean', source: 'decision-full-lean', target: 'create-snapshot', sourceHandle: 'right-source', targetHandle: 'bottom', type: 'smoothstep', label: 'Lean', style: edgeStyle, markerEnd },

  { id: 'e-create-build', source: 'create-snapshot', sourceHandle: 'right-source', target: 'build-wave-plan', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-build-wave', source: 'build-wave-plan', sourceHandle: 'right-source', target: 'wave-plan-doc', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  { id: 'e-wave-decision', source: 'wave-plan-doc', sourceHandle: 'right-source', target: 'decision-d2', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-decision-d2-yes', source: 'decision-d2', target: 'escalation-gate', sourceHandle: 'right-source', targetHandle: 'left', type: 'smoothstep', label: 'YES', style: edgeStyle, markerEnd },
  { id: 'e-decision-d2-no', source: 'decision-d2', target: 'draft-request', sourceHandle: 'bottom-source', targetHandle: 'top', type: 'smoothstep', label: 'NO', style: edgeStyle, markerEnd },
  { id: 'e-escalation-consolidate', source: 'escalation-gate', sourceHandle: 'right-source', target: 'consolidate', targetHandle: 'left', type: 'smoothstep', style: dashedEdgeStyle, markerEnd },
  
  // Wave doc also feeds into the loop
  { id: 'e-wave-draft', source: 'wave-plan-doc', sourceHandle: 'bottom-source', target: 'draft-request', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  // Inside the loop: force bottom-to-top
  { id: 'e-draft-internal', source: 'draft-request', sourceHandle: 'bottom-source', target: 'internal-review', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-internal-send', source: 'internal-review', sourceHandle: 'bottom-source', target: 'send-requests', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-send-responses', source: 'send-requests', sourceHandle: 'bottom-source', target: 'responses-received', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-responses-os', source: 'responses-received', sourceHandle: 'bottom-source', target: 'deal-os-tracking', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-os-clarifications', source: 'deal-os-tracking', sourceHandle: 'bottom-source', target: 'clarifications', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  // From Clarifications LEFT to Repeat for Wave 2
  { id: 'e-clarifications-repeat', source: 'clarifications', sourceHandle: 'left-source', target: 'repeat-waves', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  // Out of the loop
  { id: 'e-loop-pillars', source: 'wave-loop-group', sourceHandle: 'right-source', target: 'pillars-group', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-pillars-update', source: 'pillars-group', sourceHandle: 'right-source', target: 'update-terms', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-consolidate-risk', source: 'consolidate', sourceHandle: 'right-source', target: 'risk-register', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-update-evidence', source: 'update-terms', sourceHandle: 'right-source', target: 'evidence-pack', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-evidence-readout', source: 'evidence-pack', sourceHandle: 'right-source', target: 'readout-checkpoint', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-readout-deck', source: 'readout-checkpoint', sourceHandle: 'right-source', target: 'readout-deck', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  { id: 'e-deck-decision', source: 'readout-deck', sourceHandle: 'bottom-source', target: 'decision-d4', targetHandle: 'top', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  { id: 'e-d4-proceed', source: 'decision-d4', target: 'diligence-complete', sourceHandle: 'right-source', targetHandle: 'left', type: 'smoothstep', label: 'Proceed', style: edgeStyle, markerEnd },
  { id: 'e-d4-stop', source: 'decision-d4', target: 'end-stop', sourceHandle: 'bottom-source', targetHandle: 'top', type: 'smoothstep', label: 'Stop', style: edgeStyle, markerEnd },
  { id: 'e-d4-rescope', source: 'decision-d4', target: 'repeat-waves', sourceHandle: 'left-source', targetHandle: 'right', type: 'smoothstep', label: 'Re-scope', style: dashedEdgeStyle, markerEnd },
  { id: 'e-repeat-freeze', source: 'repeat-waves', sourceHandle: 'right-source', target: 'freeze-snapshot', targetHandle: 'left', type: 'smoothstep', style: edgeStyle, markerEnd },
  
  // From bottom snapshot back up to loop (baseline dataset)
  { id: 'e-freeze-draft', source: 'freeze-snapshot', sourceHandle: 'top-source', target: 'wave-loop-group', targetHandle: 'bottom', type: 'smoothstep', style: dashedEdgeStyle, markerEnd },
];

export const winsupplyDueDiligenceTemplate: FlowTemplate = {
  id: 'acquisition-due-diligence',
  name: 'Acquisition Due Diligence Template',
  description: 'M&A due diligence workflow with wave-based request loops',
  nodes,
  edges,
  viewport: undefined
};
