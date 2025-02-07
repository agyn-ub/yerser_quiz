import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const clubs = pgTable('clubs', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	icon: text('icon').notNull(), // URL or path to club icon
	slug: text('slug').unique().notNull(), // e.g., 'real-madrid', 'barcelona'
	createdAt: timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	telegramId: text('telegram_id').unique().notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	username: text('username'),
	selectedClubId: integer('selected_club_id').references(() => clubs.id),
	createdAt: timestamp('created_at').defaultNow(),
})

export const userRelations = relations(users, ({ many, one }) => ({
	scores: many(userScores),
	selectedClub: one(clubs, {
		fields: [users.selectedClubId],
		references: [clubs.id],
	}),
}))

export const quizQuestions = pgTable('quiz_questions', {
	id: serial('id').primaryKey(),
	clubId: integer('club_id').references(() => clubs.id).notNull(),
	question: text('question').notNull(),
	correctAnswer: text('correct_answer').notNull(),
	options: text('options').array().notNull(),
	difficulty: text('difficulty').notNull(),
})

export const quizQuestionsRelations = relations(quizQuestions, ({ one }) => ({
	club: one(clubs, {
		fields: [quizQuestions.clubId],
		references: [clubs.id],
	}),
}))

export const userScores = pgTable('user_scores', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id),
	clubId: integer('club_id').references(() => clubs.id),
	score: integer('score').notNull(),
	correctAnswers: integer('correct_answers').notNull(),
	completedAt: timestamp('completed_at').defaultNow(),
})

export const userScoresRelations = relations(userScores, ({ one }) => ({
	user: one(users, {
		fields: [userScores.userId],
		references: [users.id],
	}),
	club: one(clubs, {
		fields: [userScores.clubId],
		references: [clubs.id],
	}),
})) 