import { deleteWebhook, fetchWebhook } from '@/api/api-client';
import { testWebhook } from '@/api/test-webhook';
import { Button } from '@/components/ui/button';
import { DestructiveActionDialog } from '@/components/ui/destructive-action';
import { Error } from '@/components/ui/error';
import { Loading } from '@/components/ui/loading';
import { CallUrl } from '@/components/webhook-detail/call-url';
import { useQuery } from '@tanstack/react-query';
import { Folder, Pen, Shapes, TestTube2, Trash } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export const WebhookDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const {
		isError,
		isLoading,
		data: { data: hook } = {},
	} = useQuery({ queryKey: ['hook-detail', id], queryFn: () => fetchWebhook(id || '') });

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

	const onDelete = async () => {
		try {
			await deleteWebhook(id);

			toast.success('Webhook deleted successfully');
			navigate('/');
		} catch {
			toast.error('Failed to delete webhook');
		}
	};

	const onTestWebhook = async () => {
		try {
			await testWebhook(id);

			toast.success('Webhook test OK');
		} catch {
			toast.error('Webhook test failed');
		}
	};

	return (
		<div>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-semibold'>Webhook - {hook!.title}</h1>
					<p className='text-lg text-muted-foreground'>{hook!.description}</p>
					<div className='mt-6 space-y-2'>
						<div className='flex items-center gap-2'>
							<span className='text-muted-foreground flex items-center gap-2'>
								<Folder /> Topic
							</span>
							<p className='text-lg'>{hook!.topic}</p>
						</div>

						<div className='flex items-center gap-2'>
							<span className='text-muted-foreground flex items-center gap-2'>
								<Shapes /> Type
							</span>
							<p className={`text-lg font-semibold ${hook?.type == 'latch' && 'text-yellow-500'} `}>{hook!.type}</p>
						</div>
					</div>
				</div>

				<div className='flex gap-2'>
					<DestructiveActionDialog action={onDelete}>
						<Trash /> Delete
					</DestructiveActionDialog>
					<Button asChild>
						<Link to={`/edit/webhook/${id}`}>
							<Pen /> Edit
						</Link>
					</Button>
				</div>
			</div>

			<div className='mt-10'>
				<div className='flex justify-between'>
					<h1 className='text-2xl font-semibold'>URLS</h1>
					<div>
						<Button disabled={hook?.type == 'latch'} variant={'secondary'} onClick={onTestWebhook}>
							<TestTube2 /> Test webhook
						</Button>
					</div>
				</div>
				<CallUrl
					title='Prometheus Alertmanager'
					description='Requires an alertmanager valid payload, will read first level group info.'
					url={(import.meta.env.VITE_PUBLIC_HOST || 'http://BACKEND_HOST') + `/hook/am/${id}`}
					method='POST'
				/>
				{hook?.type == 'once' && (
					<CallUrl
						title='Empty call'
						description='You can call this endpoint without providing a request body (only compatible with once hooks). Ideal for things like gitlab / gitea webhooks.'
						url={(import.meta.env.VITE_PUBLIC_HOST || 'http://BACKEND_HOST') + `/hook/empty/${id}`}
						method='POST | GET'
					/>
				)}
			</div>
		</div>
	);
};
