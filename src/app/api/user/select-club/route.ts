import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { clubId } = await request.json()
    const cookieStore = cookies()
    const telegramId = (await cookieStore).get('telegram_id')?.value

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user's selected club
    await db
      .update(users)
      .set({ 
        selectedClubId: clubId
      })
      .where(eq(users.telegramId, telegramId))

    // Get updated user with club info
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
      with: {
        selectedClub: true,
      },
    })

    return NextResponse.json({ 
      success: true,
      user: updatedUser 
    })
  } catch (error) {
    console.error('Error selecting club:', error)
    return NextResponse.json(
      { error: 'Failed to select club' },
      { status: 500 }
    )
  }
} 