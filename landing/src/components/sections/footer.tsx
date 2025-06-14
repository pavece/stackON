export const Footer = () => {
	return (
		<footer className='flex w-full flex-col items-center justify-start border-t border-zinc-700 pt-5 pb-10'>
			<div className='w-full max-w-[1440px] p-5'>
				<img src='/images/logo.svg' className='w-[140px]' />
				<div className='mt-5'>
					<p className='text-zinc-500'>
						Github:
						<a href='https://github.com/pavece/stackON' className='ml-2 font-medium underline'>
							https://github.com/pavece/stackON
						</a>
					</p>

					<p className='text-zinc-500'>
						Built by
						<a href='https://pavece.com' className='ml-2 font-medium underline'>
							Pavece
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};
