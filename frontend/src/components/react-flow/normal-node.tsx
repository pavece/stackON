import { type NodeProps, Position, useNodeConnections } from '@xyflow/react';

import { BaseNode } from '@/components/base-node';

import { BaseHandle } from '../base-handle';
import type React from 'react';
import type { InstructionNode } from '@/interfaces/node.interface';

const NormalNode: React.FC<NodeProps<InstructionNode>> = ({ id, data }) => {
	const connections = useNodeConnections();

	console.log(id, connections);

	return (
		<BaseNode className='p-2 bg-background min-w-[200px] text-center rounded-sm'>
			<BaseHandle type='target' position={Position.Top} isConnectable={!connections.filter(c => c.target == id).length} />
			<span className='text-sm'>{data.label}</span>
			<BaseHandle type='source' position={Position.Bottom} isConnectable={!connections.filter(c => c.source == id).length} />
		</BaseNode>
	);
};

export default NormalNode;
