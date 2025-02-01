'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface QuizResultProps {
  score: number
  totalQuestions: number
  onRetry: () => void
  error?: string | null
}

export function QuizResult({ score, totalQuestions, onRetry, error }: QuizResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-white rounded-2xl shadow-lg text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Квиз завершен!
      </h2>
      <div className="mb-8">
        <p className="text-2xl font-semibold text-blue-600">
          Ваш результат: {score} из {totalQuestions}
        </p>
        <p className="text-gray-600 mt-2">
          {score === totalQuestions 
            ? 'Отлично! Вы настоящий фанат Real Madrid!' 
            : 'Хороший результат! Продолжайте изучать историю клуба!'}
        </p>
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
      </div>
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {error ? 'Попробовать снова' : 'Играть снова'}
        </button>
        <Link
          href="/"
          className="block w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          На главную
        </Link>
      </div>
    </motion.div>
  )
} 