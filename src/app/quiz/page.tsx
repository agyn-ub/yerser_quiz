'use client'

import { useEffect, useState } from 'react'
import { QuizContainer } from '@/components/quiz/QuizContainer'
import { Loading } from '@/components/ui/loading'
import { Question } from '@/lib/types'

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/quiz/questions')
        if (!response.ok) throw new Error('Failed to fetch questions')
        const data = await response.json()
        setQuestions(data.questions)
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <QuizContainer questions={questions} />
      </div>
    </div>
  )
} 