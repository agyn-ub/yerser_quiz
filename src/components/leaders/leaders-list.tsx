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

  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch('/api/quiz/results', { 
        cache: 'no-store',
      })
      const data = await response.json()
      setScores(data.topScores)
    }

    fetchScores()
  }, [])

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