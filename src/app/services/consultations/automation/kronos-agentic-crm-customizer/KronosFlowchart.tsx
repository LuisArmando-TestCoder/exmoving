import React from 'react';
import styles from './KronosFlowchart.module.scss';

export interface FlowNode {
  type: 'node' | 'diamond' | 'database' | 'arrow' | 'label' | 'branch_container';
  text?: string;
  subNodes?: FlowNode[]; // For branches or content within containers
}

export interface KronosFlowchartProps {
  data?: FlowNode[];
}

const RenderNode = ({ node, index }: { node: FlowNode; index: number }) => {
  switch (node.type) {
    case 'node':
      return <div key={index} className={styles.flowNode}>{node.text}</div>;
    case 'diamond':
      return <div key={index} className={styles.flowDiamond}>{node.text}</div>;
    case 'database':
      return <div key={index} className={styles.flowDatabase}>{node.text}</div>;
    case 'arrow':
      return <div key={index} className={styles.flowArrow}>{node.text || '→'}</div>;
    case 'label':
      return <div key={index} className={styles.flowLabel}>{node.text}</div>;
    case 'branch_container':
      return (
        <div key={index} className={styles.flowBranches}>
          {node.subNodes?.map((branch, idx) => (
            <div key={idx} className={styles.flowBranch}>
              {branch.subNodes?.map((sub, sIdx) => (
                <RenderNode key={sIdx} node={sub} index={sIdx} />
              ))}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export const KronosFlowchart = ({ data }: KronosFlowchartProps) => {
  // Default data if none provided (the original Kronos flowchart)
  const flowchartData: FlowNode[] = data || [
    { type: 'node', text: 'HTTP Request' },
    { type: 'arrow', text: '→' },
    { type: 'diamond', text: 'UIDBM Router' },
    {
      type: 'branch_container',
      subNodes: [
        {
          type: 'node', // Using node as a wrapper for branch 1
          subNodes: [
            { type: 'label', text: 'GET /schema' },
            { type: 'node', text: 'Schema Manager' }
          ]
        },
        {
          type: 'node', // Using node as a wrapper for branch 2
          subNodes: [
            { type: 'label', text: 'POST /:coll' },
            { type: 'node', text: 'Validator [Pass]' },
            { type: 'arrow', text: '↓' },
            { type: 'node', text: 'Security [Pass]' },
            { type: 'arrow', text: '↓' },
            { type: 'node', text: 'Logic & Plans [Pass]' },
            { type: 'arrow', text: '↓' },
            { type: 'node', text: 'CRUD Helper' },
            { type: 'arrow', text: '↓' },
            { type: 'database', text: 'DB (Firestore)' }
          ]
        }
      ]
    }
  ];

  return (
    <div className={styles.flowchart}>
      {flowchartData.map((node, index) => (
        <RenderNode key={index} node={node} index={index} />
      ))}
    </div>
  );
};
