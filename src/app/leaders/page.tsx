'use client'

import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Loading } from '@/components/ui/loading'
import Link from 'next/link'
import { LeadersList } from '@/components/leaders/leaders-list'
import { LeadersSkeleton } from '@/components/leaders/leaders-skeleton'

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

export default function LeadersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [topScores, setTopScores] = useState<Score[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/quiz/results', { cache: 'no-store' })
        const data = await response.json()
        setTopScores(data.topScores)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Вернуться на главную
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Таблица лидеров</h2>
          <Suspense fallback={<LeadersSkeleton />}>
            <LeadersList />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 