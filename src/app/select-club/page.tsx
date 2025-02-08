'use client'

import { useRouter } from 'next/navigation'
import { ClubSelector } from '@/components/clubs/club-selector'

export default function SelectClub() {
  const router = useRouter()

  const storedTelegramId = localStorage.getItem('telegram_id')
  if (!storedTelegramId) {
    router.replace('/auth')
    return
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Выберите любимый клуб
          </h1>
          <ClubSelector />
        </div>
      </div>
    </div>
  )
} 