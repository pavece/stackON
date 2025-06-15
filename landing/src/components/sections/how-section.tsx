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
				<h1 className='text-2xl font-semibold md:text-4xl'>How It Works</h1>
				<p className='text-md mt-2 text-zinc-500'>
					StackON connects your monitoring stack to physical devices via MQTT. Just plug in your Alertmanager and go.
				</p>
			</div>
			<img
				src='/images/structural-diagram.svg'
				alt='Structural diagram'
				className='structural-diagram pointer-events-none mx-auto mt-10 w-full opacity-0 blur-md select-none md:w-[85%]'
			/>
			<div className='mt-14 flex w-full flex-col items-center gap-6'>
				<article className='step translate-x-[100px] rounded-md bg-[#232323] p-4 opacity-0'>
					<h3 className='text-2xl font-medium'>1. Create StackON Webhooks</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Define webhooks for different alert severities or device groups. Design simple workflows of custom
						instructions, like turning on a red light or triggering a buzzer. That will be sent over MQTT to your
						devices.
					</p>
				</article>
				<article className='step translate-x-[100px] rounded-md bg-[#232323] p-4 opacity-0'>
					<h3 className='text-2xl font-medium'>2. Connect to Alertmanager</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Add your StackON webhooks to your Alertmanager configuration. Use proper grouping and label matching to
						ensure accurate alert routing. Refer to the README for examples and best practices.
					</p>
				</article>
				<article className='step translate-x-[100px] rounded-md bg-[#232323] p-4 opacity-0'>
					<h3 className='text-2xl font-medium'>3. Connect Yoour MQTT Clients</h3>
					<p className='mt-2 max-w-[1000px] text-zinc-500'>
						Connect devices like ESP32 to your MQTT broker and start listening for alerts. Use the provided example
						client to build an Andon-style beacon, or create your own custom implementation tailored to your hardware
						and use case.
					</p>
				</article>
			</div>
		</section>
	);
};
