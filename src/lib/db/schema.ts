import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	telegramId: text('telegram_id').unique().notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	username: text('username'),
	createdAt: timestamp('created_at').defaultNow(),
})

export const userRelations = relations(users, ({ many }) => ({
	scores: many(userScores)
}))

export const quizQuestions = pgTable('quiz_questions', {
	id: serial('id').primaryKey(),
	question: text('question').notNull(),
	correctAnswer: text('correct_answer').notNull(),
	options: text('options').array().notNull(),
})

export const userScores = pgTable('user_scores', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => users.id),
	score: integer('score').notNull(),
	correctAnswers: integer('correct_answers').notNull(),
	completedAt: timestamp('completed_at').defaultNow(),
})

export const userScoresRelations = relations(userScores, ({ one }) => ({
	user: one(users, {
		fields: [userScores.userId],
		references: [users.id],
	})
})) 