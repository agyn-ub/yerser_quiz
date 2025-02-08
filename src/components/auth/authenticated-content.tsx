import Link from 'next/link'
import Image from 'next/image'
import { useTelegram } from '@/hooks/useTelegram'
import { ClubSelector } from '@/components/clubs/club-selector'
import { useEffect, useState } from 'react'

const clubs = [
	{ id: 1, name: 'Real Madrid', icon: '/clubs/real-madrid.png', slug: 'real-madrid' },
	{ id: 2, name: 'Barcelona', icon: '/clubs/barcelona.png', slug: 'barcelona' },
	{ id: 3, name: 'Manchester United', icon: '/clubs/manchester-united.png', slug: 'manchester-united' },
	{ id: 4, name: 'Liverpool', icon: '/clubs/liverpool.png', slug: 'liverpool' },
	{ id: 5, name: 'Bayern Munich', icon: '/clubs/bayern-munich.png', slug: 'bayern-munich' },
	{ id: 6, name: 'Arsenal', icon: '/clubs/arsenal.png', slug: 'arsenal' },
	{ id: 7, name: 'Chelsea', icon: '/clubs/chelsea.png', slug: 'chelsea' },
]

export function AuthenticatedContent() {
	const { user } = useTelegram()
	const [hasSelectedClub, setHasSelectedClub] = useState(false)
	const [selectedClub, setSelectedClub] = useState<typeof clubs[0] | null>(null)

	useEffect(() => {
		const checkClubSelection = async () => {
			const storedClubId = localStorage.getItem('selected_club_id')
			if (storedClubId) {
				const club = clubs.find(c => c.id === parseInt(storedClubId))
				setSelectedClub(club || null)
				setHasSelectedClub(true)
			} else {
				setHasSelectedClub(false)
			}
		}

		checkClubSelection()
	}, [])

	return (
		<div className="bg-white rounded-2xl shadow-lg p-8">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					{selectedClub && (
						<div className="relative w-20 h-20">
							<Image
								src={selectedClub.icon}
								alt={selectedClub.name}
								fill
								className="object-contain"
							/>
						</div>
					)}
				</div>
				<div className="bg-blue-50 rounded-full px-4 py-2">
					<span className="text-blue-600 font-medium">
						Beta
					</span>
				</div>
			</div>
			
			{!hasSelectedClub ? (
				<>
					<h2 className="text-xl font-semibold text-gray-800 mb-6">
						Выберите любимый клуб
					</h2>
					<ClubSelector />
				</>
			) : (
				<div className="space-y-6">
					<div className="bg-gray-50 rounded-xl p-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-4">
							Профиль игрока
						</h2>
						<div className="space-y-3">
							<p className="text-gray-700">
								<span className="font-medium">Имя:</span>{' '}
								{user?.first_name}
							</p>
							{user?.last_name && (
								<p className="text-gray-700">
									<span className="font-medium">Фамилия:</span>{' '}
									{user.last_name}
								</p>
							)}
							{user?.username && (
								<p className="text-gray-700">
									<span className="font-medium">Username:</span>{' '}
									@{user.username}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-3">
						<Link 
							href="/quiz/start"
							className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
						>
							Начать игру
						</Link>
						<Link 
							href="/results"
							className="block w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
						>
							Мои результаты
						</Link>
						<Link 
							href="/leaders"
							className="block w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
						>
							Таблица лидеров
						</Link>
						<Link 
							href="/select-club"
							className="block w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
						>
							Сменить клуб
						</Link>
						<button 
							onClick={() => {
								localStorage.removeItem('telegram_id')
								localStorage.removeItem('selected_club_id')
							}}
							className="block w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
						>
							Очистить кэш
						</button>
					</div>
				</div>
			)}
		</div>
	)
} 