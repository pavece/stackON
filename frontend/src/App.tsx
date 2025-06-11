import { BrowserRouter, Route, Routes } from 'react-router';
import { MainPage } from './pages/main-page';
import { MainLayout } from './layouts/main-layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebhookDetailPage } from './pages/webhook-detail';
import { CreateWebhookPage } from './pages/create-webhook-page';
import { Toaster } from 'sonner';
import { ReactFlowProvider } from '@xyflow/react';
import { EditWebhookPage } from './pages/edit-webhook-page';
import { FiredEventsPage } from './pages/fired-events';
import { NotFoundPage } from './pages/not-found';

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ReactFlowProvider>
					<Toaster theme='dark' position='top-right' richColors />
					<BrowserRouter>
						<Routes>
							<Route element={<MainLayout />}>
								<Route path='/' element={<MainPage />} />
								<Route path='/webhook/:id' element={<WebhookDetailPage />} />
								<Route path='/create/webhook/' element={<CreateWebhookPage />} />
								<Route path='/edit/webhook/:id' element={<EditWebhookPage />} />
								<Route path='/events' element={<FiredEventsPage />} />
								<Route path='*' element={<NotFoundPage />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</ReactFlowProvider>
			</QueryClientProvider>
		</>
	);
}

export default App;
