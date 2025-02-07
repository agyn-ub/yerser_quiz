import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import { clubs } from './schema'

dotenv.config()

const clubsData = [
  { id: 1, name: 'Real Madrid', icon: '/clubs/real-madrid.png', slug: 'real-madrid' },
  { id: 2, name: 'Barcelona', icon: '/clubs/barcelona.png', slug: 'barcelona' },
  { id: 3, name: 'Manchester United', icon: '/clubs/manchester-united.png', slug: 'manchester-united' },
  { id: 4, name: 'Liverpool', icon: '/clubs/liverpool.png', slug: 'liverpool' },
  { id: 5, name: 'Bayern Munich', icon: '/clubs/bayern-munich.png', slug: 'bayern-munich' },
  { id: 6, name: 'Arsenal', icon: '/clubs/arsenal.png', slug: 'arsenal' },
  { id: 7, name: 'Chelsea', icon: '/clubs/chelsea.png', slug: 'chelsea' },
]

async function seedClubs() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
  })

  const db = drizzle(pool)

  console.log('⏳ Seeding clubs...')

  try {
    // Clear existing clubs
    await db.delete(clubs)

    // Insert clubs
    for (const club of clubsData) {
      await db.insert(clubs).values(club)
    }

    console.log('✅ Clubs seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding clubs:', error)
  } finally {
    await pool.end()
  }
}

seedClubs()
  .then(() => process.exit(0))
  .catch(() => process.exit(1)) 