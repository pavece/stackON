import { HeroSection } from './components/sections/hero-section';
import { NavBar } from './components/navbar';
import { HowItWorksSection } from './components/sections/how-section';
import { FeaturesSection } from './components/sections/features-section';
import { Footer } from './components/sections/footer';

function App() {
	return (
		<main className='flex w-full flex-col items-center justify-center overflow-x-hidden'>
			<div className='flex w-full flex-col items-center justify-center overflow-x-hidden p-5'>
				<NavBar />
				<HeroSection />
				<HowItWorksSection />
				<FeaturesSection />
			</div>

			<Footer />
		</main>
	);
}

export default App;
