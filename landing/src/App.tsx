import { HeroSection } from './components/sections/hero-section';
import { NavBar } from './components/navbar';
import { HowItWorksSection } from './components/sections/how-section';

function App() {
	return (
		<main className='flex w-full flex-col items-center justify-center overflow-x-hidden p-5'>
			<NavBar />
			<HeroSection />
			<HowItWorksSection />
		</main>
	);
}

export default App;
