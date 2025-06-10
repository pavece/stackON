import { type NodeProps, Position, useNodeConnections } from '@xyflow/react';

import { BaseNode } from '@/components/base-node';

import { BaseHandle } from '../base-handle';
import type React from 'react';
import type { InstructionNode } from '@/interfaces/node.interface';

const EntryNode: React.FC<NodeProps<InstructionNode>> = ({ data }) => {
	const connections = useNodeConnections();

	return (
		<BaseNode className='p-2 bg-background min-w-[200px] text-center rounded-sm'>
			<span className='text-sm'>{data.label}</span>
			<BaseHandle type='source' position={Position.Bottom} isConnectable={connections.length == 0} />
		</BaseNode>
	);
};

export default EntryNode;
