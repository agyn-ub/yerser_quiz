'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Score {
  id: number
  score: number
  completedAt: string
  user: {
    firstName: string
    lastName: string | null
    username: string | null
  }
}

export function LeadersList() {
  const [scores, setScores] = useState<Score[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchScores = async (retryCount = 0) => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/quiz/results', { 
          cache: 'no-store',
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard')
        }

        const data = await response.json()
        setScores(data.topScores || [])
        setError(null)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        
        // Retry logic for timeout errors (up to 3 times)
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
  }, [])

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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-xl animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (scores.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        Пока нет результатов
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {scores.map((score, index) => (
        <motion.div
          key={score.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 p-4 rounded-xl flex items-center"
        >
          <span className="text-2xl font-bold text-blue-600 mr-4">#{index + 1}</span>
          <div>
            <p className="font-medium">
              {score.user.firstName} {score.user.lastName}
              {score.user.username && <span className="text-gray-500"> @{score.user.username}</span>}
            </p>
            <p className="text-blue-600">{score.score} правильных ответов</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 