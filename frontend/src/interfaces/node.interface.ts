import type { Node } from '@xyflow/react';

export type InstructionNode = Node<
	{
		label: string;
		instruction: string;
		instructionValue: string;
		instructionType: 'on' | 'off' | 'wait';
	},
	'entry' | 'normal'
>;
