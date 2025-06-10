import type { ReducedWebhook } from '@/interfaces/webhook.interface';
import { AlignJustify, Ellipsis, Pen } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router';
import { cutText } from '@/lib/utils';

export const WebhookCard = ({ webhook }: { webhook: ReducedWebhook }) => {
	return (
		<div className='rounded-md bg-accent border p-4 flex flex-row gap-2 justify-between'>
			<div>
				<Link to={`/webhook/${webhook.id}`}>
					<h1 className='text-xl text-card-foreground'>{cutText(webhook.title, 25)}</h1>
				</Link>
				<p className='text-sm text-muted-foreground'>{cutText(webhook.description, 40)}</p>
			</div>
			<div>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Ellipsis />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link to={`/webhook/${webhook.id}`}>
								<AlignJustify /> View details
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link to={`/edit/webhook/${webhook.id}`}>
								<Pen /> Edit
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
