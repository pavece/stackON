export const HowItWorksSection = () => {
	return (
		<section className='mb-20 flex max-w-[1440px] flex-col items-start justify-center'>
			<div>
				<h1 className='m text-4xl font-semibold'>How does it work ?</h1>
				<p className='text-md text-zinc-500'>
					StackON requires an existing monitoring and alerting infrastructure in order to work properly.
				</p>
			</div>
			<img
				src='/images/structural-diagram.svg'
				alt='Structural diagram'
				className='pointer-events-none mx-auto mt-10 w-full select-none md:w-[85%]'
			/>
			<div className='mt-14 flex w-full flex-col items-center gap-6'>
				<article className='rounded-md bg-[#232323] p-4'>
					<h3 className='text-2xl font-medium'>1. Create stackON webhooks</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Define webhooks for different severity levels or destinations. Design a simple workflow of actions that will
						be sent over MQTT to your end clients.
					</p>
				</article>
				<article className='rounded-md bg-[#232323] p-4'>
					<h3 className='text-2xl font-medium'>2. Include your webhooks in prometheus alertmanager</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Once defined you need to include those webhooks in alertmanager configuration. Make sure to use correct
						grouping and matching to achieve good results. Check the readme section for more info.
					</p>
				</article>
				<article className='rounded-md bg-[#232323] p-4'>
					<h3 className='text-2xl font-medium'>3. Connect MQTT clients</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Now you can connect MQTT clients to mosquitto broker and start listening those MQTT alerts. You can check my
						client implementation example for an ESP32 andon beacon. I recommend implementing your own custom client
						that fits your needs.
					</p>
				</article>
			</div>
		</section>
	);
};
