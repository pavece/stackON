import { deleteWebhook, fetchWebhook } from '@/api/api-client';
import { Button } from '@/components/ui/button';
import { DestructiveActionDialog } from '@/components/ui/destructive-action';
import { Error } from '@/components/ui/error';
import { Loading } from '@/components/ui/loading';
import { CallUrl } from '@/components/webhook-detail/call-url';
import { useQuery } from '@tanstack/react-query';
import { Folder, Pen, Shapes, Trash } from 'lucide-react';
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

			<hr className='my-5' />

			<div>
				<h1 className='text-2xl font-semibold'>URLS</h1>
				<CallUrl
					title='Prometheus Alertmanager'
					description='Requires an alertmanager valid payload, will read first level group info.'
					url={(import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:8080') + `/hook/am/${id}`}
					method='POST'
				/>
			</div>
		</div>
	);
};
