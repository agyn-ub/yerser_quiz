'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthenticatedContent } from '@/components/auth/authenticated-content'

export default function Home() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkAuthAndClub = async () => {
			const storedTelegramId = localStorage.getItem('telegram_id')
			if (!storedTelegramId) {
				setIsLoading(false)
				router.replace('/auth')
				return
			}

			const selectedClubId = localStorage.getItem('selected_club_id')
			if (!selectedClubId) {
				setIsLoading(false)
				router.replace('/select-club')
				return
			}

			setIsLoading(false)
		}

		checkAuthAndClub()
	}, [router])

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen p-4 sm:p-6 md:p-8">
			<div className="max-w-2xl mx-auto">
				<AuthenticatedContent />
			</div>
		</div>
	)
}
