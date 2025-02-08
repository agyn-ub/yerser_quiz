'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTelegram } from '@/hooks/useTelegram'

interface Score {
  id: number
  score: number
  completedAt: string
  club: {
    id: number
    name: string
    icon: string
  }
  user: {
    firstName: string
    lastName: string | null
    username: string | null
  }
}

export function ResultsList() {
  const { user } = useTelegram()
  const [scores, setScores] = useState<Score[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const clubId = localStorage.getItem('selected_club_id')
        const url = user 
          ? `/api/quiz/results?telegramId=${user.id}&clubId=${clubId}`
          : `/api/quiz/results?clubId=${clubId}`
        
        const response = await fetch(url, { cache: 'no-store' })
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results')
        }

        // Sort scores by score (highest first) and then by date (newest first)
        const sortedScores = data.topScores.sort((a: Score, b: Score) => {
          if (b.score !== a.score) {
            return b.score - a.score
          }
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        })
        
        setScores(sortedScores)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Произошла ошибка при загрузке результатов')
      }
    }

    if (user) {
      fetchScores()
    }
  }, [user])

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>
  }

  if (!user) return null

  return (
    <div className="space-y-3">
      {scores.map((score) => (
        <motion.div
          key={score.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-4 rounded-xl"
        >
          <div className="flex items-center gap-3">
            {score.club && (
              <img 
                src={score.club.icon} 
                alt={score.club.name} 
                className="w-6 h-6 object-contain"
              />
            )}
            <p className="text-lg font-medium text-blue-600">
              {score.score} правильных ответов
            </p>
          </div>
          <p className="text-sm text-gray-600">
            {format(new Date(score.completedAt), "d MMMM yyyy 'в' HH:mm", { locale: ru })}
          </p>
        </motion.div>
      ))}
      {scores.length === 0 && (
        <p className="text-gray-500 text-center py-4">У вас пока нет результатов</p>
      )}
    </div>
  )
} 