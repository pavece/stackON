import { type NodeProps, Position, useNodeConnections } from '@xyflow/react';

import { BaseNode } from '@/components/base-node';

import { BaseHandle } from '../base-handle';
import type React from 'react';
import type { InstructionNode } from '@/interfaces/node.interface';
import { useInstruictionDiagramStore } from '@/stores/instruction-diagram-store';
import { Input } from '../ui/input';
import { NodeHeader, NodeHeaderIcon, NodeHeaderTitle } from '../node-header';
import { Clock, Sun } from 'lucide-react';
import { NodeStatusIndicator } from '../node-status-indicator';

const EntryNode: React.FC<NodeProps<InstructionNode>> = ({ id, data }) => {
	const connections = useNodeConnections();
	const updateNodeInstructionValue = useInstruictionDiagramStore(state => state.updateNodeInstructionValue);



	return (
		<NodeStatusIndicator status={data.instructionType == 'on' ? 'success' : data.instructionType == "off" ? "error" : "loading"}>
			<BaseNode className='p-0 bg-background min-w-[200px] rounded-sm'>
				<NodeHeader className='border-b-1 p-2 font-normal text-sm'>
					<NodeHeaderIcon>{data.instructionType == 'wait' ? <Clock /> : <Sun />}</NodeHeaderIcon>
					<NodeHeaderTitle>{data.label}</NodeHeaderTitle>
				</NodeHeader>

				<div className='p-2 text-center'>
					<Input
						className='font-mono uppercase'
						placeholder={data.instructionType == 'on' || data.instructionType == 'off' ? 'RED' : '10'}
						value={data.instructionValue}
						onChange={e => updateNodeInstructionValue(id, e.target.value)}
					/>
					<span className='text-sm font-mono text-muted-foreground '>
						{data.instructionType == 'wait' && 'seconds'}
					</span>
				</div>
				<BaseHandle type='source' position={Position.Bottom} isConnectable={connections.length == 0} />
			</BaseNode>
		</NodeStatusIndicator>
	);
};

export default EntryNode;
