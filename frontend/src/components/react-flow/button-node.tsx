import { Plus } from 'lucide-react';
import { type ConnectionState, type NodeProps, Position, useConnection } from '@xyflow/react';

import { ButtonHandle } from '@/components/button-handle';
import { BaseNode } from '@/components/base-node';

import { BaseHandle } from '../base-handle';
import type React from 'react';
import type { InstructionNodeData } from '@/interfaces/node.interface';
import { DropdownMenu } from '../ui/dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const selector = (connection: ConnectionState) => {
	return connection.inProgress;
};

const NodeButton: React.FC<NodeProps<InstructionNodeData>> = ({ data }) => {
	const connectionInProgress = useConnection(selector);

	return (
		<BaseNode className='p-2 bg-background min-w-[200px] text-center rounded-sm'>
			<BaseHandle type='target' position={Position.Top} />
			<span className='text-sm'>{data.label}</span>
			<ButtonHandle type='source' position={Position.Bottom} showButton={!connectionInProgress}>
				<DropdownMenu>
					<DropdownMenuTrigger className='rounded-full bg-secondary p-2 text-xl cursor-pointer'>
						<Plus size={10} />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Turn on</DropdownMenuItem>
						<DropdownMenuItem>Turn off</DropdownMenuItem>
						<DropdownMenuItem>Wait</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</ButtonHandle>
		</BaseNode>
	);
};

export default NodeButton;
