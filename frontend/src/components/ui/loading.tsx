import { LoaderCircle } from 'lucide-react';

export const Loading = () => {
	return (
		<div className='flex items-center justify-center gap-2 text-muted-foreground text-sm p-4'>
			<LoaderCircle className='animate-spin w-4 h-4' />
			<span>Loading...</span>
		</div>
	);
};
