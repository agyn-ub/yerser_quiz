'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Club } from '@/types/club'

interface ClubCardProps {
  club: Club
  isSelected: boolean
  isDisabled: boolean
  onSelect: (clubId: number) => void
}

export function ClubCard({ club, isSelected, isDisabled, onSelect }: ClubCardProps) {
  return (
    <motion.button
      key={club.id}
      onClick={() => onSelect(club.id)}
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
      className={`
        relative p-4 bg-white rounded-xl shadow-md hover:shadow-lg 
        transition-all duration-200 flex flex-col items-center space-y-2
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isSelected && isDisabled ? 'pointer-events-none' : ''}
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
        {isSelected && isDisabled && (
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
} 