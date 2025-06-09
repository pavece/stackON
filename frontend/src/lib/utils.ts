import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function cutText(text: string, len: number) {
	return text.length > len ? text.slice(0, len - 1) + '...' : text;
}
