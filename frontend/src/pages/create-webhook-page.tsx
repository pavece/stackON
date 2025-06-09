import { z } from 'zod';
import { useSearchParams } from 'react-router';
import { WebhookForm } from '@/components/creation-page/webhook-form';

const typeSchema = z.enum(['latch', 'once']);

export const CreateWebhookPage = () => {
	const [params] = useSearchParams();

	function onSubmit(values: object) {
		console.log(values);
	}

	return (
		<div>
			<div className='col-span-1'>
				<h1 className='text-2xl mb-2'>Create Webhook</h1>
				<p className='text-muted-foreground'>Fill all the fields to create a new webhook.</p>
			</div>

			<div className='grid  grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-10 mt-10 h-[70vh] gap-4'>
				<div className='col-span-1 md:col-span-4 lg:col-span-3'>
					<WebhookForm onSubmit={onSubmit} type={typeSchema.safeParse(params.get('type')).data || 'once'} isCreation />
				</div>
				<div className='rounded-md border col-span-1 md:col-span-6 lg:col-span-7 '></div>
			</div>
		</div>
	);
};
