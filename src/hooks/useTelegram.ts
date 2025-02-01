'use client'

import { useEffect, useState } from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    const checkTelegramUser = () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user
        if (user) {
          setUser(user)
        }
      }
    }

    // Try to get user immediately
    checkTelegramUser()

    // Fallback: try again after a short delay
    const timer = setTimeout(checkTelegramUser, 1000)

    return () => clearTimeout(timer)
  }, [])

  return { user }
} 