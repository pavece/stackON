import { z } from 'zod';
import { type InstructionNode } from './node.interface';

const nodeValidatorSchema = z.object({
	label: z.string().min(3),
	instruction: z.string().min(3),
	instructionValue: z.string().min(1),
	instructionType: z.enum(['on', 'off', 'wait']),
});

export const validateInstructionNodes = (nodes: InstructionNode[]): string | null => {
	if (nodes.length <= 0) {
		return 'cannot create a webhook with an empty instruction set';
	}

	for (const node of nodes) {
		const parsed = nodeValidatorSchema.safeParse(node.data);

		if (!parsed.success) {
			return parsed.error.message;
		}
	}

	return null;
};
