import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router';
import { WebhookForm } from '@/components/creation-page/webhook-form';
import { useMutation } from '@tanstack/react-query';
import { createWebhook } from '@/api/api-client';
import type { Webhook } from '@/interfaces/webhook.interface';
import { toast } from 'sonner';
import { DiagramEditor } from '@/components/creation-page/diagram-editor';
import { useInstruictionDiagramStore } from '@/stores/instruction-diagram-store';
import { validateInstructionNodes } from '@/interfaces/instruction-validator';
import { useEffect } from 'react';

const typeSchema = z.enum(['latch', 'once']);

export const CreateWebhookPage = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const { nodes, edges, resetDefaults } = useInstruictionDiagramStore();

	const createWebhookMutation = useMutation({
		mutationFn: createWebhook,
		onSuccess: result => {
			navigate(`/webhook/${result.data.id}`);
		},
		onError: error => {
			toast.error(`Error while creating the webhook (${error.message})`);
		},
	});

	function onSubmit(values: object) {
		const instructionValidationResult = validateInstructionNodes(nodes);

		if (instructionValidationResult) {
			toast.error(`Webhook instruction set error: ${instructionValidationResult}`);
			return;
		}

		createWebhookMutation.mutate({
			...values,
			instructionConnections: edges,
			instructionNodes: nodes,
		} as Webhook);
	}

	useEffect(() => {
		resetDefaults();
	}, []);

	return (
		<div>
			<div className='col-span-1'>
				<h1 className='text-2xl mb-2'>Create Webhook</h1>
				<p className='text-muted-foreground'>Fill all the fields to create a new webhook.</p>
			</div>

			<div className='grid  grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-10 mt-10 h-[70vh] gap-4'>
				<div className='col-span-1 md:col-span-4 lg:col-span-3'>
					<WebhookForm
						onSubmit={onSubmit}
						type={typeSchema.safeParse(params.get('type')).data || 'once'}
						submiting={createWebhookMutation.isPending}
						isCreation
					/>
				</div>
				<div className='col-span-1 md:col-span-6 lg:col-span-7'>
					<span className='font-medium'>Instructions</span>
					<div className='rounded-lg border w-full h-full'>
						<DiagramEditor />
					</div>
					<p className='mt-2 text-muted-foreground italic'>
						If you're creating a latch hook, this instruction set will run indefinitely until a resolve event is
						received.
					</p>
				</div>
			</div>
		</div>
	);
};
