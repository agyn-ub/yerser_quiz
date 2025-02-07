import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const telegramId = cookieStore.get('telegram_id')?.value

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
      with: {
        club: true,
      },
    })

    return NextResponse.json({
      selectedClubId: user?.selectedClubId,
      club: user?.club,
    })
  } catch (error) {
    console.error('Error fetching user club:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user club' },
      { status: 500 }
    )
  }
} 