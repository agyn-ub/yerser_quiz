'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UseClubSelectionProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useClubSelection({ onSuccess, onError }: UseClubSelectionProps = {}) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId, telegramId }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('selected_club_id', clubId.toString())
        await new Promise(resolve => setTimeout(resolve, 800))
        onSuccess?.()
        router.replace('/')
      } else {
        throw new Error(data.error || 'Failed to select club')
      }
    } catch (error) {
      const errorMessage = 'Failed to select club. Please try again.'
      console.error('Error selecting club:', error)
      setError(errorMessage)
      setSelectedClubId(null)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    selectedClubId,
    error,
    handleClubSelect,
  }
} 