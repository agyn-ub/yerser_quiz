import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import { quizQuestions } from './schema'

dotenv.config()

const questions = [
	{
		question: 'В каком году был основан Реал Мадрид?',
		correctAnswer: '1902',
		options: ['1902', '1896', '1910', '1920'],
		difficulty: 'easy',
	},
	{
		question: 'Сколько раз Реал Мадрид выигрывал Лигу Чемпионов/Кубок Европейских Чемпионов?',
		correctAnswer: '14',
		options: ['14', '12', '10', '13'],
		difficulty: 'easy',
	},
	{
		question: 'Кто является рекордсменом по количеству голов за Реал Мадрид?',
		correctAnswer: 'Криштиану Роналду',
		options: ['Криштиану Роналду', 'Рауль', 'Альфредо Ди Стефано', 'Карим Бензема'],
		difficulty: 'easy',
	},
	{
		question: 'Как называется домашний стадион Реал Мадрид?',
		correctAnswer: 'Сантьяго Бернабеу',
		options: ['Сантьяго Бернабеу', 'Камп Ноу', 'Висенте Кальдерон', 'Альфредо Ди Стефано'],
		difficulty: 'easy',
	},
	{
		question: 'Какой игрок получил прозвище "Галактико"?',
		correctAnswer: 'Зинедин Зидан',
		options: ['Зинедин Зидан', 'Роналдо', 'Дэвид Бекхэм', 'Луиш Фигу'],
		difficulty: 'medium',
	},
	{
		question: 'В каком году Реал Мадрид выиграл свой первый Кубок Европейских Чемпионов?',
		correctAnswer: '1956',
		options: ['1956', '1960', '1955', '1958'],
		difficulty: 'medium',
	},
	{
		question: 'Кто является президентом Реал Мадрид с 2000 года?',
		correctAnswer: 'Флорентино Перес',
		options: ['Флорентино Перес', 'Рамон Кальдерон', 'Лоренцо Санс', 'Хорхе Вальдано'],
		difficulty: 'easy',
	},
	{
		question: 'Какой номер закреплен за Раулем в Реал Мадрид?',
		correctAnswer: '7',
		options: ['7', '9', '10', '11'],
		difficulty: 'medium',
	},
	{
		question: 'Кто забил победный гол в финале Лиги Чемпионов 2014 года против Атлетико?',
		correctAnswer: 'Серхио Рамос',
		options: ['Серхио Рамос', 'Гарет Бейл', 'Криштиану Роналду', 'Анхель Ди Мария'],
		difficulty: 'medium',
	},
	{
		question: 'Сколько раз Реал Мадрид выигрывал Ла Лигу?',
		correctAnswer: '35',
		options: ['35', '33', '30', '32'],
		difficulty: 'medium',
	},
	{
		question: 'Кто был первым тренером "галактикос"?',
		correctAnswer: 'Висенте Дель Боске',
		options: ['Висенте Дель Боске', 'Карло Анчелотти', 'Жозе Моуринью', 'Фабио Капелло'],
		difficulty: 'hard',
	},
	{
		question: 'В каком году Реал Мадрид выиграл свой первый чемпионат Испании?',
		correctAnswer: '1932',
		options: ['1932', '1929', '1935', '1930'],
		difficulty: 'hard',
	},
	{
		question: 'Кто является рекордсменом по количеству матчей за Реал Мадрид?',
		correctAnswer: 'Рауль',
		options: ['Рауль', 'Икер Касильяс', 'Мануэль Санчис', 'Серхио Рамос'],
		difficulty: 'medium',
	},
	{
		question: 'Какой игрок получил прозвище "Панкрат"?',
		correctAnswer: 'Хуанито',
		options: ['Хуанито', 'Бутрагеньо', 'Уго Санчес', 'Мичел'],
		difficulty: 'hard',
	},
	{
		question: 'В каком году Реал Мадрид выиграл свой последний требл?',
		correctAnswer: 'Никогда',
		options: ['Никогда', '2017', '2014', '2018'],
		difficulty: 'medium',
	},
	{
		question: 'Кто забил победный гол в финале Лиги Чемпионов 2018 против Ливерпуля?',
		correctAnswer: 'Гарет Бейл',
		options: ['Гарет Бейл', 'Карим Бензема', 'Криштиану Роналду', 'Марко Асенсио'],
		difficulty: 'medium',
	},
	{
		question: 'Какой тренер выиграл три Лиги Чемпионов подряд с Реал Мадрид?',
		correctAnswer: 'Зинедин Зидан',
		options: ['Зинедин Зидан', 'Карло Анчелотти', 'Висенте Дель Боске', 'Жозе Моуринью'],
		difficulty: 'easy',
	},
	{
		question: 'Кто является автором самого быстрого гола в истории Эль Класико?',
		correctAnswer: 'Карим Бензема',
		options: ['Карим Бензема', 'Роналдо', 'Рауль', 'Криштиану Роналду'],
		difficulty: 'hard',
	},
	{
		question: 'В каком году Реал Мадрид впервые надел белую форму?',
		correctAnswer: '1902',
		options: ['1902', '1900', '1905', '1910'],
		difficulty: 'hard',
	},
	{
		question: 'Какой игрок получил прозвище "Пятый Битл"?',
		correctAnswer: 'Франсиско Хенто',
		options: ['Франсиско Хенто', 'Раймон Копа', 'Ференц Пушкаш', 'Альфредо Ди Стефано'],
		difficulty: 'hard',
	},
	{
		question: 'Сколько голов забил Криштиану Роналду за Реал Мадрид?',
		correctAnswer: '450',
		options: ['450', '438', '445', '460'],
		difficulty: 'medium',
	},
	{
		question: 'Кто был капитаном команды в "Десиме"?',
		correctAnswer: 'Икер Касильяс',
		options: ['Икер Касильяс', 'Серхио Рамос', 'Криштиану Роналду', 'Марсело'],
		difficulty: 'medium',
	},
	{
		question: 'В каком году Реал Мадрид выиграл свой первый Кубок Испании?',
		correctAnswer: '1905',
		options: ['1905', '1902', '1908', '1910'],
		difficulty: 'hard',
	},
	{
		question: 'Какой номер носил Зинедин Зидан в Реал Мадрид?',
		correctAnswer: '5',
		options: ['5', '10', '21', '8'],
		difficulty: 'medium',
	},
	{
		question: 'Кто забил победный гол в финале Лиги Чемпионов 2022 против Ливерпуля?',
		correctAnswer: 'Винисиус Жуниор',
		options: ['Винисиус Жуниор', 'Карим Бензема', 'Федерико Вальверде', 'Родриго'],
		difficulty: 'easy',
	},
	{
		question: 'Какой игрок получил прозвище "Бутре"?',
		correctAnswer: 'Эмилио Бутрагеньо',
		options: ['Эмилио Бутрагеньо', 'Мичел', 'Уго Санчес', 'Хуанито'],
		difficulty: 'hard',
	},
	{
		question: 'Сколько раз Реал Мадрид выигрывал Суперкубок УЕФА?',
		correctAnswer: '5',
		options: ['5', '4', '6', '3'],
		difficulty: 'medium',
	},
	{
		question: 'Кто является рекордсменом по количеству матчей в качестве тренера Реал Мадрид?',
		correctAnswer: 'Мигель Муньос',
		options: ['Мигель Муньос', 'Зинедин Зидан', 'Висенте Дель Боске', 'Лео Бенхакер'],
		difficulty: 'hard',
	},
	{
		question: 'В каком году Реал Мадрид выиграл свой первый международный трофей?',
		correctAnswer: '1955',
		options: ['1955', '1956', '1960', '1950'],
		difficulty: 'hard',
	},
	{
		question: 'Какой игрок забил решающий пенальти в финале Лиги Чемпионов 2016 против Атлетико?',
		correctAnswer: 'Криштиану Роналду',
		options: ['Криштиану Роналду', 'Серхио Рамос', 'Гарет Бейл', 'Карим Бензема'],
		difficulty: 'medium',
	},
]

async function seed() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.NODE_ENV === 'production' 
			? { rejectUnauthorized: false } 
			: false,
	})

	const db = drizzle(pool)

	console.log('⏳ Seeding database...')

	try {
		// Clear existing questions
		await db.delete(quizQuestions)

		// Insert new questions
		for (const question of questions) {
			await db.insert(quizQuestions).values(question)
		}

		console.log('✅ Database seeded successfully!')
	} catch (error) {
		console.error('❌ Error seeding database:', error)
	} finally {
		await pool.end()
	}
}

seed() 