import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
	try {
		const userData = await request.json()
		const cookieStore = await cookies()

		// Check if user exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.telegramId, userData.telegramId),
		})

		let userId: number

		if (!existingUser) {
			// Create new user
			const [newUser] = await db.insert(users)
				.values({
					telegramId: userData.telegramId,
					firstName: userData.firstName,
					lastName: userData.lastName,
					username: userData.username,
				})
				.returning({ id: users.id })

			userId = newUser.id
		} else {
			// Update existing user
			await db.update(users)
				.set({
					firstName: userData.firstName,
					lastName: userData.lastName,
					username: userData.username,
				})
				.where(eq(users.telegramId, userData.telegramId))

			userId = existingUser.id
		}

		// Set telegram_id cookie
		cookieStore.set('telegram_id', userData.telegramId)

		return NextResponse.json({ success: true, userId })
	} catch (error) {
		console.error('Auth error:', error)
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 500 }
		)
	}
} 