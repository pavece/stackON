'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

export type Event = {
	id: string;
	eventId: string;
	firedAt: Date;
	webhookId: string;
	status: string;
};

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: 'firedAt',
		header: 'Fire date',
		cell: ({ row }) => {
			return <div>{new Date(row.original.firedAt).toLocaleString()}</div>;
		},
	},
	{
		accessorKey: 'eventId',
		header: 'Event name',
		cell: ({ row }) => {
			return <div>{row.original.eventId.split(':')[0]}</div>;
		},
	},
	{
		accessorKey: 'eventId',
		header: 'Event source',
		cell: ({ row }) => {
			const splitted = row.original.eventId.split(':');
			return <div>{splitted[1]}</div>;
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			return <div className={`${row.original.status == 'resolved' && 'text-green-500'}`}>{row.original.status}</div>;
		},
	},
	{
		accessorKey: 'eventId',
		header: 'Severity',
		cell: ({ row }) => {
			const splitted = row.original.eventId.split(':');
			return <div>{splitted.at(-1)}</div>;
		},
	},
	{
		accessorKey: 'webhookId',
		header: 'Webhook',
		cell: ({ row }) => {
			return (
				<Link to={'/webhook/' + row.original.webhookId} className='underline text-blue-500'>
					Webhook details
				</Link>
			);
		},
	},
];
