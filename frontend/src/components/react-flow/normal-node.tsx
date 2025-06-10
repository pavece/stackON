import { type NodeProps, Position, useNodeConnections } from '@xyflow/react';

import { BaseNode } from '@/components/base-node';

import { BaseHandle } from '../base-handle';
import type React from 'react';
import type { InstructionNode } from '@/interfaces/node.interface';
import { Input } from '../ui/input';
import { useInstruictionDiagramStore } from '@/stores/instruction-diagram-store';

const NormalNode: React.FC<NodeProps<InstructionNode>> = ({ id, data }) => {
	const connections = useNodeConnections();
	const updateNodeInstructionValue = useInstruictionDiagramStore(state => state.updateNodeInstructionValue);

	return (
		<BaseNode className='p-2 bg-background min-w-[200px] text-center rounded-sm'>
			<BaseHandle
				type='target'
				position={Position.Top}
				isConnectable={!connections.filter(c => c.target == id).length}
			/>
			<div>
				<span className='text-sm'>{data.label}</span>
				<div>
					<Input
						placeholder={data.instructionType == 'on' || data.instructionType == 'off' ? 'RED' : '10'}
						value={data.instructionValue}
						onChange={e => updateNodeInstructionValue(id, e.target.value)}
					/>
				</div>
			</div>
			<BaseHandle
				type='source'
				position={Position.Bottom}
				isConnectable={!connections.filter(c => c.source == id).length}
			/>
		</BaseNode>
	);
};

export default NormalNode;
