import { Github } from 'lucide-react';
import { Button } from '../button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(SplitText);

export const HeroSection = () => {
	const imageRef = useRef<HTMLImageElement>(null);

	useGSAP(() => {
		const tl = gsap.timeline();

		//Header text splitting
		const split = SplitText.create('.hero-header', {
			type: 'words',
		});

		tl.from(split.words, {
			duration: 1,
			y: 50,
			autoAlpha: 0,
			stagger: 0.05,
		});

		//Subheader text splitting
		tl.to(
			'.sub-header',
			{
				opacity: 1,
				y: 0,
				duration: 0.5,
			},
			0.5
		);

		tl.to('.hero-image', { opacity: 1, duration: 1, filter: 'blur(0px)' }, '<');
	});

	return (
		<section className='relative mt-16 flex w-full flex-col items-center justify-start'>
			<div className='w-full max-w-[1440px] items-center'>
				<h1 className='hero-header max-w-[1000px] text-4xl font-semibold text-white sm:text-5xl md:text-6xl'>
					Forward Alerts to Physical Devices via MQTT
				</h1>
				<p className='sub-header mt-4 max-w-[800px] translate-y-[50px] text-base text-zinc-500 opacity-0 sm:text-lg'>
					Create webhooks, define custom instructions, and control devices like ESP32 through MQTT to bring your homelab
					alerts to life.
				</p>
				<Button className='mt-6'>
					<a href='https://github.com/pavece/stackON' className='flex items-center gap-2'>
						<Github /> GitHub
					</a>
				</Button>
			</div>

			<div className='pointer-events-none -z-10 w-[160%] overflow-hidden lg:w-full lg:-translate-y-30'>
				<img src='/images/hero-image.png' ref={imageRef} className='hero-image h-full w-full opacity-0 blur-xl' />
			</div>
		</section>
	);
};
