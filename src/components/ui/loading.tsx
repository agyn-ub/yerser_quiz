export function Loading() {
	return (
		<div className="relative">
			<div className="w-20 h-20">
				<div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full animate-pulse" />
				<div className="absolute top-0 left-0 w-full h-full border-8 border-blue-600 rounded-full animate-spin border-t-transparent" />
			</div>
			<div className="absolute inset-0 flex items-center justify-center">
				<svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
					<path d="M19.7,8.3L19.7,8.3c-0.4-0.4-1-0.4-1.4,0l-6.9,6.9l-4.7-4.7c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.4,5.4 c0.4,0.4,1,0.4,1.4,0l7.6-7.6C20.1,9.3,20.1,8.7,19.7,8.3z" />
				</svg>
			</div>
		</div>
	)
} 