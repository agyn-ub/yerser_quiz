import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { userScores, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// Define interfaces for type safety
interface User {
  id: number
  telegramId: string
  firstName: string | null
  lastName: string | null
  username: string | null
  createdAt: Date | null
}

interface UserScore {
  id: number
  userId: number | null
  score: number
  correctAnswers: number
  completedAt: Date | null
  user?: User
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const telegramId = searchParams.get('telegramId')

    // Get top 20 scores
    const topScores = await db.query.userScores.findMany({
      limit: 20,
      orderBy: [desc(userScores.score), desc(userScores.completedAt)],
      with: {
        user: true
      }
    })

    // Get user's scores if telegramId is provided
    let userScoresList: UserScore[] = []
    if (telegramId) {
      const user = await db.query.users.findFirst({
        where: eq(users.telegramId, telegramId),
      })

      if (user) {
        userScoresList = await db.query.userScores.findMany({
          where: eq(userScores.userId, user.id),
          orderBy: [desc(userScores.completedAt)],
          limit: 5
        })
      }
    }

    return NextResponse.json({ 
      topScores,
      userScores: userScoresList
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
} 