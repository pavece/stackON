import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	ReactFlow,
	type NodeChange,
	type EdgeChange,
	type OnConnect,
	Panel,
	type Edge,
} from '@xyflow/react';

import { useCallback, useState } from 'react';
import NormalNode from '../react-flow/normal-node';
import EntryNode from '../react-flow/entry-node';

import '@xyflow/react/dist/style.css';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus } from 'lucide-react';
import type { InstructionNode } from '@/interfaces/node.interface';

const nodeTypes = {
	normal: NormalNode,
	entry: EntryNode,
};

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

const findDisconnectedNode = (edges: Edge[]) => {
	const nodeConnections: { [key: string]: number } = {};

	edges.forEach(edge => {
		nodeConnections[edge.source] = nodeConnections[edge.source] + 1 || 1;
		nodeConnections[edge.target] = nodeConnections[edge.target] + 1 || 1;
	});

	for (const node in nodeConnections) {
		if (node == '1') continue; //First node will always have only 1 connection

		if (nodeConnections[node] < 2) {
			return node;
		}
	}
};

export const DiagramEditor = () => {
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);
	const [lastId, setLastId] = useState(3);

	const onNodesChange = useCallback(
		(changes: NodeChange<InstructionNode>[]) => setNodes(nds => applyNodeChanges(changes, nds)),
		[]
	);
	const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)), []);
	const onConnect = useCallback<OnConnect>(params => setEdges(eds => addEdge(params, eds)), []);

	const onAddNode = (type: 'on' | 'off' | 'wait', label: string, defaultValue: string) => {
		const newNode: InstructionNode = {
			id: String(lastId + 1),
			type: 'normal',
			position: { x: 0, y: (nodes.at(-1)?.position.y || 0) + 150 },
			data: {
				instruction: type + ':' + defaultValue,
				instructionType: type,
				label: label,
				instructionValue: defaultValue,
			},
		};

		const disconectedNode = findDisconnectedNode(edges) || '1';
		const newEdge: Edge = {
			id: `${disconectedNode}-${lastId + 1}`,
			source: disconectedNode,
			target: String(lastId + 1),
		};

		setNodes(nds => nds.concat(newNode));
		setEdges(edg => edg.concat(newEdge));
		setLastId(id => id + 1);
	};

	return (
		<div className='w-full h-full'>
			<ReactFlow
				colorMode='dark'
				className='rounded-md'
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			>
				<Panel position='bottom-left'>
					<DropdownMenu>
						<DropdownMenuTrigger className='flex items-center gap-1 bg-card p-2 rounded-md cursor-pointer text-sm font-medium'>
							<Plus /> Add instruction
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => onAddNode('on', 'Turn on', 'yellow')}>Turn ON</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onAddNode('off', 'Turn off', 'yellow')}>Turn OFF</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onAddNode('wait', 'Wait', '10')}>Wait</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</Panel>
				<Background />
			</ReactFlow>
		</div>
	);
};
