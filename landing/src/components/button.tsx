import { type ReactNode } from 'react';

interface Props {
	children: ReactNode;
	className?: string;
}

export const Button = ({ children, className }: Props) => {
	return (
		<button
			className={`${className} flex cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-100 hover:bg-zinc-200`}
		>
			{children}
		</button>
	);
};
