'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useClubSelection } from '@/hooks/useClubSelection'
import { ClubCard } from './club-card'
import { clubs } from '@/data/clubs'
import { LoadingState } from '@/components/ui/loading-state'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'
import { useEffect, useState } from 'react'

export function ClubSelector() {
  const { isLoading, selectedClubId, error, handleClubSelect } = useClubSelection()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading for better UX
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <LoadingSkeleton 
          className="h-32 sm:h-40" 
          count={6} 
        />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading && selectedClubId ? (
        <LoadingState text="Выбор клуба..." />
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              isSelected={selectedClubId === club.id}
              isDisabled={isLoading}
              onSelect={handleClubSelect}
            />
          ))}
          <AnimatePresence>
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
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 