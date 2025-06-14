import { HeroSection } from './components/hero-section';
import { NavBar } from './components/navbar';

function App() {
	return (
		<main className='flex w-full flex-col items-center justify-center overflow-x-hidden p-5'>
			<NavBar />
			<HeroSection />
		</main>
	);
}

export default App;
