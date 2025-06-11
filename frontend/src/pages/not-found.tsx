import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NotFoundPage = () => {
	return (
		<div className='flex items-center justify-center min-h-[500px]  px-4'>
			<Card className='w-full max-w-md text-center'>
				<CardHeader>
					<CardTitle className='text-4xl'>404 – Not Found</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground mb-6'>The page you're looking for doesn't exist or has been moved.</p>
					<Button asChild>
						<a href='/'>Return to Home</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
