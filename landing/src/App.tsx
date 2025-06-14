import { HeroSection } from './components/hero-section';
import { NavBar } from './components/navbar';

function App() {
	return (
		<main className='flex w-full items-start justify-center'>
			<div className='flex w-full max-w-[1440px] flex-col items-start justify-start p-5'>
				<NavBar />
				<HeroSection />
			</div>
		</main>
	);
}

export default App;
