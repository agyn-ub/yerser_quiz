import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { users, quizQuestions } from '@/lib/db/schema'
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

export async function GET() {
  try {
    const cookieStore = cookies()
    const telegramId = (await cookieStore).get('telegram_id')?.value

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's selected club
    const user = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
    })

    if (!user?.selectedClubId) {
      return NextResponse.json(
        { error: 'No club selected' },
        { status: 400 }
      )
    }

    // Get questions for selected club
    const rawQuestions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.clubId, user.selectedClubId),
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
        correctIndex // Store the index of correct answer
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