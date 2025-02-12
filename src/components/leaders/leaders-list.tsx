'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Club {
  id: number
  name: string
  icon: string
  slug: string
}

interface Score {
  id: number
  score: number
  completedAt: string
  club: Club | null
  user: {
    firstName: string
    lastName: string | null
    username: string | null
  }
}

export function LeadersList() {
  const [scores, setScores] = useState<Score[]>([])
  const [selectedClub, setSelectedClub] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch scores based on selected club
  useEffect(() => {
    const fetchScores = async (retryCount = 0) => {
      try {
        setIsLoading(true)
        
        const globalUrl = selectedClub 
          ? `/api/quiz/results?clubId=${selectedClub}`
          : '/api/quiz/results'
        
        const response = await fetch(globalUrl, { cache: 'no-store' })
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        const data = await response.json()
        setScores(data.topScores || [])
        setError(null)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        if (retryCount < 3 && error instanceof Error && error.message.includes('ETIMEDOUT')) {
          setTimeout(() => fetchScores(retryCount + 1), 1000 * (retryCount + 1))
        } else {
          setError('Не удалось загрузить таблицу лидеров')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchScores()
  }, [selectedClub])

  const clubs = [
    { id: 1, name: 'Real Madrid', icon: '/clubs/real-madrid.png', slug: 'real-madrid' },
    { id: 2, name: 'Barcelona', icon: '/clubs/barcelona.png', slug: 'barcelona' },
    { id: 3, name: 'Manchester United', icon: '/clubs/manchester-united.png', slug: 'manchester-united' },
    { id: 4, name: 'Liverpool', icon: '/clubs/liverpool.png', slug: 'liverpool' },
    { id: 5, name: 'Bayern Munich', icon: '/clubs/bayern-munich.png', slug: 'bayern-munich' },
    { id: 6, name: 'Arsenal', icon: '/clubs/arsenal.png', slug: 'arsenal' },
    { id: 7, name: 'Chelsea', icon: '/clubs/chelsea.png', slug: 'chelsea' },
  ]

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedClub(null)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            selectedClub === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Все клубы
        </button>
        {clubs.map((club) => (
          <button
            key={club.id}
            onClick={() => setSelectedClub(club.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedClub === club.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="relative w-5 h-5">
              <Image
                src={club.icon}
                alt={club.name}
                fill
                className="object-contain"
              />
            </div>
            <span>{club.name}</span>
          </button>
        ))}
      </div>

      {/* Show loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Загрузка результатов...</p>
        </div>
      )}

      {/* Global scores section */}
      {!isLoading && scores.length > 0 && (
        <div className="space-y-2">
          {scores.map((score) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 p-4 rounded-xl"
            >
              <div className="flex items-center gap-2 min-w-0">
                {score.club && (
                  <Image
                    src={score.club.icon}
                    alt={score.club.name}
                    width={24}
                    height={24}
                    className="object-contain flex-shrink-0"
                  />
                )}
                <div className="min-w-0 w-full">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium truncate">
                      {score.user.firstName}
                      {score.user.lastName && ` ${score.user.lastName}`}
                      {score.user.username && ` (@${score.user.username})`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600 flex-shrink-0">
                        {score.score} правильных ответов
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 