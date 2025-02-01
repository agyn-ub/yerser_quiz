'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QuizResult } from './QuizResult'

interface Question {
	id: number
	question: string
	options: string[]
	correctAnswer: string
}

export function QuizContainer({ questions }: { questions: Question[] }) {
	const router = useRouter()
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [score, setScore] = useState(0)
	const [showResult, setShowResult] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleAnswer = async (answer: string) => {
		if (isSubmitting) return // Prevent multiple submissions

		const isCorrect = answer === questions[currentQuestion].correctAnswer
		if (isCorrect) setScore(score + 1)

		if (currentQuestion + 1 < questions.length) {
			setCurrentQuestion(currentQuestion + 1)
		} else {
			setIsSubmitting(true) // Disable buttons while saving
			const finalScore = score + (isCorrect ? 1 : 0)
			const saved = await saveScore(finalScore)
			setShowResult(true)
			if (!saved) {
				setSaveError('Не удалось сохранить результат. Попробуйте еще раз.')
			}
			setIsSubmitting(false)
		}
	}

	const saveScore = async (finalScore: number) => {
		try {
			const response = await fetch('/api/quiz/score', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					score: finalScore,
					correctAnswers: finalScore,
				}),
			})
			
			if (!response.ok) {
				throw new Error('Failed to save score')
			}
			
			return true
		} catch (error) {
			console.error('Error saving score:', error)
			return false
		}
	}

	const handleRetry = () => {
		setSaveError(null)
		router.push('/quiz/start')
	}

	if (showResult) {
		return (
			<QuizResult 
				score={score} 
				totalQuestions={questions.length} 
				onRetry={handleRetry}
				error={saveError}
			/>
		)
	}

	if (!questions.length) {
		return null
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="quiz-container p-6"
		>
			<div className="mb-6">
				<h2 className="quiz-heading text-2xl mb-2">
					Вопрос {currentQuestion + 1} из {questions.length}
				</h2>
				<p className="quiz-text text-lg">{questions[currentQuestion].question}</p>
			</div>
			<div className="space-y-3">
				{questions[currentQuestion].options.map((option, index) => (
					<button
						key={index}
						onClick={() => handleAnswer(option)}
						disabled={isSubmitting}
						className={`w-full p-4 text-left text-[17px] font-medium bg-white border border-gray-200/80 rounded-xl mb-2 transition-colors ${
							isSubmitting 
								? 'opacity-50 cursor-not-allowed' 
								: 'active:bg-gray-50 hover:border-blue-200'
						}`}
					>
						{option}
					</button>
				))}
			</div>
		</motion.div>
	)
} 