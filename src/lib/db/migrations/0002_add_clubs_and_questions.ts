import { sql } from 'drizzle-orm'
import { clubs, quizQuestions } from '../schema'

interface Question {
  question: string
  correctAnswer: string
  options: string[]
  difficulty: string
}

const clubsData = [
  { id: 1, name: 'Real Madrid', icon: '/clubs/real-madrid.png', slug: 'real-madrid' },
  { id: 2, name: 'Barcelona', icon: '/clubs/barcelona.png', slug: 'barcelona' },
  { id: 3, name: 'Manchester United', icon: '/clubs/manchester-united.png', slug: 'manchester-united' },
  { id: 4, name: 'Liverpool', icon: '/clubs/liverpool.png', slug: 'liverpool' },
  { id: 5, name: 'Bayern Munich', icon: '/clubs/bayern-munich.png', slug: 'bayern-munich' },
  { id: 6, name: 'Arsenal', icon: '/clubs/arsenal.png', slug: 'arsenal' },
  { id: 7, name: 'Chelsea', icon: '/clubs/chelsea.png', slug: 'chelsea' },
]

const questionsData: Record<string, Question[]> = {
  'real-madrid': [
    {
      question: 'В каком году был основан Реал Мадрид?',
      correctAnswer: '1902',
      options: ['1902', '1899', '1900', '1903'],
      difficulty: 'easy',
    },
    // ... existing Real Madrid questions
  ],
  'barcelona': [
    {
      question: 'Кто является рекордсменом по количеству голов за Барселону?',
      correctAnswer: 'Лионель Месси',
      options: ['Лионель Месси', 'Луис Суарес', 'Йохан Кройф', 'Ладислао Кубала'],
      difficulty: 'medium',
    },
    // Add more Barcelona questions
  ],
  'manchester-united': [
    {
      question: 'Кто является самым успешным тренером Манчестер Юнайтед?',
      correctAnswer: 'Сэр Алекс Фергюсон',
      options: ['Сэр Алекс Фергюсон', 'Мэтт Басби', 'Жозе Моуринью', 'Луи ван Гал'],
      difficulty: 'hard',
    },
    // Add more Manchester United questions
  ],
  // Add questions for other clubs...
}

export async function up(db: any) {
  // First, make club_id nullable temporarily
  await db.schema
    .alterTable('quiz_questions')
    .alterColumn('club_id')
    .dropNotNull()
    .execute()

  // Insert clubs
  for (const club of clubsData) {
    await db.insert(clubs).values(club).onConflictDoNothing()
  }

  // Update existing questions with club_id
  for (const [slug, questions] of Object.entries(questionsData)) {
    const club = clubsData.find(c => c.slug === slug)
    if (!club) continue

    // Update existing questions for this club
    await db.update(quizQuestions)
      .set({ clubId: club.id })
      .where(sql`club_id IS NULL`)
      .execute()

    // Insert new questions
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

  // Finally, make club_id non-null again
  await db.schema
    .alterTable('quiz_questions')
    .alterColumn('club_id')
    .setNotNull()
    .execute()
}

export async function down(db: any) {
  await db.delete(quizQuestions)
  await db.delete(clubs)
}