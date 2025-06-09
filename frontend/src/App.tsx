import { BrowserRouter, Route, Routes } from 'react-router';
import { MainPage } from './pages/main-page';
import { MainLayout } from './layouts/main-layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebhookDetailPage } from './pages/webhook-detail';

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route element={<MainLayout />}>
							<Route path='/' element={<MainPage />} />
							<Route path='/webhook/:id' element={<WebhookDetailPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</>
	);
}

export default App;
