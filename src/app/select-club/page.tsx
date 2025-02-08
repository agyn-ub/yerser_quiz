'use client'

import { useRouter } from 'next/navigation'
import { ClubSelector } from '@/components/clubs/club-selector'
import { PageTransition } from '@/components/ui/page-transition'
import { motion } from 'framer-motion'

export default function SelectClub() {
  const router = useRouter()

  const storedTelegramId = localStorage.getItem('telegram_id')
  if (!storedTelegramId) {
    router.replace('/auth')
    return null
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <motion.h1 
              className="text-2xl font-bold text-gray-800 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Выберите любимый клуб
            </motion.h1>
            <ClubSelector />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
} 