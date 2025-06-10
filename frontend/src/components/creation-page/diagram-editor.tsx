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
	useReactFlow,
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
import { useInstruictionDiagramStore } from '@/stores/instruction-diagram-store';

const nodeTypes = {
	normal: NormalNode,
	entry: EntryNode,
};

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
	const {
		edges,
		nodes,
		setEdges,
		setNodes,
		addNode: stateAddNode,
		addEdge: stateAddEdge,
	} = useInstruictionDiagramStore();
	const { fitView } = useReactFlow();

	const [lastId, setLastId] = useState(3);

	const onNodesChange = useCallback(
		(changes: NodeChange<InstructionNode>[]) => setNodes(applyNodeChanges(changes, nodes)),
		[nodes, setNodes]
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
		[setEdges, edges]
	);

	const onConnect = useCallback<OnConnect>(params => setEdges(addEdge(params, edges)), [setEdges, edges]);

	const onAddNode = (type: 'on' | 'off' | 'wait', label: string, defaultValue: string) => {
		console.log(nodes);
		const newNode: InstructionNode = {
			id: String(lastId + 1),
			type: nodes.length == 0 ? 'entry' : 'normal',
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

		stateAddNode(newNode);
		stateAddEdge(newEdge);

		fitView({
			nodes: [newNode],
			duration: 0.8,
			maxZoom: 1.5,
		});
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
