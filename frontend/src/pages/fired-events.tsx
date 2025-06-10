import { DataTable } from '@/components/fired-events-page/data-table';
import { columns } from '../components/fired-events-page/columns';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/api/api-client';
import { Loader } from 'lucide-react';
import { Error } from '@/components/ui/error';

export const FiredEventsPage = () => {
	const { isLoading, isError, data: { data: events } = {} } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <Error error='Error while fetching the fired events history' />;
	}

	return (
		<div>
			<div className='mb-4'>
				<h1 className='text-3xl font-semibold'>Fired events</h1>
				<p>History of the events fired using each webhook.</p>
			</div>

			<DataTable columns={columns} data={events || []} />
		</div>
	);
};
