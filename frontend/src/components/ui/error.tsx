import { AlertTriangle } from 'lucide-react';

type Props = {
	error: string;
};

export const Error = ({ error }: Props) => {
	return (
		<div className='flex items-center justify-center gap-2 text-destructive text-sm p-4'>
			<AlertTriangle className='w-4 h-4' />
			<span>{error}</span>
		</div>
	);
};
