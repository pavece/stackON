import { fetchWebhooks } from '@/api/api-client';
import { WebhooksContainerSection } from '@/components/main-page/webhooks-container-section';
import { Error } from '@/components/ui/error';
import { Loading } from '@/components/ui/loading';
import { useQuery } from '@tanstack/react-query';

export const MainPage = () => {
	const { isLoading, isError, data } = useQuery({ queryKey: ['webhooks'], queryFn: fetchWebhooks });

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		return <Error error='Error while loading data from the API, is the backend running ?' />;
	}

	return (
		<div>
			<WebhooksContainerSection
				title='Latch hooks'
				description='Once fired the instructions on these hooks will keep running until a resolve event is recieved.'
				typeKey='latch'
				webhooks={(data?.data || []).filter(w => w.type == 'latch')}
			/>
			<WebhooksContainerSection
				title='Once hooks'
				description='These hooks will execute the instruction set only once. They dont require a resolve event.'
				typeKey='once'
				webhooks={(data?.data || []).filter(w => w.type == 'once')}
			/>
		</div>
	);
};
