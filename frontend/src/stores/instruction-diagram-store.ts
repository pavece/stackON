import type { InstructionNode } from '@/interfaces/node.interface';
import { create } from 'zustand';
import type { Edge } from '@xyflow/react';

interface InstructionDiagramStore {
	nodes: InstructionNode[];
	edges: Edge[];
	setNodes: (nodes: InstructionNode[]) => void;
	setEdges: (edges: Edge[]) => void;
	addNode: (node: InstructionNode) => void;
	removeNode: (node: InstructionNode) => void;
	addEdge: (edge: Edge) => void;
	removeEdge: (edge: Edge) => void;
	updateNodeInstructionValue: (nodeId: string, newValue: string) => void;
}

const initialNodes: InstructionNode[] = [
	{
		id: '1',
		position: { x: 0, y: 0 },
		type: 'entry',
		data: { label: 'Turn on', instruction: 'on:red', instructionType: 'on', instructionValue: 'RED' },
	},
	{
		id: '2',
		position: { x: 0, y: 150 },
		type: 'normal',
		data: { label: 'Wait', instruction: 'wait:10', instructionType: 'wait', instructionValue: '10' },
	},
	{
		id: '3',
		position: { x: 0, y: 300 },
		data: { label: 'Turn off', instruction: 'off:red', instructionType: 'off', instructionValue: 'RED' },
		type: 'normal',
	},
];

const initialEdges = [
	{ id: '1-2', source: '1', target: '2' },
	{ id: '2-3', source: '2', target: '3' },
];

export const useInstruictionDiagramStore = create<InstructionDiagramStore>()(set => ({
	nodes: initialNodes,
	edges: initialEdges,
	setNodes: n => set({ nodes: n }),
	setEdges: e => set({ edges: e }),
	addNode: n => set(state => ({ nodes: state.nodes.concat(n) })),
	removeNode: n => set(state => ({ nodes: state.nodes.filter(fn => fn.id != n.id) })),
	addEdge: e => set(state => ({ edges: state.edges.concat(e) })),
	removeEdge: e => set(state => ({ edges: state.edges.filter(fe => fe.id != e.id) })),
	updateNodeInstructionValue: (id, val) =>
		set(state => ({
			nodes: state.nodes.map(mn => {
				if (mn.id == id) {
					mn.data.instructionValue = val;
				}
				return { ...mn };
			}),
		})),
}));
