import { WebhooksContainerSection } from '@/components/main-page/webhooks-container-section';

export const MainPage = () => {
	return (
		<div>
			<WebhooksContainerSection
				title='Latch hooks'
				description='Once fired the instructions on these hooks will keep running until a resolve event is recieved.'
				typeKey='latch'
				webhooks={[]}
			/>
			<WebhooksContainerSection
				title='Once hooks'
				description='These hooks will execute the instruction set only once. They dont require a resolve event.'
				typeKey='latch'
				webhooks={[
					{
						title: 'Test',
						description: 'This is a test hook',
						topic: '',
						id: '1000',
						type: 'temp',
					},
					{
						title: 'Test',
						description: 'This is a test hook',
						topic: '',
						id: '1000',
						type: 'temp',
					},
					{
						title: 'Test',
						description: 'This is a test hook',
						topic: '',
						id: '1000',
						type: 'temp',
					},
					{
						title: 'Test',
						description: 'This is a test hook',
						topic: '',
						id: '1000',
						type: 'temp',
					},
					{
						title: 'Test',
						description: 'This is a test hook',
						topic: '',
						id: '1000',
						type: 'temp',
					},
					{
						title: 'Test',
						description: 'This is a test hook',
						topic: '',
						id: '1000',
						type: 'temp',
					},
				]}
			/>
		</div>
	);
};
