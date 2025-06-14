import { Github } from 'lucide-react';
import { Button } from '../button';

export const HeroSection = () => {
	return (
		<section className='relative mt-16 flex w-full flex-col items-center justify-start'>
			<div className='w-full max-w-[1440px] items-center'>
				<h1 className='max-w-[1000px] text-4xl font-semibold text-white sm:text-5xl md:text-6xl'>
					Forward alerts to physical devices through MQTT
				</h1>
				<p className='mt-4 max-w-[800px] text-base text-zinc-400 sm:text-lg'>
					A new way of knowing the status of your homelab. Create a webhook, define the instructions and connect MQTT
					clients such as ESP32.
				</p>
				<Button className='mt-6'>
					<Github /> GitHub
				</Button>
			</div>

			<div className='pointer-events-none -z-10 w-[160%] overflow-hidden lg:w-full lg:-translate-y-30'>
				<img src='/images/hero-image.png' className='h-full w-full' />
			</div>
		</section>
	);
};
