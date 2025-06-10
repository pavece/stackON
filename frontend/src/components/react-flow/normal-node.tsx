import { type NodeProps, Position } from '@xyflow/react';

import { BaseNode } from '@/components/base-node';

import { BaseHandle } from '../base-handle';
import type React from 'react';
import type { InstructionNodeData } from '@/interfaces/node.interface';

const NormalNode: React.FC<NodeProps<InstructionNodeData>> = ({ data }) => {
	return (
		<BaseNode className='p-2 bg-background min-w-[200px] text-center rounded-sm'>
			<BaseHandle type='target' position={Position.Top} />
			<span className='text-sm'>{data.label}</span>
			<BaseHandle type='source' position={Position.Bottom} />
		</BaseNode>
	);
};

export default NormalNode;
