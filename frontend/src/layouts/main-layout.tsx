import { NavBar } from '@/components/ui/navbar';
import { Outlet } from 'react-router';

export const MainLayout = () => {
	return (
		<div className='flex items-start justify-center'>
			<div className='max-w-[1440px] flex flex-col w-full p-5'>
				<NavBar />
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	);
};
