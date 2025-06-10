import { addEdge, applyEdgeChanges, applyNodeChanges, Background, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import NodeButton from '../react-flow/button-node';
import NormalNode from '../react-flow/normal-node';
import EntryNode from '../react-flow/entry-node';

const nodeTypes = {
	withButton: NodeButton,
	normal: NormalNode,
	entry: EntryNode,
};

const initialNodes = [
	{
		id: '1',
		position: { x: 0, y: 0 },
		type: 'entry',
		data: { label: 'Turn on - Red', instruction: 'on:red' },
	},
	{
		id: '2',
		position: { x: 0, y: 150 },
		type: 'normal',
		data: { label: 'Wait - 10s', instruction: 'wait:10' },
	},
	{
		id: '3',
		position: { x: 0, y: 300 },
		data: { label: 'Turn off - Red', instruction: 'off:red' },
		type: 'withButton',
	},
];

const initialEdges = [
	{ id: '1-2', source: '1', target: '2' },
	{ id: '2-3', source: '2', target: '3' },
];

export const DiagramEditor = () => {
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);

	const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
	const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
	const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), []);

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
				<Background />
			</ReactFlow>
		</div>
	);
};
