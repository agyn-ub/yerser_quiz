import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import { quizQuestions } from './schema'

dotenv.config()

const questionsData = {
  // Real Madrid (ID: 1)
  1: [
    {
      question: 'В каком году был основан Реал Мадрид?',
      correctAnswer: '1902',
      options: ['1899', '1900', '1903'],
      difficulty: 'easy',
      clubId: 1
    },
    {
      question: 'Кто является рекордсменом по количеству голов за Реал Мадрид?',
      correctAnswer: 'Криштиану Роналду',
      options: ['Рауль', 'Карим Бензема', 'Альфредо Ди Стефано'],
      difficulty: 'easy',
      clubId: 1
    },
    {
      question: 'Сколько раз Реал Мадрид выигрывал Лигу чемпионов/Кубок европейских чемпионов?',
      correctAnswer: '14',
      options: ['12', '13', '15'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'Кто является президентом Реал Мадрид с 2000 года?',
      correctAnswer: 'Флорентино Перес',
      options: ['Рамон Кальдерон', 'Лоренцо Санс', 'Висенте Боларуде'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'В каком году Реал Мадрид выиграл свой первый Кубок европейских чемпионов?',
      correctAnswer: '1956',
      options: ['1955', '1957', '1958'],
      difficulty: 'hard',
      clubId: 1
    },
    {
      question: 'Какой стадион является домашней ареной Реал Мадрид?',
      correctAnswer: 'Сантьяго Бернабеу',
      options: ['Висенте Кальдерон', 'Камп Ноу', 'Метрополитано'],
      difficulty: 'easy',
      clubId: 1
    },
    {
      question: 'Кто из этих игроков никогда не играл за Реал Мадрид?',
      correctAnswer: 'Лионель Месси',
      options: ['Луис Фиго', 'Михаэль Лаудруп', 'Самуэль Это\'о'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'Какое прозвище у Реал Мадрид?',
      correctAnswer: 'Los Blancos',
      options: ['Los Colchoneros', 'Los Culés', 'Los Leones'],
      difficulty: 'easy',
      clubId: 1
    },
    {
      question: 'Кто забил победный гол в финале Лиги чемпионов 2014 года против Атлетико?',
      correctAnswer: 'Серхио Рамос',
      options: ['Гарет Бэйл', 'Криштиану Роналду', 'Анхель Ди Мария'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'Сколько раз Реал Мадрид выигрывал Ла Лигу?',
      correctAnswer: '35',
      options: ['33', '34', '36'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'Кто был главным тренером Реал Мадрид во время "La Décima"?',
      correctAnswer: 'Карло Анчелотти',
      options: ['Жозе Моуринью', 'Зинедин Зидан', 'Рафаэль Бенитес'],
      difficulty: 'hard',
      clubId: 1
    },
    {
      question: 'В каком году Реал Мадрид подписал Криштиану Роналду?',
      correctAnswer: '2009',
      options: ['2008', '2010', '2011'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'Кто из этих игроков выиграл больше всего трофеев с Реал Мадрид?',
      correctAnswer: 'Марсело',
      options: ['Икер Касильяс', 'Рауль', 'Криштиану Роналду'],
      difficulty: 'hard',
      clubId: 1
    },
    {
      question: 'Какой игрок забил победный гол в финале Лиги чемпионов 2022 года?',
      correctAnswer: 'Винисиус Жуниор',
      options: ['Карим Бензема', 'Федерико Вальверде', 'Лука Модрич'],
      difficulty: 'medium',
      clubId: 1
    },
    {
      question: 'Кто был первым "Галактикос", подписанным Флорентино Пересом?',
      correctAnswer: 'Луиш Фигу',
      options: ['Зинедин Зидан', 'Роналдо', 'Дэвид Бекхэм'],
      difficulty: 'hard',
      clubId: 1
    }
  ],
  // Barcelona (ID: 2)
  2: [
    {
      question: 'В каком году был основан ФК Барселона?',
      correctAnswer: '1899',
      options: ['1898', '1900', '1901'],
      difficulty: 'easy',
      clubId: 2
    },
    // ... Add 14 more questions for Barcelona
  ],
  // Manchester United (ID: 3)
  3: [
    {
      question: 'В каком году был основан Манчестер Юнайтед?',
      correctAnswer: '1878',
      options: ['1880', '1876', '1882'],
      difficulty: 'easy',
      clubId: 3
    },
    // ... Add 14 more questions for Manchester United
  ],
  // Liverpool (ID: 4)
  4: [
    {
      question: 'В каком году был основан ФК Ливерпуль?',
      correctAnswer: '1892',
      options: ['1890', '1891', '1893'],
      difficulty: 'easy',
      clubId: 4
    },
    // Add more Liverpool questions with clubId: 4
  ],
  // Bayern Munich (ID: 5)
  5: [
    {
      question: 'В каком году был основан Бавария Мюнхен?',
      correctAnswer: '1900',
      options: ['1899', '1901', '1902'],
      difficulty: 'easy',
      clubId: 5
    },
    // Add more Bayern Munich questions with clubId: 5
  ],
  // Arsenal (ID: 6)
  6: [
    {
      question: 'В каком году был основан ФК Арсенал?',
      correctAnswer: '1886',
      options: ['1885', '1887', '1888'],
      difficulty: 'easy',
      clubId: 6
    },
    // Add more Arsenal questions with clubId: 6
  ],
  // Chelsea (ID: 7)
  7: [
    {
      question: 'В каком году был основан ФК Челси?',
      correctAnswer: '1905',
      options: ['1904', '1906', '1907'],
      difficulty: 'easy',
      clubId: 7
    },
    // Add more Chelsea questions with clubId: 7
  ]
}

async function seedQuestions() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
  })

  const db = drizzle(pool)

  console.log('⏳ Seeding questions...')

  try {
    // Clear existing questions
    await db.delete(quizQuestions)

    // Insert questions for each club
    for (const [clubId, questions] of Object.entries(questionsData)) {
      // Insert questions for this club
      for (const q of questions) {
        await db.insert(quizQuestions).values({
          clubId: parseInt(clubId),
          question: q.question,
          correctAnswer: q.correctAnswer,
          options: q.options,
          difficulty: q.difficulty,
        })
      }

      console.log(`✅ Seeded questions for club ID: ${clubId}`)
    }

    console.log('✅ All questions seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding questions:', error)
  } finally {
    await pool.end()
  }
}

// Run the seed function
seedQuestions() 