import type { Node } from '@xyflow/react';

export type InstructionNodeData = Node<{
	label: string;
	instruction: string;
	instructionType: 'on' | 'off' | 'wait';
}>;
