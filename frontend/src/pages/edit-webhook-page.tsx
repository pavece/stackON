import { z } from 'zod';
import { useNavigate, useParams } from 'react-router';
import { WebhookForm } from '@/components/creation-page/webhook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWebhook, updateWebhook } from '@/api/api-client';
import type { Webhook } from '@/interfaces/webhook.interface';
import { toast } from 'sonner';
import { DiagramEditor } from '@/components/creation-page/diagram-editor';
import { useInstruictionDiagramStore } from '@/stores/instruction-diagram-store';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { useEffect } from 'react';
import type { InstructionNode } from '@/interfaces/node.interface';
import type { Edge } from '@xyflow/react';
import { validateInstructionNodes } from '@/interfaces/instruction-validator';

const typeSchema = z.enum(['latch', 'once']);

export const EditWebhookPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { nodes, edges, setNodes, setEdges } = useInstruictionDiagramStore();

	const {
		isError,
		isLoading,
		data: { data: webhook } = {},
	} = useQuery({ queryKey: ['webhook', 'edit', id], queryFn: () => fetchWebhook(id || '') });

	const updateWebhookMutation = useMutation({
		mutationFn: updateWebhook,
		onSuccess: () => {
			toast.success('Webhook updated successfully');
		},
		onError: error => {
			toast.error(`Error while updating the webhook (${error.message})`);
		},
	});

	function onSubmit(values: object) {
		const instructionValidationResult = validateInstructionNodes(nodes);

		if (instructionValidationResult) {
			toast.error(`Webhook instruction set error: ${instructionValidationResult}`);
			return;
		}

		updateWebhookMutation.mutate({
			id: webhook?.id,
			...values,
			instructionConnections: edges,
			instructionNodes: nodes,
		} as Webhook);
	}

	useEffect(() => {
		if (webhook?.instructionConnections && webhook.instructionNodes) {
			setNodes(webhook.instructionNodes as InstructionNode[]);
			setEdges(webhook.instructionConnections as Edge[]);
		}
	}, [webhook, setNodes, setEdges]);

	if (!id) {
		navigate('/');
		return;
	}

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		return <Error error={`An error occurred while fetching information for hook (${id})`} />;
	}

	return (
		<div>
			<div className='col-span-1'>
				<h1 className='text-2xl mb-2'>Update Webhook</h1>
				<p className='text-muted-foreground'>Fill all the fields to create a new webhook.</p>
			</div>

			<div className='grid  grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-10 mt-10 h-[70vh] gap-4'>
				<div className='col-span-1 md:col-span-4 lg:col-span-3'>
					<WebhookForm
						onSubmit={onSubmit}
						initialValues={webhook}
						type={typeSchema.safeParse(webhook?.type).data || 'once'}
						submiting={updateWebhookMutation.isPending}
						isCreation={false}
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
