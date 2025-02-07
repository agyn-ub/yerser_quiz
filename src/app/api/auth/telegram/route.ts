import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
	try {
		const userData = await request.json()
		const cookieStore = cookies()

		// Check if user exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.telegramId, userData.telegramId),
			with: {
				selectedClub: true,
			},
		})

		let user = existingUser

		if (!existingUser) {
			// Create new user
			const [newUser] = await db.insert(users)
				.values({
					telegramId: userData.telegramId,
					firstName: userData.firstName,
					lastName: userData.lastName,
					username: userData.username,
				})
				.returning()

			user = newUser
		}

		// Set telegram_id cookie with proper options
		cookieStore.set('telegram_id', userData.telegramId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			// Set a reasonable expiration (e.g., 30 days)
			maxAge: 30 * 24 * 60 * 60
		})

		const response = NextResponse.json({
			success: true,
			user,
			redirect: user.selectedClubId ? '/' : '/select-club'
		})

		return response

	} catch (error) {
		console.error('Auth error:', error)
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 500 }
		)
	}
} 