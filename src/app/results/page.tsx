'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loading } from '@/components/ui/loading'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import Link from 'next/link'
import { useTelegram } from '@/hooks/useTelegram'

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

export default function ResultsPage() {
  const { user } = useTelegram()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userScores, setUserScores] = useState<Score[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const url = user ? `/api/quiz/results?telegramId=${user.id}` : '/api/quiz/results'
        const response = await fetch(url, { cache: 'no-store' })
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results')
        }

        setUserScores(data.userScores)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Произошла ошибка при загрузке результатов')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [user])

  if (isLoading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Вернуться назад
        </Link>

        {user && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Мои результаты</h2>
            <div className="space-y-3">
              {userScores.map((score) => (
                <div key={score.id} className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-lg font-medium text-blue-600">
                    {score.score} правильных ответов
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(score.completedAt), "d MMMM yyyy 'в' HH:mm", { locale: ru })}
                  </p>
                </div>
              ))}
              {userScores.length === 0 && (
                <p className="text-gray-500 text-center py-4">У вас пока нет результатов</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
