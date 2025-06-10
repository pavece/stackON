import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

/* NODE HEADER -------------------------------------------------------------- */

export type NodeHeaderProps = HTMLAttributes<HTMLElement>;

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export const NodeHeader = forwardRef<HTMLElement, NodeHeaderProps>(({ className, ...props }, ref) => {
	return (
		<header
			ref={ref}
			{...props}
			className={cn(
				'flex items-center justify-between gap-2 px-3 py-2',
				// Remove or modify these classes if you modify the padding in the
				// `<BaseNode />` component.
				className
			)}
		/>
	);
});

NodeHeader.displayName = 'NodeHeader';

/* NODE HEADER TITLE -------------------------------------------------------- */

export type NodeHeaderTitleProps = HTMLAttributes<HTMLHeadingElement> & {
	asChild?: boolean;
};

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export const NodeHeaderTitle = forwardRef<HTMLHeadingElement, NodeHeaderTitleProps>(
	({ className, asChild, ...props }, ref) => {
		const Comp = asChild ? Slot : 'h3';

		return <Comp ref={ref} {...props} className={cn(className, 'user-select-none flex-1 font-semibold')} />;
	}
);

NodeHeaderTitle.displayName = 'NodeHeaderTitle';

/* NODE HEADER ICON --------------------------------------------------------- */

export type NodeHeaderIconProps = HTMLAttributes<HTMLSpanElement>;

export const NodeHeaderIcon = forwardRef<HTMLSpanElement, NodeHeaderIconProps>(({ className, ...props }, ref) => {
	return <span ref={ref} {...props} className={cn(className, '[&>*]:size-5')} />;
});

NodeHeaderIcon.displayName = 'NodeHeaderIcon';

/* NODE HEADER ACTIONS ------------------------------------------------------ */

export type NodeHeaderActionsProps = HTMLAttributes<HTMLDivElement>;

/**
 * A container for right-aligned action buttons in the node header.
 */
export const NodeHeaderActions = forwardRef<HTMLDivElement, NodeHeaderActionsProps>(({ className, ...props }, ref) => {
	return <div ref={ref} {...props} className={cn('ml-auto flex items-center gap-1 justify-self-end', className)} />;
});

NodeHeaderActions.displayName = 'NodeHeaderActions';
