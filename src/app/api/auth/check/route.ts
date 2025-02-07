import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const cookieStore = cookies()
    const telegramId = (await cookieStore).get('telegram_id')?.value

    if (!telegramId) {
      return NextResponse.json(
        { authenticated: false, error: 'No auth cookie' }, 
        { status: 401 }
      )
    }

    // Verify the user exists in the database
    const user = await db.query.users.findFirst({
      where: eq(users.telegramId, telegramId),
    })

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'User not found' }, 
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      authenticated: true,
      user 
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Auth check failed' },
      { status: 500 }
    )
  }
} 