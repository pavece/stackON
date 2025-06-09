import { Check, Copy } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface Props {
	title: string;
	description: string;
	method: string;
	url: string;
}

export const CallUrl = ({ title, description, method, url }: Props) => {
	const [copied, setCopied] = useState(false);

	const copyURL = () => {
		navigator.clipboard.writeText(url).then(() => {
			setCopied(true);
		});
	};

	return (
		<div className='mt-5'>
			<h3 className='text-lg'>{title}</h3>
			<p className='text-md text-muted-foreground'>{description}</p>

			<div className='bg-accent rounded-md border font-mono flex justify-between p-2 items-center mt-2 overflow-x-hidden gap-2'>
				<div className='flex gap-4 items-center'>
					<div className='rounded-sm bg-background font-semibold p-2'>{method}</div>
					<div>
						<span>{url}</span>
					</div>
				</div>

				<Button className='font-sans' onClick={copyURL}>
					{copied ? <Check /> : <Copy />} Copy
				</Button>
			</div>
		</div>
	);
};
