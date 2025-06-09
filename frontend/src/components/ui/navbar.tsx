import { Github } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router';

export const NavBar = () => {
	return (
		<nav className='mb-10 flex justify-between'>
			<Link to='/'>
				<img src='/images/logo.svg' alt='StackON logo' className='w-[140px]' />
			</Link>

			<Button asChild className='cursor-pointer' variant='ghost'>
				<a href='https://github.com/pavece/stackON' rel='noopneer noreferer' target='blank'>
					<Github /> GitHub
				</a>
			</Button>
		</nav>
	);
};
