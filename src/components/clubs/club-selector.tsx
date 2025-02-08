'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClubSelect = async (clubId: number) => {
    if (isLoading || selectedClubId === clubId) return

    try {
      setIsLoading(true)
      setSelectedClubId(clubId)
      setError(null)
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
        // Add delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800))
        router.replace('/')
      } else {
        throw new Error(data.error || 'Failed to select club')
      }
    } catch (error) {
      console.error('Error selecting club:', error)
      setError('Failed to select club. Please try again.')
      setSelectedClubId(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {clubs.map((club) => {
        const isSelected = selectedClubId === club.id
        const isDisabled = isLoading || (isSelected && isLoading)

        return (
          <motion.button
            key={club.id}
            onClick={() => handleClubSelect(club.id)}
            disabled={isDisabled}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={!isDisabled ? { 
              scale: 1.05,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            className={`relative p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center space-y-2
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              ${isSelected && isLoading ? 'pointer-events-none' : ''}
            `}
          >
            <motion.div 
              className="relative w-16 h-16 sm:w-20 sm:h-20"
              whileHover={!isDisabled ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={club.icon}
                alt={club.name}
                fill
                className={`object-contain transition-opacity duration-200 
                  ${isDisabled ? 'opacity-50' : 'opacity-100'}
                `}
                sizes="(max-width: 640px) 4rem, 5rem"
              />
              {isSelected && isLoading && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </motion.div>
              )}
            </motion.div>
            <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
              {club.name}
            </span>
            {isSelected && (
              <motion.div
                className="absolute inset-0 bg-blue-50/20 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        )
      })}
      {error && (
        <motion.p 
          className="col-span-full text-center text-red-500 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
} 