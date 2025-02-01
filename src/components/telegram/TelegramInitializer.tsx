'use client'

import { useEffect } from 'react'

export function TelegramInitializer() {
	useEffect(() => {
		const initializeTelegram = () => {
			if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
				const tg = window.Telegram.WebApp
				tg.ready()
				tg.expand()
			}
		}

		// Try to initialize immediately
		initializeTelegram()

		// Fallback: try again after a short delay
		const timer = setTimeout(initializeTelegram, 1000)

		return () => clearTimeout(timer)
	}, [])

	return null
} 