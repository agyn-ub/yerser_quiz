import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { users, quizQuestions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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
    const questions = await db.query.quizQuestions.findMany({
      where: eq(quizQuestions.clubId, user.selectedClubId),
      orderBy: sql`RANDOM()`,
      limit: 15,
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