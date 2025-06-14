import { BotMessageSquare, GitBranch, Table } from 'lucide-react';
import type React from 'react';

interface BentoCardProps {
	title: string;
	subtitle: string;
	className: string;
	icon: React.ReactNode;
}

const BentoCard = ({ title, subtitle, className, icon }: BentoCardProps) => {
	return (
		<article className={`${className} relative col-span-1 row-span-1 rounded-md bg-[#232323]`}>
			<div className='absolute top-4 right-4 rounded-full bg-[#18181896] p-3 backdrop-blur-lg'>{icon}</div>
			<div className='absolute bottom-4 left-4'>
				<h2 className='text-lg font-medium text-white lg:text-xl'>{title}</h2>
				<p className='text-zinc-500 lg:text-lg'>{subtitle}</p>
			</div>
		</article>
	);
};

export const FeaturesSection = () => {
	return (
		<section className='mx-auto mb-20 flex w-full max-w-[1440px] flex-col items-start justify-start px-4'>
			<h1 className='text-2xl font-semibold md:text-4xl'>Features</h1>
			<p className='text-md mt-2 text-zinc-500'>StackON comes with some interesting features...</p>

			<div className='mt-5 grid h-[1000px] w-full grid-cols-1 grid-rows-3 gap-4 md:h-[700px] md:grid-cols-6 md:grid-rows-2'>
				<BentoCard
					icon={<GitBranch />}
					className="bg-[url('/images/bento-instructions.svg')] bg-cover bg-center bg-no-repeat md:col-span-3 md:row-span-2"
					title='Action flow editor'
					subtitle='Easily customize the instructions you send over MQTT.'
				/>
				<BentoCard
					icon={<Table />}
					className="bg-[url('/images/bento-history.svg')] bg-center bg-no-repeat md:col-span-3 md:row-span-1"
					title='Event history'
					subtitle='Built in event history.'
				/>
				<BentoCard
					icon={<BotMessageSquare />}
					className="bg-[url('/images/bento-mcp.svg')] bg-cover bg-center bg-no-repeat md:col-span-3 md:row-span-1"
					title='MCP server'
					subtitle='Check information about webhooks and alerts using the built in MCP server.'
				/>
			</div>
		</section>
	);
};
