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
        // First, check if already authenticated
        const checkResponse = await fetch('/api/auth/check', {
          credentials: 'include'
        })

        if (checkResponse.ok) {
          const { authenticated, user: authUser } = await checkResponse.json()
          if (authenticated) {
            router.replace(authUser.selectedClubId ? '/' : '/select-club')
            return
          }
        }

        // If not authenticated, proceed with authentication
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
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Authentication failed')
        }

        const data = await response.json()

        if (data.success) {
          router.replace(data.redirect)
        } else {
          throw new Error(data.error || 'Authentication failed')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        setAuthError('Failed to authenticate. Please try again.')
      } finally {
        setIsAuthenticating(false)
      }
    }

    authenticate()
  }, [user, router, isAuthenticating])

  if (user && isAuthenticating) {
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
            Пожалуйста, войдите через Telegram...
          </p>
        )}
      </div>
    </div>
  )
} 