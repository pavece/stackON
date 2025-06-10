import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router';
import { WebhookForm } from '@/components/creation-page/webhook-form';
import { useMutation } from '@tanstack/react-query';
import { createWebhook } from '@/api/api-client';
import type { Webhook } from '@/interfaces/webhook.interface';
import { toast } from 'sonner';
import { DiagramEditor } from '@/components/creation-page/diagram-editor';

const typeSchema = z.enum(['latch', 'once']);

export const CreateWebhookPage = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();

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
		createWebhookMutation.mutate({
			...values,
			instructionConnections: [] as object[],
			instructionNodes: [] as object[],
		} as Webhook);
	}

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
				</div>
			</div>
		</div>
	);
};
