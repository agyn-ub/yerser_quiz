import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { quizQuestions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get('clubId')

    if (!clubId) {
      return NextResponse.json(
        { error: 'Club ID is required' },
        { status: 400 }
      )
    }

    // Get questions for selected club
    const rawQuestions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.clubId, parseInt(clubId)),
      orderBy: sql`RANDOM()`,
      limit: 15,
    })

    // Shuffle options for each question
    const questions = rawQuestions.map(question => {
      const allOptions = [question.correctAnswer, ...question.options]
      const shuffledOptions = shuffleArray(allOptions)
      const correctIndex = shuffledOptions.indexOf(question.correctAnswer)

      return {
        ...question,
        options: shuffledOptions,
        correctIndex
      }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
} 