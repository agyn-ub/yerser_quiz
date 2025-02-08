import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
	try {
		const userData = await request.json()
		let user

		// Check if user exists first
		const existingUser = await db.query.users.findFirst({
			where: eq(users.telegramId, userData.telegramId),
			with: {
				selectedClub: true,
			},
		})

		if (!existingUser) {
			// Create new user
			await db.insert(users).values({
				telegramId: userData.telegramId,
				firstName: userData.firstName,
				lastName: userData.lastName,
				username: userData.username,
			})

			// Fetch the newly created user with relations
			user = await db.query.users.findFirst({
				where: eq(users.telegramId, userData.telegramId),
				with: {
					selectedClub: true,
				},
			})
		} else {
			user = existingUser
		}

		return NextResponse.json({
			success: true,
			user,
			redirect: user?.selectedClubId ? '/' : '/select-club'
		})

	} catch (error) {
		console.error('Auth error:', error)
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 500 }
		)
	}
} 