import { Github, Table } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router';

export const NavBar = () => {
	return (
		<nav className='mb-10 flex justify-between'>
			<Link to='/'>
				<img src='/images/logo.svg' alt='StackON logo' className='w-[140px]' />
			</Link>

			<div className='flex items-center gap-2'>
				<Button asChild variant='ghost'>
					<Link to='/events'>
						<Table /> Event history
					</Link>
				</Button>
				<Button asChild className='cursor-pointer' variant='secondary'>
					<a href='https://github.com/pavece/stackON' rel='noopneer noreferer' target='blank'>
						<Github /> GitHub
					</a>
				</Button>
			</div>
		</nav>
	);
};
