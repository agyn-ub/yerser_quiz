'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/hooks/useTelegram'

export default function Auth() {
  const router = useRouter()
  const { user } = useTelegram()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || isAuthenticating) return

    const authenticate = async () => {
      setIsAuthenticating(true)
      setAuthError(null)

      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telegramId: user.id.toString(),
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
          }),
        })

        if (!response.ok) {
          throw new Error('Authentication failed')
        }

        const data = await response.json()

        if (data.success) {
          localStorage.setItem('telegram_id', user.id.toString())
          
          if (data.user?.selectedClubId) {
            localStorage.setItem('selected_club_id', data.user.selectedClubId.toString())
            router.replace('/')
          } else {
            router.replace('/select-club')
          }
        } else {
          throw new Error(data.error || 'Authentication failed')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        setAuthError('Failed to authenticate. Please try again.')
        setIsAuthenticating(false)
      }
    }

    authenticate()
  }, [user, router, isAuthenticating])

  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Авторизация...
          </h1>
          <div className="animate-pulse bg-blue-100 h-2 w-full rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Авторизация через Telegram
        </h1>
        {authError ? (
          <div className="space-y-4">
            <p className="text-red-500">{authError}</p>
            <button
              onClick={() => {
                setIsAuthenticating(false)
                setAuthError(null)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        ) : (
          <p className="text-gray-600">
            {isAuthenticating ? 'Авторизация...' : 'Пожалуйста, войдите через Telegram...'}
          </p>
        )}
      </div>
    </div>
  )
} 