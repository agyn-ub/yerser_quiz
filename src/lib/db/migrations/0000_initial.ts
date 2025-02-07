import { sql } from 'drizzle-orm'
import { clubs, quizQuestions, users, userScores } from '../schema'

export async function up(db: any) {
  // Create clubs table first
  await db.schema.createTable(clubs).execute()
  
  // Create users table with club reference
  await db.schema.createTable(users).execute()
  
  // Create quiz_questions table with club reference
  await db.schema.createTable(quizQuestions).execute()
  
  // Create user_scores table with user and club references
  await db.schema.createTable(userScores).execute()
  
  // Insert initial data
  for (const club of clubsData) {
    await db.insert(clubs).values(club).onConflictDoNothing()
  }

  for (const [slug, questions] of Object.entries(questionsData)) {
    const club = clubsData.find(c => c.slug === slug)
    if (!club) continue

    for (const q of questions) {
      await db.insert(quizQuestions).values({
        clubId: club.id,
        question: q.question,
        correctAnswer: q.correctAnswer,
        options: q.options,
        difficulty: q.difficulty,
      }).onConflictDoNothing()
    }
  }
}

export async function down(db: any) {
  await db.schema.dropTable(userScores).execute()
  await db.schema.dropTable(quizQuestions).execute()
  await db.schema.dropTable(users).execute()
  await db.schema.dropTable(clubs).execute()
} 