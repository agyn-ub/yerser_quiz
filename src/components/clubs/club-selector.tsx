'use client'

import { motion } from 'framer-motion'
import { useClubSelection } from '@/hooks/useClubSelection'
import { ClubCard } from './club-card'
import { clubs } from '@/data/clubs'

export function ClubSelector() {
  const { isLoading, selectedClubId, error, handleClubSelect } = useClubSelection()

  return (
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