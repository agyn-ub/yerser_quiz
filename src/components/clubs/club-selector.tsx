'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTelegram } from '@/hooks/useTelegram'
import { useRouter } from 'next/navigation'

interface Club {
  id: number
  name: string
  icon: string
  slug: string
}

const clubs: Club[] = [
  { id: 1, name: 'Real Madrid', icon: '/clubs/real-madrid.png', slug: 'real-madrid' },
  { id: 2, name: 'Barcelona', icon: '/clubs/barcelona.png', slug: 'barcelona' },
  { id: 3, name: 'Manchester United', icon: '/clubs/manchester-united.png', slug: 'manchester-united' },
  { id: 4, name: 'Liverpool', icon: '/clubs/liverpool.png', slug: 'liverpool' },
  { id: 5, name: 'Bayern Munich', icon: '/clubs/bayern-munich.png', slug: 'bayern-munich' },
  { id: 6, name: 'Arsenal', icon: '/clubs/arsenal.png', slug: 'arsenal' },
  { id: 7, name: 'Chelsea', icon: '/clubs/chelsea.png', slug: 'chelsea' },
]

export function ClubSelector() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClubSelect = async (clubId: number) => {
    try {
      setIsLoading(true)
      const telegramId = localStorage.getItem('telegram_id')
      
      if (!telegramId) {
        router.replace('/auth')
        return
      }

      const response = await fetch('/api/user/select-club', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clubId,
          telegramId
        }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('selected_club_id', clubId.toString())
        // Reload the page instead of using window.location
        router.refresh()
        router.push('/')
      } else {
        throw new Error(data.error || 'Failed to select club')
      }
    } catch (error) {
      console.error('Error selecting club:', error)
      setError('Failed to select club. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {clubs.map((club) => (
        <motion.button
          key={club.id}
          onClick={() => handleClubSelect(club.id)}
          disabled={isLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center space-y-2 disabled:opacity-50"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <Image
              src={club.icon}
              alt={club.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 4rem, 5rem"
            />
          </div>
          <span className="text-sm font-medium text-gray-800">{club.name}</span>
        </motion.button>
      ))}
      {error && (
        <p className="col-span-full text-center text-red-500 mt-4">{error}</p>
      )}
    </div>
  )
} 