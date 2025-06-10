import type { ReducedWebhook } from '@/interfaces/webhook.interface';
import { Button } from '../ui/button';
import { WebhookCard } from './webhook-card';
import { Frown, Plus } from 'lucide-react';
import { Link } from 'react-router';

interface Props {
	title: string;
	description: string;
	typeKey: string;
	webhooks: ReducedWebhook[];
}

export const WebhooksContainerSection = ({ title, description, webhooks, typeKey }: Props) => {
	return (
		<section className='mb-10'>
			<div className='flex justify-between items-center'>
				<div className='max-w-[550px]'>
					<h1 className='font-semibold text-3xl'>{title}</h1>
					<p className='text-md text-muted-foreground mt-2'>{description}</p>
				</div>
				<Button asChild>
					<Link to={`/create/webhook?type=${typeKey}`}>
						<Plus /> Add new
					</Link>
				</Button>
			</div>

			{webhooks.length == 0 ? (
				<div className='flex justify-center items-center min-h-[200px] '>
					<h3 className='text-xl flex items-center gap-2'>
						No webhooks <Frown />
					</h3>
				</div>
			) : (
				<div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-5 w-full'>
					{webhooks.map(h => (
						<WebhookCard webhook={h} key={h.id} />
					))}
				</div>
			)}
		</section>
	);
};
