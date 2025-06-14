import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection = () => {
	useGSAP(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '.howto-section',
				scrub: 1,
				start: 'top bottom',
				end: '+=1000px',
			},
		});

		tl.to('.structural-diagram', {
			opacity: 1,
			duration: 1,
			filter: 'blur(0px)',
		});

		tl.to('.step', {
			opacity: 1,
			x: 0,
			duration: 0.5,
			stagger: 0.2,
		});
	});

	return (
		<section className='howto-section mb-20 flex max-w-[1440px] flex-col items-start justify-center'>
			<div>
				<h1 className='text-2xl font-semibold md:text-4xl'>How does it work ?</h1>
				<p className='text-md mt-2 text-zinc-500'>
					StackON requires an existing monitoring and alerting infrastructure in order to work properly.
				</p>
			</div>
			<img
				src='/images/structural-diagram.svg'
				alt='Structural diagram'
				className='structural-diagram pointer-events-none mx-auto mt-10 w-full opacity-0 blur-md select-none md:w-[85%]'
			/>
			<div className='mt-14 flex w-full flex-col items-center gap-6'>
				<article className='step translate-x-[100px] rounded-md bg-[#232323] p-4 opacity-0'>
					<h3 className='text-2xl font-medium'>1. Create stackON webhooks</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Define webhooks for different severity levels or destinations. Design a simple workflow of actions that will
						be sent over MQTT to your end clients.
					</p>
				</article>
				<article className='step translate-x-[100px] rounded-md bg-[#232323] p-4 opacity-0'>
					<h3 className='text-2xl font-medium'>2. Include your webhooks in prometheus alertmanager</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Once defined you need to include those webhooks in alertmanager configuration. Make sure to use correct
						grouping and matching to achieve good results. Check the readme section for more info.
					</p>
				</article>
				<article className='step translate-x-[100px] rounded-md bg-[#232323] p-4 opacity-0'>
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
