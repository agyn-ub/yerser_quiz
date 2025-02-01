import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { quizQuestions } from '@/lib/db/schema'

export async function GET() {
  try {
    const questions = await db.query.quizQuestions.findMany({
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