import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';

const formSchema = z.object({
	title: z.string().min(2).max(50),
	description: z.string().min(10).max(200),
	topic: z.string().min(3).max(50),
	type: z.enum(['latch', 'once']),
});

interface Props {
	type: 'latch' | 'once';
	isCreation: boolean;
	submiting: boolean;
	onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export const WebhookForm = ({ onSubmit, type, isCreation, submiting: creating }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			topic: '',
			type,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder='My awesome hook' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='topic'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Topic</FormLabel>
							<FormControl>
								<Input placeholder='esp/beacon' {...field} />
							</FormControl>
							<FormDescription>MQTT events will be sent to this topic</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='type'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Topic</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className='min-w-[140px]'>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='latch'>Latch</SelectItem>
									<SelectItem value='once'>Once</SelectItem>
								</SelectContent>
							</Select>

							<FormDescription>
								Once will trigger the execution only once, latch will trigger until you call the webhook with a resolved
								event.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{creating ? (
					<Button type='submit' className='w-full' disabled>
						Loading...
					</Button>
				) : (
					<Button type='submit' className='w-full'>
						{isCreation ? 'Create' : 'Update'}
					</Button>
				)}
			</form>
		</Form>
	);
};
