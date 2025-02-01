'use client'

import Link from 'next/link'
import { useTelegram } from '@/hooks/useTelegram'

export default function Home() {
	const { user } = useTelegram()

	if (!user) {
		return null
	}

	return (
		<div className="min-h-screen p-4 sm:p-6 md:p-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-lg p-8">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
							Real Madrid Quiz
						</h1>
						<div className="bg-blue-50 rounded-full px-4 py-2">
							<span className="text-blue-600 font-medium">
								Beta
							</span>
						</div>
					</div>
					
					<div className="space-y-6">
						<div className="bg-gray-50 rounded-xl p-6">
							<h2 className="text-lg font-semibold text-gray-800 mb-4">
								Профиль игрока
							</h2>
							<div className="space-y-3">
								<p className="text-gray-700">
									<span className="font-medium">Имя:</span>{' '}
									{user.first_name}
								</p>
								{user.last_name && (
									<p className="text-gray-700">
										<span className="font-medium">Фамилия:</span>{' '}
										{user.last_name}
									</p>
								)}
								{user.username && (
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
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
